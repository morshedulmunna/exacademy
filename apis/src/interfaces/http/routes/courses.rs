use axum::{
    Router,
    routing::{delete, get, patch, post},
};

use crate::interfaces::http::handlers::courses as h;

pub fn router() -> Router {
    Router::new()
        .route("/api/courses", post(h::create_course))
        .route("/api/courses", get(h::all_course_list))
        .route("/api/courses/:id", get(h::get_course_by_id))
        .route("/api/courses/:id", patch(h::update_course))
        .route("/api/courses/:id", delete(h::delete_course))
        // Instructor specific
        .route(
            "/api/instructors/courses/list",
            get(h::list_courses_by_instructor_paginated),
        )
        // Public fetch by slug
        .route("/api/course/:slug", get(h::get_course_by_slug))
}
