use crate::pkg::validators::ValidatedJson;
use axum::{Json, extract::Extension, http::StatusCode};

use crate::applications::auth as auth_service;
use crate::configs::app_context::AppContext;

use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::types::users::{request_type::RefreshRequest, response_type::TokenResponse};
use axum::http::{HeaderMap, header};

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
) -> AppResult<(StatusCode, HeaderMap, Json<Response<TokenResponse>>)> {
    let output = auth_service::refresh(&ctx, input_data).await?;

    let is_prod = ctx.system.app_env.eq_ignore_ascii_case("production");
    let mut headers = HeaderMap::new();

    // Update access_token and refresh_token cookies
    let access_cookie = format!(
        "access_token={}; Path=/; HttpOnly; SameSite=Lax; {}Max-Age={}",
        output.access_token,
        if is_prod { "Secure; " } else { "" },
        ctx.auth.access_ttl_seconds
    );
    headers.append(header::SET_COOKIE, access_cookie.parse().unwrap());

    let refresh_cookie = format!(
        "refresh_token={}; Path=/; HttpOnly; SameSite=Lax; {}Max-Age={}",
        output.refresh_token,
        if is_prod { "Secure; " } else { "" },
        ctx.auth.refresh_ttl_seconds
    );
    headers.append(header::SET_COOKIE, refresh_cookie.parse().unwrap());

    let body = Response::with_data("New access token", output, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, headers, Json(body)))
}
