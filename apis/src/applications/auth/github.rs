use crate::configs::app_context::AppContext;
use crate::pkg::error::{AppError, AppResult};
use crate::pkg::security::build_access_claims;
use crate::repositories::users::{CreateUserRecord, UpdateUserRecord, UsersRepository};
use crate::types::users::request_type::GithubLoginRequest;
use crate::types::users::response_type::{LoginResponse, UserResponse};
use base64::{Engine as _, engine::general_purpose::URL_SAFE_NO_PAD};

#[derive(serde::Deserialize)]
struct GithubAccessTokenResponse {
    access_token: String,
}

#[derive(serde::Deserialize)]
struct GithubEmail {
    email: String,
    primary: bool,
    verified: bool,
}

#[derive(serde::Deserialize)]
struct GithubUser {
    login: String,
    name: Option<String>,
    avatar_url: Option<String>,
}

fn generate_random_password() -> String {
    use rand::RngCore;
    let mut buf = [0u8; 32];
    rand::rngs::OsRng.fill_bytes(&mut buf);
    URL_SAFE_NO_PAD.encode(buf)
}

/// Log in with GitHub authorization code via OAuth.
pub async fn github_login(
    ctx: &AppContext,
    repo: &dyn UsersRepository,
    input: GithubLoginRequest,
) -> AppResult<LoginResponse> {
    if ctx.auth.github_client_id.is_empty() || ctx.auth.github_client_secret.is_empty() {
        return Err(AppError::ServiceUnavailable(
            "GitHub OAuth is not configured on server".into(),
        ));
    }

    // Exchange code for access token
    let token_url = "https://github.com/login/oauth/access_token";
    let params = serde_json::json!({
        "client_id": ctx.auth.github_client_id,
        "client_secret": ctx.auth.github_client_secret,
        "code": input.code,
    });
    let client = reqwest::Client::new();
    let token_res: GithubAccessTokenResponse = client
        .post(token_url)
        .header("Accept", "application/json")
        .json(&params)
        .send()
        .await
        .map_err(|e| AppError::ServiceUnavailable(e.to_string()))?
        .error_for_status()
        .map_err(|e| AppError::Unauthorized(format!("GitHub code exchange failed: {}", e)))?
        .json()
        .await
        .map_err(|e| AppError::ServiceUnavailable(e.to_string()))?;

    // Fetch primary, verified email
    let emails: Vec<GithubEmail> = client
        .get("https://api.github.com/user/emails")
        .bearer_auth(&token_res.access_token)
        .header("User-Agent", "execute-academy-api")
        .send()
        .await
        .map_err(|e| AppError::ServiceUnavailable(e.to_string()))?
        .error_for_status()
        .map_err(|e| AppError::Unauthorized(format!("GitHub get emails failed: {}", e)))?
        .json()
        .await
        .map_err(|e| AppError::ServiceUnavailable(e.to_string()))?;

    let Some(primary) = emails.into_iter().find(|e| e.primary && e.verified) else {
        return Err(AppError::Unauthorized(
            "No verified primary email on GitHub account".into(),
        ));
    };
    let email = primary.email.to_lowercase();

    // Fetch minimal user profile
    let gh_user: GithubUser = client
        .get("https://api.github.com/user")
        .bearer_auth(&token_res.access_token)
        .header("User-Agent", "execute-academy-api")
        .send()
        .await
        .map_err(|e| AppError::ServiceUnavailable(e.to_string()))?
        .error_for_status()
        .map_err(|e| AppError::Unauthorized(format!("GitHub get user failed: {}", e)))?
        .json()
        .await
        .map_err(|e| AppError::ServiceUnavailable(e.to_string()))?;

    // Find or create user
    let mut user = if let Some(u) = repo.find_by_email(&email).await? {
        u
    } else {
        // Create account with a random password
        let random_password = generate_random_password();
        let password_hash = ctx
            .password_hasher
            .hash(&random_password)
            .map_err(|e| AppError::Internal(e.to_string()))?;

        let mut desired_username = gh_user.login.to_lowercase();
        let create_attempt = repo
            .create(CreateUserRecord {
                username: desired_username.clone(),
                email: email.clone(),
                password_hash: password_hash.clone(),
                role: "user".into(),
            })
            .await;

        let id = match create_attempt {
            Ok(id) => id,
            Err(AppError::Conflict(_)) => {
                desired_username =
                    format!("{}{}", desired_username, chrono::Utc::now().timestamp());
                repo.create(CreateUserRecord {
                    username: desired_username,
                    email: email.clone(),
                    password_hash,
                    role: "user".into(),
                })
                .await?
            }
            Err(e) => return Err(e),
        };

        repo.find_by_id(id)
            .await?
            .ok_or_else(|| AppError::Internal("User not found after create".into()))?
    };

    // Ensure active and enrich profile best-effort
    if !user.is_active {
        let (first_name, last_name) = gh_user
            .name
            .as_deref()
            .map(|n| {
                let parts: Vec<&str> = n.split_whitespace().collect();
                if parts.is_empty() {
                    (None, None)
                } else if parts.len() == 1 {
                    (Some(parts[0].to_string()), None)
                } else {
                    (Some(parts[0].to_string()), Some(parts[1..].join(" ")))
                }
            })
            .unwrap_or((None, None));

        let _ = repo
            .update_partial(
                user.id,
                UpdateUserRecord {
                    is_active: Some(true),
                    first_name,
                    last_name,
                    avatar_url: gh_user.avatar_url,
                    ..Default::default()
                },
            )
            .await?;
        user = repo
            .find_by_id(user.id)
            .await?
            .ok_or_else(|| AppError::Internal("User not found".into()))?;
    }

    // Build tokens
    let access_claims = build_access_claims(
        &user.id.to_string(),
        &user.role,
        ctx.auth.access_ttl_seconds,
    );
    let refresh_claims = build_access_claims(
        &user.id.to_string(),
        &user.role,
        ctx.auth.refresh_ttl_seconds,
    );
    let access_token = ctx
        .jwt_service
        .sign(&access_claims)
        .map_err(|e| AppError::Internal(e.to_string()))?;
    let refresh_token = ctx
        .jwt_service
        .sign(&refresh_claims)
        .map_err(|e| AppError::Internal(e.to_string()))?;

    let user = UserResponse {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        is_active: user.is_active,
        is_blocked: user.is_blocked,
    };

    Ok(LoginResponse {
        user,
        access_token,
        refresh_token,
        token_type: "Bearer".into(),
        expires_in: ctx.auth.access_ttl_seconds,
    })
}
