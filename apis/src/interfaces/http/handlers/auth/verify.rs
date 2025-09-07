use crate::pkg::validators::ValidatedJson;
use axum::{Json, extract::Extension, http::StatusCode};

use crate::applications::auth as auth_service;
use crate::configs::app_context::AppContext;

use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::types::users::{request_type::VerifyOtpRequest, response_type::OkResponse};

/// Verify email with OTP code
#[utoipa::path(
    post,
    path = "/api/auth/verify",
    request_body = VerifyOtpRequest,
    responses((status = 200, description = "Verified", body = OkResponse)),
    tag = "Auth"
)]
pub async fn verify(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    ValidatedJson(input_data): ValidatedJson<VerifyOtpRequest>,
) -> AppResult<(StatusCode, Json<Response<OkResponse>>)> {
    auth_service::verify_otp(&ctx, ctx.repos.users.as_ref(), input_data).await?;
    let body = Response::with_data("Verified", OkResponse { ok: true }, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}


