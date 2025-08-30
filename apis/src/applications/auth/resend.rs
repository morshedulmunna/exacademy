use crate::configs::app_context::AppContext;
use crate::pkg::error::{AppError, AppResult};
use crate::repositories::users::UsersRepository;
use crate::types::user_types::ResendOtpRequest;
use std::time::Duration;

use super::utils::{generate_otp_code, send_otp_email, store_otp};

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


