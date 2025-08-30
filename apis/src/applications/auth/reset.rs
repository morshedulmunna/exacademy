use std::time::Duration;

use crate::applications::auth::utils::send_otp_email;
use crate::configs::app_context::AppContext;
use crate::pkg::error::{AppError, AppResult};
use crate::pkg::redis::RedisOps;
use crate::repositories::users::UsersRepository;
use crate::types::user_types::{ForgotPasswordRequest, ResetPasswordRequest};

use super::utils::{generate_otp_code, store_otp};

fn reset_key(email: &str) -> String {
    format!("otp:reset:{}", email.to_lowercase())
}

/// Initiate forgot password by generating an OTP and emailing it.
pub async fn forgot_password(
    ctx: &AppContext,
    users_repo: &dyn UsersRepository,
    input: ForgotPasswordRequest,
) -> AppResult<()> {
    let email = input.email.to_lowercase();

    // Ensure user exists but do not leak existence via response body
    let user = users_repo
        .find_by_email(&email)
        .await?
        .ok_or_else(|| AppError::NotFound("User not found".into()))?;
    if user.is_blocked {
        return Err(AppError::Forbidden("User is blocked".into()));
    }

    let code = generate_otp_code();
    // store a separate reset key with TTL 10 minutes
    store_otp(ctx, &email, &code, Duration::from_secs(600)).await?;
    // also store under reset scope for clarity
    ctx.redis
        .set(&reset_key(&email), &code, Some(Duration::from_secs(600)))
        .await
        .map_err(|e| AppError::Internal(e.to_string()))?;

    send_otp_email(ctx, &email, &code).await?;
    Ok(())
}

/// Verify reset code and update password
pub async fn reset_password(
    ctx: &AppContext,
    users_repo: &dyn UsersRepository,
    input: ResetPasswordRequest,
) -> AppResult<()> {
    let email = input.email.to_lowercase();
    let expected: Option<String> = ctx
        .redis
        .get(&reset_key(&email))
        .await
        .map_err(|e| AppError::Internal(e.to_string()))?;

    let Some(expected_code) = expected else {
        return Err(AppError::Unauthorized("Invalid or expired code".into()));
    };
    if expected_code != input.code {
        return Err(AppError::Unauthorized("Invalid or expired code".into()));
    }

    let new_hash = ctx
        .password_hasher
        .hash(&input.new_password)
        .map_err(|e| AppError::Internal(e.to_string()))?;

    users_repo
        .update_password_hash_by_email(&email, &new_hash)
        .await?;

    Ok(())
}
