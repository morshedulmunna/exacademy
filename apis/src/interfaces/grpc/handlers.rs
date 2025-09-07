//! gRPC request handlers and service definitions
//!
//! This module contains the gRPC service handlers and request processing logic.

use crate::configs::app_context::AppContext;
use crate::interfaces::grpc::actions::course_activity::CourseActivityServiceImpl;
use crate::interfaces::grpc::schema::course_activity_service_server::CourseActivityServiceServer;
use std::sync::Arc;

/// Create and configure gRPC services
///
/// This function sets up all gRPC services with the given application context
/// and returns them ready to be added to the gRPC server.
pub fn create_services(
    app_context: Arc<AppContext>,
) -> Vec<CourseActivityServiceServer<CourseActivityServiceImpl>> {
    let course_activity_service = CourseActivityServiceImpl::new(app_context);
    let course_activity_server = CourseActivityServiceServer::new(course_activity_service);

    vec![course_activity_server]
}
