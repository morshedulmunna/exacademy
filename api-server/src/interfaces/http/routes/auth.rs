use axum::{Json, Router, extract::Extension, routing::post};

use crate::applications::auth as auth_service;
use crate::configs::app_context::AppContext;

use crate::pkg::error::AppResult;
use crate::types::user_types::{
    LoginRequest, LoginResponse, OkResponse, RefreshRequest, RegisterRequest, RegisterResponse,
    TokenResponse,
};

pub fn router() -> Router {
    Router::new()
        .route("/api/auth/register", post(register))
        .route("/api/auth/login", post(login))
        .route("/api/auth/refresh", post(refresh))
        .route("/api/auth/logout", post(logout))
}

/// Register a new user account
#[utoipa::path(
    post,
    path = "/api/auth/register",
    request_body = RegisterRequest,
    responses((status = 200, description = "Registered", body = RegisterResponse)),
    tag = "Auth"
)]
async fn register(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Json(req): Json<RegisterRequest>,
) -> AppResult<Json<RegisterResponse>> {
    let output = auth_service::register(&ctx, ctx.repos.users.as_ref(), req).await?;
    Ok(Json(output))
}

/// Log in and receive access/refresh tokens
#[utoipa::path(
    post,
    path = "/api/auth/login",
    request_body = LoginRequest,
    responses((status = 200, description = "Logged in", body = LoginResponse)),
    tag = "Auth"
)]
async fn login(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Json(req): Json<LoginRequest>,
) -> AppResult<Json<LoginResponse>> {
    let output = auth_service::login(&ctx, ctx.repos.users.as_ref(), req).await?;
    Ok(Json(output))
}

/// Exchange refresh token for new access token
#[utoipa::path(
    post,
    path = "/api/auth/refresh",
    request_body = RefreshRequest,
    responses((status = 200, description = "New access token", body = TokenResponse)),
    tag = "Auth"
)]
async fn refresh(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Json(req): Json<RefreshRequest>,
) -> AppResult<Json<TokenResponse>> {
    let output = auth_service::refresh(&ctx, req).await?;
    Ok(Json(output))
}

/// Logout (stateless)
#[utoipa::path(
    post,
    path = "/api/auth/logout",
    responses((status = 200, description = "Ok", body = OkResponse)),
    tag = "Auth"
)]
async fn logout() -> AppResult<Json<OkResponse>> {
    Ok(Json(OkResponse { ok: true }))
}
