use crate::pkg::validators::ValidatedJson;
use axum::{Json, extract::Extension, http::StatusCode};

use crate::applications::auth as auth_service;
use crate::configs::app_context::AppContext;

use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::types::user_types::{LoginRequest, LoginResponse};
use axum::http::{HeaderMap, header};

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
) -> AppResult<(StatusCode, HeaderMap, Json<Response<LoginResponse>>)> {
    let output = auth_service::login(&ctx, ctx.repos.users.as_ref(), input_data).await?;

    let is_prod = ctx.system.app_env.eq_ignore_ascii_case("production");
    let mut headers = HeaderMap::new();

    // access_token cookie
    let access_cookie = format!(
        "access_token={}; Path=/; HttpOnly; SameSite=Lax; {}Domain=localhost; Max-Age={}",
        output.access_token,
        if is_prod { "Secure; " } else { "" },
        ctx.auth.access_ttl_seconds
    );
    headers.append(header::SET_COOKIE, access_cookie.parse().unwrap());

    // refresh_token cookie
    let refresh_cookie = format!(
        "refresh_token={}; Path=/; HttpOnly; SameSite=Lax; {}Domain=localhost; Max-Age={}",
        output.refresh_token,
        if is_prod { "Secure; " } else { "" },
        ctx.auth.refresh_ttl_seconds
    );

    headers.append(header::SET_COOKIE, refresh_cookie.parse().unwrap());

    let body = Response::with_data("Logged in", output, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, headers, Json(body)))
}
