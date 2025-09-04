//! GraphQL server middleware configuration
//!
//! This module configures and sets up all middleware layers for the GraphQL server
//! including CORS, compression, tracing, rate limiting, request logging, and error handling.

use axum::{Extension, Router};
use std::sync::Arc;
use tower::ServiceBuilder;
use tower_http::{compression::CompressionLayer, cors::CorsLayer, trace::TraceLayer};

use super::handlers::{graphql_handler, graphql_playground};
use super::schema::create_schema;
use crate::configs::app_context::AppContext;
use crate::interfaces::middlewares::axum_error_handler::error_handler as error_handler_mw;
use crate::interfaces::middlewares::axum_rate_limit::{
    RateLimitState, rate_limit as rate_limit_mw,
};
use crate::interfaces::middlewares::axum_request_logger::request_logger as request_logger_mw;

/// Configure and apply all middleware layers to the GraphQL router
///
/// Sets up CORS, compression, tracing, rate limiting, request logging, and error handling
/// middleware layers in the correct order for optimal performance and security.
pub fn configure_middleware(app: Router, _ctx: Arc<AppContext>) -> Router {
    let cors = CorsLayer::permissive();
    let trace = TraceLayer::new_for_http();
    let compression = CompressionLayer::new();
    let _rate_limit_state = RateLimitState::new(100, 60);

    app.layer(
        ServiceBuilder::new()
            .layer(trace)
            .layer(cors)
            .layer(compression)
            .layer(axum::middleware::from_fn_with_state(
                _rate_limit_state.clone(),
                rate_limit_mw,
            )),
    )
    .layer(axum::middleware::from_fn(request_logger_mw))
    .layer(axum::middleware::from_fn(error_handler_mw))
}

/// Build the complete GraphQL application router with all routes and middleware
///
/// Creates the main router with GraphQL endpoints and applies all necessary
/// middleware layers and state management.
pub fn build_app(ctx: Arc<AppContext>) -> Router {
    let schema = create_schema(ctx.clone());

    let app = Router::new()
        .route("/graphql", axum::routing::post(graphql_handler))
        .route("/graphql", axum::routing::get(graphql_playground))
        .with_state(schema)
        .layer(Extension(ctx.clone()));

    configure_middleware(app, ctx)
}
