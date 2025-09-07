use axum::http::{HeaderMap, header};
use axum::{Json, http::StatusCode};

use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::types::users::response_type::OkResponse;

/// Logout (stateless)
#[utoipa::path(
    post,
    path = "/api/auth/logout",
    responses((status = 200, description = "Ok", body = OkResponse)),
    tag = "Auth"
)]
pub async fn logout() -> AppResult<(StatusCode, HeaderMap, Json<Response<OkResponse>>)> {
    let mut headers = HeaderMap::new();

    // Expire cookies immediately
    for name in ["access_token", "refresh_token", "token_type"] {
        let cookie = format!(
            "{}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure",
            name
        );
        headers.append(header::SET_COOKIE, cookie.parse().unwrap());
    }

    let body = Response::with_data("Ok", OkResponse { ok: true }, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, headers, Json(body)))
}
