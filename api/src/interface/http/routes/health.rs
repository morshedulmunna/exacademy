use actix_web::{HttpResponse, Result};

/// Health check handler
#[utoipa::path(
    get,
    path = "/health",
    responses((status = 200, description = "Health status", body = serde_json::Value)),
    tag = "health"
)]
pub async fn handler() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy 100%",
        "service": "execute_academy"
    })))
}

#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{App, test, web};

    #[actix_web::test]
    async fn test_health_check() {
        let resp = test::call_service(
            &test::init_service(App::new().route("/health", web::get().to(handler))).await,
            test::TestRequest::get().uri("/health").to_request(),
        )
        .await;

        assert!(resp.status().is_success());
    }
}
