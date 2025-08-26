pub mod auth;
pub mod users;
pub mod courses;
pub mod modules;
pub mod lessons;
pub mod media;
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
        .merge(courses::router())
        .merge(modules::router())
        .merge(lessons::router())
        .merge(media::router())
}
