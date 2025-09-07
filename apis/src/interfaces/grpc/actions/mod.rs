//! gRPC service implementations module
//!
//! This module organizes gRPC service implementations by domain for better maintainability
//! and scalability.

pub mod course_activity;

use crate::configs::app_context::AppContext;
use std::sync::Arc;

/// Root service type that combines all domain-specific services
pub struct GrpcServiceRoot {
    pub app_context: Arc<AppContext>,
}

impl GrpcServiceRoot {
    /// Create a new gRPC service root with the given application context
    pub fn new(app_context: Arc<AppContext>) -> Self {
        Self { app_context }
    }
}
