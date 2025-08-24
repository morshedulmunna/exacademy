use crate::pkg::validators::ValidatedJson;
use axum::{Json, extract::Extension, http::StatusCode};

use crate::applications::auth as auth_service;
use crate::configs::app_context::AppContext;

use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::types::user_types::{
    ForgotPasswordRequest, GithubLoginRequest, GoogleLoginRequest, LoginRequest, LoginResponse,
    OkResponse, RefreshRequest, RegisterRequest, RegisterResponse, ResendOtpRequest,
    ResetPasswordRequest, TokenResponse, VerifyOtpRequest,
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
    ValidatedJson(input_data): ValidatedJson<RegisterRequest>,
) -> AppResult<(StatusCode, Json<Response<RegisterResponse>>)> {
    let output = auth_service::register(&ctx, ctx.repos.users.as_ref(), input_data).await?;
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
    ValidatedJson(input_data): ValidatedJson<LoginRequest>,
) -> AppResult<(StatusCode, Json<Response<LoginResponse>>)> {
    let output = auth_service::login(&ctx, ctx.repos.users.as_ref(), input_data).await?;
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
    ValidatedJson(input_data): ValidatedJson<RefreshRequest>,
) -> AppResult<(StatusCode, Json<Response<TokenResponse>>)> {
    let output = auth_service::refresh(&ctx, input_data).await?;
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

/// Start forgot password flow
#[utoipa::path(
    post,
    path = "/api/auth/forgot-password",
    request_body = ForgotPasswordRequest,
    responses((status = 200, description = "Sent", body = OkResponse)),
    tag = "Auth"
)]
pub async fn forgot_password(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    ValidatedJson(input_data): ValidatedJson<ForgotPasswordRequest>,
) -> AppResult<(StatusCode, Json<Response<OkResponse>>)> {
    auth_service::forgot_password(&ctx, ctx.repos.users.as_ref(), input_data).await?;
    let body = Response::with_data("Sent", OkResponse { ok: true }, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}

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

/// Google OAuth login
#[utoipa::path(
    post,
    path = "/api/auth/google",
    request_body = GoogleLoginRequest,
    responses((status = 200, description = "Logged in", body = LoginResponse)),
    tag = "Auth"
)]
pub async fn google_login(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    ValidatedJson(input_data): ValidatedJson<GoogleLoginRequest>,
) -> AppResult<(StatusCode, Json<Response<LoginResponse>>)> {
    let output = auth_service::google_login(&ctx, ctx.repos.users.as_ref(), input_data).await?;
    let body = Response::with_data("Logged in", output, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}

/// GitHub OAuth login
#[utoipa::path(
    post,
    path = "/api/auth/github",
    request_body = GithubLoginRequest,
    responses((status = 200, description = "Logged in", body = LoginResponse)),
    tag = "Auth"
)]
pub async fn github_login(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    ValidatedJson(input_data): ValidatedJson<GithubLoginRequest>,
) -> AppResult<(StatusCode, Json<Response<LoginResponse>>)> {
    let output = auth_service::github_login(&ctx, ctx.repos.users.as_ref(), input_data).await?;
    let body = Response::with_data("Logged in", output, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}
