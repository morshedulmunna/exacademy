use axum::{Json, Router, extract::Extension, routing::post};

use crate::applications::auth as auth_service;
use crate::configs::app_context::AppContext;

use crate::pkg::error::AppResult;
use crate::types::user_types::{
    LoginRequest, LoginResponse, OkResponse, RefreshRequest, RegisterRequest, RegisterResponse,
    TokenResponse, UserResponse,
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
    let output = auth_service::register(
        &ctx,
        ctx.repos.users.as_ref(),
        auth_service::RegisterInput {
            username: req.username,
            email: req.email,
            password: req.password,
        },
    )
    .await?;
    Ok(Json(RegisterResponse { id: output.id }))
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
    let output = auth_service::login(
        &ctx,
        ctx.repos.users.as_ref(),
        auth_service::LoginInput {
            email: req.email,
            password: req.password,
        },
    )
    .await?;

    let user = UserResponse {
        id: output.user.id,
        username: output.user.username,
        email: output.user.email,
        role: output.user.role,
        first_name: output.user.first_name,
        last_name: output.user.last_name,
        full_name: output.user.full_name,
        avatar_url: output.user.avatar_url,
        is_active: output.user.is_active,
        is_blocked: output.user.is_blocked,
    };

    Ok(Json(LoginResponse {
        user,
        access_token: output.access_token,
        refresh_token: output.refresh_token,
        token_type: output.token_type,
        expires_in: output.expires_in,
    }))
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
    let output = auth_service::refresh(
        &ctx,
        auth_service::RefreshInput {
            refresh_token: req.refresh_token,
        },
    )
    .await?;
    Ok(Json(TokenResponse {
        access_token: output.access_token,
        refresh_token: output.refresh_token,
        token_type: output.token_type,
        expires_in: output.expires_in,
    }))
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
