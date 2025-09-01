use axum::{Extension, Json, http::StatusCode};

use crate::applications::lessons as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::pkg::validators::ValidatedJson;
use crate::types::course_types::{BulkUpdateLessonPositionsRequest, Lesson};

#[utoipa::path(
    patch,
    path = "/api/modules/{module_id}/lessons/positions",
    request_body = BulkUpdateLessonPositionsRequest,
    responses((status = 200, description = "Updated lesson positions", body = Vec<Lesson>)),
    tag = "Courses"
)]
pub async fn bulk_update_lesson_positions(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    ValidatedJson(input): ValidatedJson<BulkUpdateLessonPositionsRequest>,
) -> AppResult<(StatusCode, Json<Response<Vec<Lesson>>>)> {
    let lessons = service::bulk_update_lesson_positions(ctx.repos.lessons.as_ref(), input).await?;
    
    let body = Response::with_data("Updated lesson positions", lessons, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}
