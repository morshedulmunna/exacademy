use std::sync::Arc;
use tokio::time::{Duration, timeout};

use async_graphql::{Context, Object, Result as GraphQLResult};
use serde::Serialize;

use crate::configs::app_context::AppContext;
use crate::pkg::redis::RedisOps;

/// Root query type for GraphQL schema
pub struct QueryRoot;

#[Object]
impl QueryRoot {
    /// Welcome message endpoint
    async fn welcome(&self) -> GraphQLResult<WelcomeMessage> {
        Ok(WelcomeMessage {
            message: "Welcome to Execute Academy GraphQL API".to_string(),
            service: "execute_academy".to_string(),
            version: "1.0.0".to_string(),
        })
    }

    /// Health check endpoint
    ///
    /// Probes core dependencies (Postgres, Redis). Returns health status
    /// with component-level details.
    async fn health(&self, ctx: &Context<'_>) -> GraphQLResult<HealthReport> {
        let app_ctx = ctx.data::<Arc<AppContext>>()?;

        let postgres_ok = check_postgres(app_ctx.as_ref()).await;
        let redis_ok = check_redis(app_ctx.as_ref()).await;

        let all_ok = postgres_ok.status == "up" && redis_ok.status == "up";

        Ok(HealthReport {
            service: "execute_academy".to_string(),
            overall_status: if all_ok { "healthy" } else { "degraded" }.to_string(),
            components: ComponentsStatus {
                postgres: postgres_ok,
                redis: redis_ok,
            },
        })
    }
}

/// Welcome message response
#[derive(Serialize, async_graphql::SimpleObject)]
pub struct WelcomeMessage {
    /// Welcome message
    pub message: String,
    /// Service name
    pub service: String,
    /// API version
    pub version: String,
}

/// Health check response
#[derive(Serialize, async_graphql::SimpleObject)]
pub struct HealthReport {
    /// Service name
    pub service: String,
    /// Overall health status
    pub overall_status: String,
    /// Component status details
    pub components: ComponentsStatus,
}

/// Component status details
#[derive(Serialize, async_graphql::SimpleObject)]
pub struct ComponentsStatus {
    /// PostgreSQL status
    pub postgres: ComponentStatus,
    /// Redis status
    pub redis: ComponentStatus,
}

/// Individual component status
#[derive(Serialize, async_graphql::SimpleObject)]
pub struct ComponentStatus {
    /// Component status (up/down)
    pub status: String,
    /// Optional error details
    pub detail: Option<String>,
}

/// Check PostgreSQL connection health
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

/// Check Redis connection health
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
