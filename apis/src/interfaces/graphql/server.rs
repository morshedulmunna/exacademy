use std::net::SocketAddr;
use std::sync::Arc;

use crate::configs::app_context::AppContext;
use crate::pkg::logger::info;

use super::middleware::build_app;
use super::shutdown::shutdown_signal;

/// GraphQL server implementation
///
/// This module provides the main server functionality for the GraphQL API,
/// including server startup, configuration, and graceful shutdown handling.

/// Start the GraphQL server using Axum with graceful shutdown
///
/// Binds to the specified host and port, then starts the server with all
/// configured middleware and graceful shutdown handling.
pub async fn start_server(
    host: &str,
    config: &AppContext,
) -> Result<(), Box<dyn std::error::Error>> {
    let ctx = Arc::new(config.clone());
    let app = build_app(ctx);

    let addr: SocketAddr = format!("{}:{}", host, config.system.graphql_port).parse()?;
    let listener = tokio::net::TcpListener::bind(addr).await?;

    info(format!(
        "GraphQL server starting on http://{}:{}",
        host, config.system.graphql_port
    ));

    // Start the server with graceful shutdown
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await?;

    info("GraphQL server shutdown complete".to_string());
    Ok(())
}

/// Start the GraphQL server with default configuration
///
/// Initializes the application context and starts the server using the
/// configured host and port from the environment.
pub async fn start_default_server() -> Result<(), Box<dyn std::error::Error>> {
    let ctx = AppContext::get()
        .await
        .expect("Failed to initialize AppContext");

    info(format!(
        "GraphQL server will be available at http://{}:{}/graphql",
        ctx.system.api_host, ctx.system.graphql_port
    ));

    start_server(&ctx.system.api_host, ctx.as_ref()).await
}

/// Entry point called by `graphql_command` to run the GraphQL server
///
/// This is the main entry point for starting the GraphQL server with
/// default configuration and graceful shutdown handling.
pub async fn run() -> Result<(), Box<dyn std::error::Error>> {
    start_default_server().await
}
