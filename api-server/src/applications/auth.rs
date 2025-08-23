use crate::configs::app_context::AppContext;
use crate::pkg::error::{AppError, AppResult};
use crate::pkg::security::{Claims, build_access_claims};

use crate::pkg::redis::RedisOps;
use crate::repositories::users::{CreateUserRecord, UpdateUserRecord, UsersRepository};
use crate::types::user_types::{
    LoginRequest, LoginResponse, RefreshRequest, RegisterRequest, RegisterResponse,
    ResendOtpRequest, TokenResponse, UserResponse, VerifyOtpRequest,
};
use rand::RngCore;
use std::time::Duration;

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

    // After registration, generate an email verification OTP and send it.
    let user = repo
        .find_by_id(id)
        .await?
        .ok_or_else(|| AppError::Internal("User not found after create".into()))?;
    let code = generate_otp_code();
    store_otp(ctx, &user.email, &code, Duration::from_secs(10 * 60)).await?;
    send_otp_email(ctx, &user.email, &code).await?;

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

/// Verify a user's email by matching the OTP code and activating the account.
pub async fn verify_otp(
    ctx: &AppContext,
    repo: &dyn UsersRepository,
    input: VerifyOtpRequest,
) -> AppResult<()> {
    let user = match repo.find_by_email(&input.email).await? {
        Some(u) => u,
        None => return Err(AppError::NotFound("Account not found".into())),
    };

    // If already active, treat as success (idempotent)
    if user.is_active {
        return Ok(());
    }

    let key = otp_key(&input.email);
    let stored: Option<String> = ctx
        .redis
        .get(&key)
        .await
        .map_err(|e| AppError::Internal(e.to_string()))?;

    let Some(expected) = stored else {
        return Err(AppError::Unauthorized("Invalid or expired code".into()));
    };
    if expected != input.code {
        return Err(AppError::Unauthorized("Invalid or expired code".into()));
    }

    // Activate account
    let updated = repo
        .update_partial(
            user.id,
            UpdateUserRecord {
                is_active: Some(true),
                ..Default::default()
            },
        )
        .await?;

    if updated.is_none() {
        return Err(AppError::Internal("Failed to activate account".into()));
    }

    // Best-effort invalidate the OTP quickly by overwriting with short TTL
    let _ = store_otp(ctx, &input.email, "used", Duration::from_secs(1)).await;

    Ok(())
}

/// Resend a fresh OTP to the user's email if not yet activated.
pub async fn resend_otp(
    ctx: &AppContext,
    repo: &dyn UsersRepository,
    input: ResendOtpRequest,
) -> AppResult<()> {
    let user = match repo.find_by_email(&input.email).await? {
        Some(u) => u,
        None => return Err(AppError::NotFound("Account not found".into())),
    };
    if user.is_active {
        return Err(AppError::Conflict("Account already verified".into()));
    }

    let code = generate_otp_code();
    store_otp(ctx, &user.email, &code, Duration::from_secs(10 * 60)).await?;
    send_otp_email(ctx, &user.email, &code).await?;
    Ok(())
}

/// Generate a 6-digit numeric code using a cryptographically secure RNG.
fn generate_otp_code() -> String {
    let mut bytes = [0u8; 4];
    rand::rngs::OsRng.fill_bytes(&mut bytes);
    let val = u32::from_be_bytes(bytes) % 1_000_000;
    format!("{:06}", val)
}

/// Build the Redis key for storing OTP by email.
fn otp_key(email: &str) -> String {
    format!("otp:verify:{}", email.to_lowercase())
}

/// Store the OTP into Redis with a TTL.
async fn store_otp(ctx: &AppContext, email: &str, code: &str, ttl: Duration) -> AppResult<()> {
    ctx.redis
        .set(&otp_key(email), &code.to_string(), Some(ttl))
        .await
        .map_err(|e| AppError::Internal(e.to_string()))
}

/// Send OTP email.
///
/// Kafka is not used in this application. For now, we log the OTP so
/// developers can verify flows without an external mail provider.
/// Replace this with a real SMTP/ESP integration when available.
async fn send_otp_email(_ctx: &AppContext, email: &str, code: &str) -> AppResult<()> {
    println!("OTP for {}: {} (expires in 10 minutes)", email, code);
    Ok(())
}
