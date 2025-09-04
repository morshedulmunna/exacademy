//! Graceful shutdown signal handling
//!
//! This module provides graceful shutdown functionality for the GraphQL server,
//! handling both SIGINT (Ctrl+C) and SIGTERM signals on Unix systems.

use crate::pkg::logger::info;
use tokio::signal;

/// Graceful shutdown signal handler
///
/// Listens for shutdown signals (Ctrl+C and SIGTERM) and provides a future
/// that completes when a shutdown signal is received. This allows the server
/// to perform graceful shutdown operations.
pub async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {
            info("Received Ctrl+C, shutting down GraphQL server gracefully...".to_string());
        },
        _ = terminate => {
            info("Received SIGTERM, shutting down GraphQL server gracefully...".to_string());
        },
    }
}
