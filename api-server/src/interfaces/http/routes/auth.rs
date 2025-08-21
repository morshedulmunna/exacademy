use crate::interfaces::http::handlers::auth;
use axum::{Router, routing::post};

pub fn router() -> Router {
    Router::new()
        .route("/api/auth/register", post(auth::register))
        .route("/api/auth/login", post(auth::login))
        .route("/api/auth/refresh", post(auth::refresh))
        .route("/api/auth/logout", post(auth::logout))
}
