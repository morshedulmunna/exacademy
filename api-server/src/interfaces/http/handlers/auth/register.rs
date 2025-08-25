use crate::pkg::validators::ValidatedJson;
use axum::{Json, extract::Extension, http::StatusCode};

use crate::applications::auth as auth_service;
use crate::configs::app_context::AppContext;

use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::types::user_types::{RegisterRequest, RegisterResponse};

/// Register a new user account
#[utoipa::path(
    post,
    path = "/api/auth/register",
    request_body = RegisterRequest,
    responses((status = 200, description = "Registered", body = RegisterResponse)),
    tag = "Auth"
)]
pub async fn register(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    ValidatedJson(input_data): ValidatedJson<RegisterRequest>,
) -> AppResult<(StatusCode, Json<Response<RegisterResponse>>)> {
    let output = auth_service::register(&ctx, ctx.repos.users.as_ref(), input_data).await?;
    let body = Response::with_data("Registered", output, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}
