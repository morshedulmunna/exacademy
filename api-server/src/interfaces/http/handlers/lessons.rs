use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::applications::lessons as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::pkg::validators::ValidatedJson;
use crate::types::course_types::{CreateLessonRequest, Lesson, UpdateLessonRequest};

#[utoipa::path(
    get,
    path = "/api/modules/:module_id/lessons",
    responses((status = 200, description = "Lessons", body = [Lesson])),
    tag = "Courses"
)]
pub async fn list_lessons(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(module_id): Path<uuid::Uuid>,
) -> AppResult<(StatusCode, Json<Response<Vec<Lesson>>>)> {
    let items = service::list_lessons_by_module(ctx.repos.lessons.as_ref(), module_id).await?;
    let body = Response::with_data("Lessons", items, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}

#[utoipa::path(
    post,
    path = "/api/modules/:module_id/lessons",
    request_body = CreateLessonRequest,
    responses((status = 201, description = "Created lesson", body = uuid::Uuid)),
    tag = "Courses"
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

#[utoipa::path(
    patch,
    path = "/api/lessons/:id",
    request_body = UpdateLessonRequest,
    responses((status = 200, description = "Updated lesson", body = Lesson)),
    tag = "Courses"
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

#[utoipa::path(
    delete,
    path = "/api/lessons/:id",
    responses((status = 200, description = "Deleted")),
    tag = "Courses"
)]
pub async fn delete_lesson(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<uuid::Uuid>,
) -> AppResult<(StatusCode, Json<Response<serde_json::Value>>)> {
    service::delete_lesson(ctx.repos.lessons.as_ref(), id).await?;
    let body = Response::with_data(
        "Deleted",
        serde_json::json!({"id": id}),
        StatusCode::OK.as_u16(),
    );
    Ok((StatusCode::OK, Json(body)))
}
