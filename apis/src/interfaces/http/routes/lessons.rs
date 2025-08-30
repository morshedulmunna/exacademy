use axum::{
    Router,
    routing::{delete, get, patch, post},
};

use crate::interfaces::http::handlers::lessons as h;

pub fn router() -> Router {
    Router::new()
        .route("/api/modules/:module_id/lessons", get(h::list_lessons))
        .route("/api/modules/:module_id/lessons", post(h::create_lesson))
        .route("/api/lessons/:id", patch(h::update_lesson))
        .route("/api/lessons/:id", delete(h::delete_lesson))
        .route("/api/lessons/:id/video", post(h::upload_lesson_video))
}
