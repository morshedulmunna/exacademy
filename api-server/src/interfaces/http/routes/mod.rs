pub mod auth;
pub mod root;
pub mod users;

use crate::interfaces::http::handlers::health;
use axum::{Router, routing::get};

/// Build the API routes router
pub fn router() -> Router {
    Router::new()
        .route("/", get(root::handler))
        .route("/api/health", get(health::handler))
        .merge(auth::router())
        .merge(users::router())
}
