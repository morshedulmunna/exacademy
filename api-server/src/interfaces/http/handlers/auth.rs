use axum::{Json, extract::Extension, http::StatusCode};

use crate::applications::auth as auth_service;
use crate::configs::app_context::AppContext;

use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::types::user_types::{
    LoginRequest, LoginResponse, OkResponse, RefreshRequest, RegisterRequest, RegisterResponse,
    TokenResponse,
};

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
    Json(req): Json<RegisterRequest>,
) -> AppResult<(StatusCode, Json<Response<RegisterResponse>>)> {
    let output = auth_service::register(&ctx, ctx.repos.users.as_ref(), req).await?;
    let body = Response::with_data("Registered", output, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}

/// Log in and receive access/refresh tokens
#[utoipa::path(
    post,
    path = "/api/auth/login",
    request_body = LoginRequest,
    responses((status = 200, description = "Logged in", body = LoginResponse)),
    tag = "Auth"
)]
pub async fn login(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Json(req): Json<LoginRequest>,
) -> AppResult<(StatusCode, Json<Response<LoginResponse>>)> {
    let output = auth_service::login(&ctx, ctx.repos.users.as_ref(), req).await?;
    let body = Response::with_data("Logged in", output, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}

/// Exchange refresh token for new access token
#[utoipa::path(
    post,
    path = "/api/auth/refresh",
    request_body = RefreshRequest,
    responses((status = 200, description = "New access token", body = TokenResponse)),
    tag = "Auth"
)]
pub async fn refresh(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Json(req): Json<RefreshRequest>,
) -> AppResult<(StatusCode, Json<Response<TokenResponse>>)> {
    let output = auth_service::refresh(&ctx, req).await?;
    let body = Response::with_data("New access token", output, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}

/// Logout (stateless)
#[utoipa::path(
    post,
    path = "/api/auth/logout",
    responses((status = 200, description = "Ok", body = OkResponse)),
    tag = "Auth"
)]
pub async fn logout() -> AppResult<(StatusCode, Json<Response<OkResponse>>)> {
    let body = Response::with_data("Ok", OkResponse { ok: true }, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}
