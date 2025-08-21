use crate::interfaces::http::handlers::users;
use axum::{
    Router,
    routing::{get, patch},
};

pub fn router() -> Router {
    Router::new()
        .route("/api/users/:id", get(users::get_user))
        .route("/api/users/me", patch(users::update_user))
}
