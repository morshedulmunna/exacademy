use crate::pkg::validators::ValidatedJson;
use axum::{Json, extract::Extension, http::StatusCode};

use crate::applications::auth as auth_service;
use crate::configs::app_context::AppContext;

use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::types::user_types::{ResendOtpRequest, OkResponse};

/// Resend OTP email
#[utoipa::path(
    post,
    path = "/api/auth/resend-otp",
    request_body = ResendOtpRequest,
    responses((status = 200, description = "Sent", body = OkResponse)),
    tag = "Auth"
)]
pub async fn resend_otp(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    ValidatedJson(input_data): ValidatedJson<ResendOtpRequest>,
) -> AppResult<(StatusCode, Json<Response<OkResponse>>)> {
    auth_service::resend_otp(&ctx, ctx.repos.users.as_ref(), input_data).await?;
    let body = Response::with_data("Sent", OkResponse { ok: true }, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}


