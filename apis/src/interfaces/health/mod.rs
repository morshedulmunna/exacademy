//! Shared health check functionality
//!
//! This module provides common health check types and functions that can be used
//! by both HTTP and GraphQL interfaces.

use serde::Serialize;
use tokio::time::{Duration, timeout};

use crate::configs::app_context::AppContext;
use crate::pkg::redis::RedisOps;

/// Health check response
#[derive(Serialize, Clone, async_graphql::SimpleObject)]
pub struct HealthReport {
    /// Service name
    pub service: String,
    /// Overall health status
    pub overall_status: String,
    /// Component status details
    pub components: ComponentsStatus,
}

/// Component status details
#[derive(Serialize, Clone, async_graphql::SimpleObject)]
pub struct ComponentsStatus {
    /// PostgreSQL status
    pub postgres: ComponentStatus,
    /// Redis status
    pub redis: ComponentStatus,
}

/// Individual component status
#[derive(Serialize, Clone, async_graphql::SimpleObject)]
pub struct ComponentStatus {
    /// Component status (up/down)
    pub status: String,
    /// Optional error details
    #[serde(skip_serializing_if = "Option::is_none")]
    pub detail: Option<String>,
}

/// Check PostgreSQL connection health
pub async fn check_postgres(ctx: &AppContext) -> ComponentStatus {
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

/// Check Redis connection health
pub async fn check_redis(ctx: &AppContext) -> ComponentStatus {
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

/// Generate a complete health report
pub async fn generate_health_report(ctx: &AppContext) -> HealthReport {
    let postgres_ok = check_postgres(ctx).await;
    let redis_ok = check_redis(ctx).await;

    let all_ok = postgres_ok.status == "up" && redis_ok.status == "up";

    HealthReport {
        service: "execute_academy".to_string(),
        overall_status: if all_ok { "healthy" } else { "degraded" }.to_string(),
        components: ComponentsStatus {
            postgres: postgres_ok,
            redis: redis_ok,
        },
    }
}
