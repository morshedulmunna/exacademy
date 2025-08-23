pub mod auth;
pub mod users;
pub use crate::interfaces::http::handlers::root::handler;

use crate::interfaces::http::handlers::health;
use axum::{Router, routing::get};

/// Build the API routes router
pub fn router() -> Router {
    Router::new()
        .route("/", get(handler))
        .route("/api/health", get(health::handler))
        .merge(auth::router())
        .merge(users::router())
}
