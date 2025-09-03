use crate::pkg::validators::ValidatedJson;
use axum::{Json, extract::Extension, http::StatusCode};

use crate::applications::auth as auth_service;
use crate::configs::app_context::AppContext;

use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::types::users::{request_type::ResetPasswordRequest, response_type::OkResponse};

/// Reset password with code
#[utoipa::path(
    post,
    path = "/api/auth/reset-password",
    request_body = ResetPasswordRequest,
    responses((status = 200, description = "Ok", body = OkResponse)),
    tag = "Auth"
)]
pub async fn reset_password(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    ValidatedJson(input_data): ValidatedJson<ResetPasswordRequest>,
) -> AppResult<(StatusCode, Json<Response<OkResponse>>)> {
    auth_service::reset_password(&ctx, ctx.repos.users.as_ref(), input_data).await?;
    let body = Response::with_data("Ok", OkResponse { ok: true }, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}


