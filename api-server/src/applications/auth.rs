use crate::configs::app_context::AppContext;
use crate::pkg::error::{AppError, AppResult};
use crate::pkg::security::{Claims, build_access_claims};

use crate::repositories::users::{CreateUserRecord, UsersRepository};
use crate::types::user_types::{
    LoginRequest, LoginResponse, RefreshRequest, RegisterRequest, RegisterResponse, TokenResponse,
    UserResponse,
};

/// Register a new user
pub async fn register(
    ctx: &AppContext,
    repo: &dyn UsersRepository,
    input: RegisterRequest,
) -> AppResult<RegisterResponse> {
    let existing = repo.find_by_email(&input.email).await?;
    if existing.is_some() {
        return Err(AppError::Conflict("Email already exists".into()));
    }

    let password_hash = ctx
        .password_hasher
        .hash(&input.password)
        .map_err(|e| AppError::Internal(e.to_string()))?;

    let id = repo
        .create(CreateUserRecord {
            username: input.username,
            email: input.email,
            password_hash,
            role: "user".into(),
        })
        .await?;

    // Note: first_name/last_name are accepted at HTTP level but not persisted on create path.
    // They can be updated later via the user update endpoint.
    Ok(RegisterResponse { id })
}

/// Authenticate a user and return tokens
pub async fn login(
    ctx: &AppContext,
    repo: &dyn UsersRepository,
    input: LoginRequest,
) -> AppResult<LoginResponse> {
    let user = match repo.find_by_email(&input.email).await? {
        Some(u) => u,
        None => return Err(AppError::Unauthorized("Invalid credentials".into())),
    };
    let hashed: &str = user
        .password_hash
        .as_deref()
        .ok_or_else(|| AppError::Internal("User has no password hash".into()))?;

    let ok = ctx
        .password_hasher
        .verify(&input.password, hashed)
        .map_err(|e| AppError::Internal(e.to_string()))?;
    if !ok {
        return Err(AppError::Unauthorized("Invalid credentials".into()));
    }
    // Debug: print user struct for troubleshooting login issues
    dbg!(&user);

    // Prevent login for inactive accounts
    if !user.is_active {
        return Err(AppError::Forbidden("Account is inactive".into()));
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
        role: user.role.clone(),
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

/// Exchange a refresh token for an access token
pub async fn refresh(ctx: &AppContext, input: RefreshRequest) -> AppResult<TokenResponse> {
    let claims: Claims = ctx
        .jwt_service
        .verify(&input.refresh_token)
        .map_err(|_| AppError::Unauthorized("Invalid refresh token".into()))?;

    let access_claims = build_access_claims(&claims.sub, &claims.role, ctx.auth.access_ttl_seconds);
    let new_access = ctx
        .jwt_service
        .sign(&access_claims)
        .map_err(|e| AppError::Internal(e.to_string()))?;

    Ok(TokenResponse {
        access_token: new_access,
        refresh_token: input.refresh_token,
        token_type: "Bearer".into(),
        expires_in: ctx.auth.access_ttl_seconds,
    })
}
