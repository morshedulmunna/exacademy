use crate::pkg::response::ApiResponse;
use axum::{Json, http::StatusCode};

/// Root route handler returning a standardized success payload
pub async fn handler() -> (StatusCode, Json<ApiResponse<serde_json::Value>>) {
    let body = ApiResponse::<serde_json::Value>::with_message(
        "execute_academy API Server",
        StatusCode::OK.as_u16(),
    );
    (StatusCode::OK, Json(body))
}
