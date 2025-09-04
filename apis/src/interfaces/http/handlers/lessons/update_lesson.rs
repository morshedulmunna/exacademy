use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::applications::lessons as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::pkg::validators::ValidatedJson;
use crate::types::course_types::{Lesson, UpdateLessonRequest};

#[utoipa::path(
    patch,
    path = "/api/lessons/:id",
    request_body = UpdateLessonRequest,
    responses((status = 200, description = "Updated lesson", body = Lesson)),
    security(
        ("bearerAuth" = [])
    ),
    tag = "lessons"
)]
pub async fn update_lesson(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<uuid::Uuid>,
    ValidatedJson(input): ValidatedJson<UpdateLessonRequest>,
) -> AppResult<(StatusCode, Json<Response<Lesson>>)> {
    let lesson = service::update_lesson(ctx.repos.lessons.as_ref(), id, input).await?;
    let body = Response::with_data("Updated lesson", lesson, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}
