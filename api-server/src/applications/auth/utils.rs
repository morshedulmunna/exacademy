use crate::configs::app_context::AppContext;
use crate::pkg::error::{AppError, AppResult};
use crate::pkg::redis::RedisOps;
use rand::RngCore;
use std::time::Duration;

/// Generate a 6-digit numeric code using a cryptographically secure RNG.
pub fn generate_otp_code() -> String {
    let mut bytes = [0u8; 4];
    rand::rngs::OsRng.fill_bytes(&mut bytes);
    let val = u32::from_be_bytes(bytes) % 1_000_000;
    format!("{:06}", val)
}

/// Build the Redis key for storing OTP by email.
pub fn otp_key(email: &str) -> String {
    format!("otp:verify:{}", email.to_lowercase())
}

/// Store the OTP into Redis with a TTL.
pub async fn store_otp(ctx: &AppContext, email: &str, code: &str, ttl: Duration) -> AppResult<()> {
    ctx.redis
        .set(&otp_key(email), &code.to_string(), Some(ttl))
        .await
        .map_err(|e| AppError::Internal(e.to_string()))
}

/// Send OTP email using the configured email sender.
pub async fn send_otp_email(ctx: &AppContext, email: &str, code: &str) -> AppResult<()> {
    let subject = Some("Verify your email".to_string());
    let html = format!(
        "<h2>Verify your email</h2><p>Your code is: <strong>{}</strong></p><p>This code expires in 10 minutes.</p>",
        code
    );
    let text = format!(
        "Verify your email. Your code is: {}. This code expires in 10 minutes.",
        code
    );
    let msg = crate::pkg::email::EmailMessage {
        to: email.to_string(),
        subject,
        content: crate::pkg::email::EmailContent::Raw {
            html_body: html,
            text_body: Some(text),
        },
        cc: None,
        bcc: None,
    };
    ctx.email_sender
        .send(&msg)
        .await
        .map_err(|e| AppError::ServiceUnavailable(format!("Failed to send email: {}", e)))?;
    Ok(())
}
