use super::utils::{generate_otp_code, send_otp_email, store_otp};
use crate::configs::app_context::AppContext;
use crate::pkg::error::{AppError, AppResult};
use crate::repositories::users::CreateUserRecord;
use crate::types::users::request_type::RegisterRequest;
use crate::types::users::response_type::RegisterResponse;
use std::time::Duration;

/// Register a new user and send an email verification OTP.
pub async fn register(ctx: &AppContext, input: RegisterRequest) -> AppResult<RegisterResponse> {
    let existing = ctx.repos.users.find_by_email(&input.email).await?;
    if existing.is_some() {
        return Err(AppError::Conflict("Email already exists".into()));
    }

    let password_hash = ctx
        .password_hasher
        .hash(&input.password)
        .map_err(|e| AppError::Internal(e.to_string()))?;

    let id = ctx
        .repos
        .users
        .create(CreateUserRecord {
            username: input.username,
            email: input.email,
            password_hash,
            role: "user".into(),
        })
        .await?;

    // After registration, generate an email verification OTP and send it.
    let user = ctx
        .repos
        .users
        .find_by_id(id)
        .await?
        .ok_or_else(|| AppError::Internal("User not found after create".into()))?;

    let code = generate_otp_code();

    store_otp(ctx, &user.email, &code, Duration::from_secs(10 * 60)).await?;

    if let Err(e) = send_otp_email(ctx, &user.email, &code).await {
        // Email failed to send; clean up the just-created user to avoid dangling accounts.
        let _ = ctx.repos.users.delete_by_id(id).await;
        return Err(e);
    }

    Ok(RegisterResponse { id })
}
