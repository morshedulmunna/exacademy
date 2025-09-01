use axum::{
    Router,
    routing::{delete, get, patch, post},
};

use crate::interfaces::http::handlers::modules as h;

pub fn router() -> Router {
    Router::new()
        .route("/api/courses/:course_id/modules", get(h::list_modules))
        .route("/api/courses/:course_id/modules", post(h::create_module))
        .route(
            "/api/courses/:course_id/modules/deep",
            get(h::list_modules_deep).post(h::create_module_deep),
        )
        .route("/api/modules/:id", patch(h::update_module))
        .route("/api/modules/:id", delete(h::delete_module))
}
