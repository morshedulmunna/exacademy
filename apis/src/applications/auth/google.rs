use crate::configs::app_context::AppContext;
use crate::pkg::error::{AppError, AppResult};
use crate::pkg::security::build_access_claims;
use crate::repositories::users::{CreateUserRecord, UpdateUserRecord, UsersRepository};
use crate::types::users::request_type::GoogleLoginRequest;
use crate::types::users::response_type::{LoginResponse, UserResponse};
use base64::{Engine as _, engine::general_purpose::URL_SAFE_NO_PAD};

/// Minimal subset of Google's tokeninfo response we care about
#[derive(serde::Deserialize)]
struct GoogleTokenInfo {
    aud: String,
    email: String,
    #[serde(default)]
    email_verified: Option<String>,
    #[serde(default)]
    picture: Option<String>,
    #[serde(default)]
    given_name: Option<String>,
    #[serde(default)]
    family_name: Option<String>,
}

fn base_username_from_email(email: &str) -> String {
    let local = email.split('@').next().unwrap_or("user");
    local
        .to_lowercase()
        .chars()
        .filter(|c| c.is_ascii_alphanumeric() || *c == '.')
        .collect()
}

fn generate_random_password() -> String {
    use rand::RngCore;
    let mut buf = [0u8; 32];
    rand::rngs::OsRng.fill_bytes(&mut buf);
    URL_SAFE_NO_PAD.encode(buf)
}

/// Log in with Google ID token. Creates an account if it does not exist and activates it.
pub async fn google_login(
    ctx: &AppContext,
    repo: &dyn UsersRepository,
    input: GoogleLoginRequest,
) -> AppResult<LoginResponse> {
    if ctx.auth.google_client_id.is_empty() {
        return Err(AppError::ServiceUnavailable(
            "Google OAuth is not configured on server".into(),
        ));
    }

    // Verify ID token via Google's tokeninfo endpoint
    let url = format!(
        "https://oauth2.googleapis.com/tokeninfo?id_token={}",
        urlencoding::encode(&input.id_token)
    );
    let info: GoogleTokenInfo = reqwest::Client::new()
        .get(url)
        .send()
        .await
        .map_err(|e| AppError::ServiceUnavailable(e.to_string()))?
        .error_for_status()
        .map_err(|e| AppError::Unauthorized(format!("Invalid Google token: {}", e)))?
        .json()
        .await
        .map_err(|e| AppError::ServiceUnavailable(e.to_string()))?;

    if info.aud != ctx.auth.google_client_id {
        return Err(AppError::Unauthorized(
            "Google token audience mismatch".into(),
        ));
    }
    // email_verified might be "true"
    if let Some(v) = info.email_verified.as_deref() {
        if v != "true" {
            return Err(AppError::Unauthorized("Google email not verified".into()));
        }
    }

    let email = info.email.to_lowercase();

    // Find or create user
    let mut user = if let Some(u) = repo.find_by_email(&email).await? {
        u
    } else {
        // Create minimal account with random password to satisfy NOT NULL constraint
        let random_password = generate_random_password();
        let password_hash = ctx
            .password_hasher
            .hash(&random_password)
            .map_err(|e| AppError::Internal(e.to_string()))?;

        let mut desired_username = base_username_from_email(&email);
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
                // Retry once with a short suffix
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

        // Fetch the created user record
        repo.find_by_id(id)
            .await?
            .ok_or_else(|| AppError::Internal("User not found after create".into()))?
    };

    // Ensure active and enrich profile best-effort
    if !user.is_active {
        let _ = repo
            .update_partial(
                user.id,
                UpdateUserRecord {
                    is_active: Some(true),
                    first_name: info.given_name,
                    last_name: info.family_name,
                    avatar_url: info.picture,
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
