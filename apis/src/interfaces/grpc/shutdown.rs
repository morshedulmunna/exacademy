//! Graceful shutdown signal handling for gRPC server
//!
//! This module provides graceful shutdown functionality for the gRPC server,
//! allowing it to cleanly shut down when receiving termination signals.

use tokio::signal;

/// Create a shutdown signal future
///
/// This function returns a future that completes when the server should shut down.
/// It listens for SIGTERM and SIGINT signals.
pub async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("Failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("Failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }

    println!("Shutdown signal received, starting graceful shutdown...");
}
