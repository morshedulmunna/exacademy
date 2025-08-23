use axum::{
    Router,
    routing::{delete, get, patch},
};

use crate::interfaces::http::handlers::courses as h;

pub fn router() -> Router {
    Router::new()
        // Courses CRUD
        .route("/api/courses", get(h::list_courses).post(h::create_course))
        .route("/api/courses/paginated", get(h::list_courses_paginated))
        .route("/api/courses/:id", get(h::get_course_by_id))
        .route("/api/courses/:id", patch(h::update_course))
        .route("/api/courses/:id", delete(h::delete_course))
        // Public fetch by slug
        .route("/api/course/:slug", get(h::get_course_by_slug))
}
