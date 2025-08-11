use crate::pkg::error::{AppError, AppResult};
use crate::pkg::response::ApiResponse;
use actix_web::{HttpResponse, Result, http::StatusCode};

/// Root handler
#[utoipa::path(
    get,
    path = "/",
    responses((status = 200, description = "Root", body = serde_json::Value)),
    tag = "root"
)]
pub async fn handler() -> Result<HttpResponse> {
    let body = ApiResponse::<serde_json::Value>::with_message(
        "execute_academy API Server",
        StatusCode::OK.as_u16(),
    );
    Ok(HttpResponse::Ok().json(body))
}

/// Example error handler for testing error responses
#[utoipa::path(
    get,
    path = "/error",
    responses((status = 400, description = "Simulated error", body = crate::pkg::response::ApiErrorResponse)),
    tag = "root"
)]
pub async fn error_handler() -> AppResult<HttpResponse> {
    Err(AppError::BadRequest("simulated error".into()))
}

#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{App, http::StatusCode as HttpStatus, test, web};

    #[actix_web::test]
    async fn test_root() {
        let resp = test::call_service(
            &test::init_service(App::new().route("/", web::get().to(handler))).await,
            test::TestRequest::get().uri("/").to_request(),
        )
        .await;

        assert!(resp.status().is_success());
    }

    #[actix_web::test]
    async fn test_root_error() {
        let resp = test::call_service(
            &test::init_service(App::new().route("/error", web::get().to(error_handler))).await,
            test::TestRequest::get().uri("/error").to_request(),
        )
        .await;

        assert_eq!(resp.status(), HttpStatus::BAD_REQUEST);
    }
}
