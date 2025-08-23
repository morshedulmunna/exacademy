use crate::configs::app_context::AppContext;
use crate::pkg::error::{AppError, AppResult};
use crate::repositories::users::{CreateUserRecord, UsersRepository};
use crate::types::user_types::RegisterRequest;
use std::time::Duration;

use super::utils::{generate_otp_code, send_otp_email, store_otp};

/// Register a new user and send an email verification OTP.
pub async fn register(
    ctx: &AppContext,
    repo: &dyn UsersRepository,
    input: RegisterRequest,
) -> AppResult<crate::types::user_types::RegisterResponse> {
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
    if let Err(e) = send_otp_email(ctx, &user.email, &code).await {
        // Email failed to send; clean up the just-created user to avoid dangling accounts.
        let _ = repo.delete_by_id(id).await;
        return Err(e);
    }

    Ok(crate::types::user_types::RegisterResponse { id })
}
