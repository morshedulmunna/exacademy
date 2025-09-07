//! Shared middleware modules
//!
//! This module provides common middleware functionality that can be used
//! by both HTTP and GraphQL servers.

pub mod axum_error_handler;
pub mod axum_rate_limit;
pub mod axum_request_logger;

pub use axum_error_handler::*;
pub use axum_rate_limit::*;
pub use axum_request_logger::*;
