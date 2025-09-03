// use std::sync::Arc;

use crate::pkg::validators::ValidatedJson;
use axum::{Json, extract::Extension, http::StatusCode};

use crate::applications::auth as auth_service;
use crate::configs::app_context::AppContext;
use std::sync::Arc;

use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::types::users::request_type::RegisterRequest;
use crate::types::users::response_type::RegisterResponse;

/// Register a new user account
#[utoipa::path(
    post,
    path = "/api/auth/register",
    request_body = RegisterRequest,
    responses(
        (status = 200, description = "User successfully registered", body = RegisterResponse),
        (status = 400, description = "Validation error or bad request", body = ApiErrorResponse),
        (status = 409, description = "Email or username already exists", body = ApiErrorResponse),
        (status = 500, description = "Internal Server Error", body = ApiErrorResponse)
    ),
    tag = "Auth"
)]
pub async fn register(
    Extension(ctx): Extension<Arc<AppContext>>,
    ValidatedJson(input_data): ValidatedJson<RegisterRequest>,
) -> AppResult<(StatusCode, Json<Response<RegisterResponse>>)> {
    let output = auth_service::register(&ctx, input_data).await?;
    let body = Response::with_data("Registered", output, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}
