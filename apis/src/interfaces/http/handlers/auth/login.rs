use std::sync::Arc;

use crate::pkg::validators::ValidatedJson;
use axum::{Json, extract::Extension, http::StatusCode};

use crate::applications::auth as auth_service;
use crate::configs::app_context::AppContext;

use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::types::users::{request_type::LoginRequest, response_type::LoginResponse};
use axum::http::{HeaderMap, header};

/// Log in and receive access/refresh tokens
#[utoipa::path(
    post,
    path = "/api/auth/login",
    request_body = LoginRequest,
    responses((status = 200, description = "Logged in", body = LoginResponse),
        (status = 400, description = "Bad Request", body = ApiErrorResponse),
        (status = 403, description = "Forbidden", body = ApiErrorResponse),
        (status = 500, description = "Internal Server Error", body = ApiErrorResponse)
    ),
    tag = "Auth"
)]
pub async fn login(
    Extension(ctx): Extension<Arc<AppContext>>,
    ValidatedJson(input_data): ValidatedJson<LoginRequest>,
) -> AppResult<(StatusCode, HeaderMap, Json<Response<LoginResponse>>)> {
    let output = auth_service::login(&ctx, ctx.repos.users.as_ref(), input_data).await?;

    let is_prod = ctx.system.app_env.eq_ignore_ascii_case("production");

    let mut headers = HeaderMap::new();

    // access_token cookie
    let access_cookie = format!(
        "access_token={}; Path=/; HttpOnly; SameSite=Lax; {}Max-Age={}",
        output.access_token,
        if is_prod { "Secure; " } else { "" },
        ctx.auth.access_ttl_seconds
    );
    headers.append(header::SET_COOKIE, access_cookie.parse().unwrap());

    // refresh_token cookie
    let refresh_cookie = format!(
        "refresh_token={}; Path=/; HttpOnly; SameSite=Lax; {}Max-Age={}",
        output.refresh_token,
        if is_prod { "Secure; " } else { "" },
        ctx.auth.refresh_ttl_seconds
    );
    headers.append(header::SET_COOKIE, refresh_cookie.parse().unwrap());

    let body = Response::with_data("Logged in", output, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, headers, Json(body)))
}
