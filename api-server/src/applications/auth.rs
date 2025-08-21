use crate::configs::app_context::AppContext;
use crate::pkg::error::{AppError, AppResult};
use crate::pkg::security::{Claims, build_access_claims, hash_password, sign_jwt, verify_password};
use crate::repositories::users::{CreateUserRecord, UsersRepository};

/// Request DTO for user registration
#[derive(Debug)]
pub struct RegisterInput {
    pub username: String,
    pub email: String,
    pub password: String,
}

/// Response DTO for user registration
#[derive(Debug)]
pub struct RegisterOutput {
    pub id: uuid::Uuid,
}

/// Request DTO for login
#[derive(Debug)]
pub struct LoginInput {
    pub email: String,
    pub password: String,
}

/// Minimal user shape for responses
#[derive(Debug)]
pub struct UserInfo {
    pub id: uuid::Uuid,
    pub username: String,
    pub email: String,
    pub role: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub full_name: Option<String>,
    pub avatar_url: Option<String>,
    pub is_active: bool,
    pub is_blocked: bool,
}

/// Response DTO for login containing tokens
#[derive(Debug)]
pub struct LoginOutput {
    pub user: UserInfo,
    pub access_token: String,
    pub refresh_token: String,
    pub token_type: String,
    pub expires_in: i64,
}

/// Request DTO for refresh token exchange
#[derive(Debug)]
pub struct RefreshInput {
    pub refresh_token: String,
}

/// Response DTO for token issuing
#[derive(Debug)]
pub struct TokenOutput {
    pub access_token: String,
    pub refresh_token: String,
    pub token_type: String,
    pub expires_in: i64,
}

/// Register a new user
pub async fn register(
    _ctx: &AppContext,
    repo: &dyn UsersRepository,
    input: RegisterInput,
) -> AppResult<RegisterOutput> {
    let existing = repo.find_by_email(&input.email).await?;
    if existing.is_some() {
        return Err(AppError::Conflict("Email already exists".into()));
    }

    let password_hash =
        hash_password(&input.password).map_err(|e| AppError::Internal(e.to_string()))?;
    let id = repo
        .create(CreateUserRecord {
            username: input.username,
            email: input.email,
            password_hash,
            role: "user".into(),
        })
        .await?;

    Ok(RegisterOutput { id })
}

/// Authenticate a user and return tokens
pub async fn login(
    ctx: &AppContext,
    repo: &dyn UsersRepository,
    input: LoginInput,
) -> AppResult<LoginOutput> {
    let user = match repo.find_by_email(&input.email).await? {
        Some(u) => u,
        None => return Err(AppError::Unauthorized("Invalid credentials".into())),
    };
    let hashed: String = user
        .password_hash
        .clone()
        .ok_or_else(|| AppError::Internal("User has no password hash".into()))?;

    let ok =
        verify_password(&input.password, &hashed).map_err(|e| AppError::Internal(e.to_string()))?;
    if !ok {
        return Err(AppError::Unauthorized("Invalid credentials".into()));
    }

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
    let access_token = sign_jwt(&access_claims, &ctx.auth.jwt_secret)
        .map_err(|e| AppError::Internal(e.to_string()))?;
    let refresh_token = sign_jwt(&refresh_claims, &ctx.auth.jwt_secret)
        .map_err(|e| AppError::Internal(e.to_string()))?;

    let user = UserInfo {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role.clone(),
        first_name: user.first_name,
        last_name: user.last_name,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        is_active: user.is_active,
        is_blocked: user.is_blocked,
    };

    Ok(LoginOutput {
        user,
        access_token,
        refresh_token,
        token_type: "Bearer".into(),
        expires_in: ctx.auth.access_ttl_seconds,
    })
}

/// Exchange a refresh token for an access token
pub async fn refresh(ctx: &AppContext, input: RefreshInput) -> AppResult<TokenOutput> {
    let claims: Claims =
        crate::pkg::security::verify_jwt(&input.refresh_token, &ctx.auth.jwt_secret)
            .map_err(|_| AppError::Unauthorized("Invalid refresh token".into()))?;

    let access_claims = build_access_claims(&claims.sub, &claims.role, ctx.auth.access_ttl_seconds);
    let new_access = sign_jwt(&access_claims, &ctx.auth.jwt_secret)
        .map_err(|e| AppError::Internal(e.to_string()))?;

    Ok(TokenOutput {
        access_token: new_access,
        refresh_token: input.refresh_token,
        token_type: "Bearer".into(),
        expires_in: ctx.auth.access_ttl_seconds,
    })
}
