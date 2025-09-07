use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::applications::lessons as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::pkg::validators::ValidatedJson;
use crate::types::course_types::CreateLessonRequest;

#[utoipa::path(
    post,
    path = "/api/modules/:module_id/lessons",
    request_body = CreateLessonRequest,
    responses((status = 201, description = "Created lesson", body = uuid::Uuid)),
    security(
        ("bearerAuth" = [])
    ),
    tag = "lessons"
)]
pub async fn create_lesson(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(_module_id): Path<uuid::Uuid>,
    ValidatedJson(input): ValidatedJson<CreateLessonRequest>,
) -> AppResult<(StatusCode, Json<Response<uuid::Uuid>>)> {
    let id = service::create_lesson(ctx.repos.lessons.as_ref(), input).await?;
    let body = Response::with_data("Lesson created", id, StatusCode::CREATED.as_u16());
    Ok((StatusCode::CREATED, Json(body)))
}
