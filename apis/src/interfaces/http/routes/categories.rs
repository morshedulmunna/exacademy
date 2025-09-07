use axum::{Router, routing::{get, post, patch, delete}};

use crate::interfaces::http::handlers::{categories as h, course_categories as hc};

pub fn router() -> Router {
    Router::new()
        // categories CRUD
        .route("/api/categories", get(h::list_categories))
        .route("/api/categories", post(h::create_category))
        .route("/api/categories/:id", get(h::get_category))
        .route("/api/categories/:id", patch(h::update_category))
        .route("/api/categories/:id", delete(h::delete_category))
        // course-category linking
        .route("/api/courses/:course_id/categories/:category_id", post(hc::attach))
        .route("/api/courses/:course_id/categories/:category_id", delete(hc::detach))
}


