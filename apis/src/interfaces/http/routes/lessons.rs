use axum::{
    Router,
    routing::{delete, get, patch, post, put},
};

use crate::interfaces::http::handlers::lessons as h;

pub fn router() -> Router {
    Router::new()
        .route("/api/modules/:module_id/lessons", get(h::list_lessons))
        .route("/api/modules/:module_id/lessons", post(h::create_lesson))
        .route(
            "/api/modules/:module_id/lessons/positions",
            patch(h::bulk_update_lesson_positions),
        )
        .route("/api/lessons/:id", delete(h::delete_lesson))
        // contents
        .route(
            "/api/lessons/:lesson_id/contents",
            get(h::list_lesson_contents),
        )
        .route(
            "/api/lessons/:lesson_id/contents",
            post(h::create_lesson_content),
        )
        .route("/api/lesson-contents/:id", patch(h::update_lesson_content))
        .route("/api/lesson-contents/:id", delete(h::delete_lesson_content))
        // questions
        .route("/api/lessons/:lesson_id/questions", get(h::list_questions))
        .route(
            "/api/lessons/:lesson_id/questions",
            post(h::create_question),
        )
        .route("/api/lesson-questions/:id", patch(h::update_question))
        .route("/api/lesson-questions/:id", delete(h::delete_question))
        // options
        .route(
            "/api/lesson-questions/:question_id/options",
            get(h::list_options),
        )
        .route(
            "/api/lesson-questions/:question_id/options",
            post(h::create_option),
        )
        .route("/api/question-options/:id", patch(h::update_option))
        .route("/api/question-options/:id", delete(h::delete_option))
        // assignment
        .route("/api/lessons/:lesson_id/assignment", get(h::get_assignment))
        .route(
            "/api/lessons/:lesson_id/assignment",
            put(h::upsert_assignment),
        )
        .route(
            "/api/lessons/:lesson_id/assignment",
            delete(h::delete_assignment),
        )
}
