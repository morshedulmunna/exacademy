use super::shutdown::shutdown_signal;
use crate::configs::app_context::AppContext;
use crate::interfaces::grpc::actions::course_activity::CourseActivityServiceImpl;
use crate::interfaces::grpc::schema::course_activity_service_server::CourseActivityServiceServer;
use crate::pkg::logger::info;
use std::sync::Arc;

/// gRPC server implementation
///
/// This module provides the main server functionality for the gRPC API,
/// including server startup, configuration, and graceful shutdown handling.

/// Start the gRPC server with graceful shutdown
///
/// Binds to the specified host and port, then starts the server with all
/// configured services and graceful shutdown handling.
pub async fn start_server(
    host: &str,
    config: &AppContext,
) -> Result<(), Box<dyn std::error::Error>> {
    let ctx = Arc::new(config.clone());

    // Create gRPC service
    let course_activity_service = CourseActivityServiceImpl::new(ctx);
    let course_activity_server = CourseActivityServiceServer::new(course_activity_service);

    let addr = format!("{}:{}", host, config.system.grpc_port).parse()?;

    info(format!(
        "gRPC server starting on {}:{}",
        host, config.system.grpc_port
    ));

    // Start the server with graceful shutdown
    tokio::select! {
        result = tonic::transport::Server::builder()
            .add_service(course_activity_server)
            .serve(addr) => {
            if let Err(e) = result {
                eprintln!("gRPC server error: {}", e);
            }
        }
        _ = shutdown_signal() => {
            info("Shutdown signal received".to_string());
        }
    }

    info("gRPC server shutdown complete".to_string());
    Ok(())
}

/// Start the gRPC server with default configuration
///
/// Initializes the application context and starts the server using the
/// configured host and port from the environment.
pub async fn start_default_server() -> Result<(), Box<dyn std::error::Error>> {
    let ctx = AppContext::get()
        .await
        .expect("Failed to initialize AppContext");

    info(format!(
        "gRPC server will be available at {}:{}",
        ctx.system.api_host, ctx.system.grpc_port
    ));

    start_server(&ctx.system.api_host, ctx.as_ref()).await
}

/// Entry point called by `grpc_command` to run the gRPC server
///
/// This is the main entry point for starting the gRPC server with
/// default configuration and graceful shutdown handling.
pub async fn run() -> Result<(), Box<dyn std::error::Error>> {
    start_default_server().await
}
