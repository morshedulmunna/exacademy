pub mod auth;
pub mod health;
pub mod not_found;
pub mod root;
pub mod users;

use axum::{Router, routing::get};

/// Build the API routes router
pub fn router() -> Router {
    Router::new()
        .route("/", get(root::handler))
        .route("/api/health", get(health::handler))
        .merge(auth::router())
        .merge(users::router())
}
