use crate::configs::app_context::AppContext;
use crate::pkg::error::{AppError, AppResult};
use crate::repositories::users::{UpdateUserRecord, UsersRepository};
use crate::pkg::redis::RedisOps;
use crate::types::users::request_type::VerifyOtpRequest;
use std::time::Duration;

use super::utils::{otp_key, store_otp};

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


