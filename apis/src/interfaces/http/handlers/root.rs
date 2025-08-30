use crate::pkg::response::Response;
use axum::{Json, http::StatusCode};

/// Root route handler returning a standardized success payload
pub async fn handler() -> (StatusCode, Json<Response<serde_json::Value>>) {
    let body = Response::<serde_json::Value>::with_message(
        "execute_academy API Server",
        StatusCode::OK.as_u16(),
    );
    (StatusCode::OK, Json(body))
}
