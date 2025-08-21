use std::sync::Arc;

use axum::{Extension, Json, http::StatusCode};
use serde::Serialize;
use tokio::time::{Duration, timeout};

use crate::configs::app_context::AppContext;
use crate::pkg::redis::RedisOps;
use crate::pkg::response::Response;

/// Health check endpoint
///
/// Probes core dependencies (Postgres, Redis). Returns HTTP 200 when all
/// checks pass; otherwise returns HTTP 503 with component-level details.
pub async fn handler(
    Extension(ctx): Extension<Arc<AppContext>>,
) -> (StatusCode, Json<Response<HealthReport>>) {
    let postgres_ok = check_postgres(ctx.as_ref()).await;
    let redis_ok = check_redis(ctx.as_ref()).await;

    let all_ok = postgres_ok.status == "up" && redis_ok.status == "up";

    let status_code = if all_ok {
        StatusCode::OK
    } else {
        StatusCode::SERVICE_UNAVAILABLE
    };

    let report = HealthReport {
        service: "execute_academy".to_string(),
        overall_status: if all_ok { "healthy" } else { "degraded" }.to_string(),
        components: ComponentsStatus {
            postgres: postgres_ok,
            redis: redis_ok,
        },
    };

    let message = if all_ok {
        "OK"
    } else {
        "One or more dependencies are unavailable"
    };

    let body = Response::with_data(message, report, status_code.as_u16());
    (status_code, Json(body))
}

#[derive(Serialize)]
pub struct HealthReport {
    service: String,
    overall_status: String,
    components: ComponentsStatus,
}

#[derive(Serialize)]
pub struct ComponentsStatus {
    postgres: ComponentStatus,
    redis: ComponentStatus,
}

#[derive(Serialize)]
pub struct ComponentStatus {
    status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    detail: Option<String>,
}

async fn check_postgres(ctx: &AppContext) -> ComponentStatus {
    let fut = async {
        // Simple round-trip query
        let _ = sqlx::query("SELECT 1").execute(&ctx.db_pool).await?;
        Ok::<(), sqlx::Error>(())
    };

    match timeout(Duration::from_secs(2), fut).await {
        Ok(Ok(())) => ComponentStatus {
            status: "up".to_string(),
            detail: None,
        },
        Ok(Err(e)) => ComponentStatus {
            status: "down".to_string(),
            detail: Some(format!("postgres error: {}", e)),
        },
        Err(_) => ComponentStatus {
            status: "down".to_string(),
            detail: Some("postgres timeout".to_string()),
        },
    }
}

async fn check_redis(ctx: &AppContext) -> ComponentStatus {
    let fut = async {
        ctx.redis.ping().await?;
        Ok::<(), redis::RedisError>(())
    };

    match timeout(Duration::from_secs(2), fut).await {
        Ok(Ok(())) => ComponentStatus {
            status: "up".to_string(),
            detail: None,
        },
        Ok(Err(e)) => ComponentStatus {
            status: "down".to_string(),
            detail: Some(format!("redis error: {}", e)),
        },
        Err(_) => ComponentStatus {
            status: "down".to_string(),
            detail: Some("redis timeout".to_string()),
        },
    }
}
