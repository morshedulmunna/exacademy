//! gRPC interface module
//!
//! This module provides gRPC API endpoints for course activity streaming.
//! The structure is organized into focused modules for better maintainability:
//! - `actions`: gRPC service implementations organized by domain
//! - `handlers`: gRPC request handlers and service definitions
//! - `middlewares`: Middleware configuration and interceptors
//! - `schema`: Protobuf schema definitions and generated code
//! - `server`: Main server implementation and startup logic
//! - `shutdown`: Graceful shutdown signal handling

pub mod actions;
pub mod handlers;
pub mod middlewares;
pub mod schema;
pub mod server;
pub mod shutdown;

pub use server::*;
