//! System-related GraphQL queries
//!
//! This module contains system-level queries such as welcome messages and health checks.

use std::sync::Arc;

use async_graphql::{Context, Object, Result as GraphQLResult};
use serde::Serialize;

use crate::configs::app_context::AppContext;
use crate::interfaces::health::{HealthReport, generate_health_report};

/// System queries for GraphQL
pub struct SystemQueries;

#[Object]
impl SystemQueries {
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
        Ok(generate_health_report(app_ctx.as_ref()).await)
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
