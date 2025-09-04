use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::applications::lessons::contents as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::pkg::validators::ValidatedJson;
use crate::types::course_types::{
    CreateLessonContentRequest, LessonContent, UpdateLessonContentRequest,
};

#[utoipa::path(
    post,
    path = "/api/lessons/:lesson_id/contents",
    request_body = CreateLessonContentRequest,
    responses((status = 201, description = "Created lesson content", body = uuid::Uuid)),
    security(
        ("bearerAuth" = [])
    ),
    tag = "lessons"
)]
pub async fn create_lesson_content(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(_lesson_id): Path<uuid::Uuid>,
    ValidatedJson(input): ValidatedJson<CreateLessonContentRequest>,
) -> AppResult<(StatusCode, Json<Response<uuid::Uuid>>)> {
    let id = service::create_content(ctx.repos.lesson_contents.as_ref(), input).await?;
    let body = Response::with_data("Lesson content created", id, StatusCode::CREATED.as_u16());
    Ok((StatusCode::CREATED, Json(body)))
}

#[utoipa::path(
    get,
    path = "/api/lessons/:lesson_id/contents",
    responses((status = 200, description = "List lesson contents", body = [LessonContent])),
    tag = "Lessons"
)]
pub async fn list_lesson_contents(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(lesson_id): Path<uuid::Uuid>,
) -> AppResult<Json<Response<Vec<LessonContent>>>> {
    let items = service::list_contents(ctx.repos.lesson_contents.as_ref(), lesson_id).await?;
    let body = Response::with_data("OK", items, StatusCode::OK.as_u16());
    Ok(Json(body))
}

#[utoipa::path(
    patch,
    path = "/api/lesson-contents/:id",
    request_body = UpdateLessonContentRequest,
    responses((status = 200, description = "Updated lesson content", body = LessonContent)),
    tag = "Lessons"
)]
pub async fn update_lesson_content(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<uuid::Uuid>,
    ValidatedJson(input): ValidatedJson<UpdateLessonContentRequest>,
) -> AppResult<Json<Response<Option<LessonContent>>>> {
    let updated = service::update_content(ctx.repos.lesson_contents.as_ref(), id, input).await?;
    let body = Response::with_data("OK", updated, StatusCode::OK.as_u16());
    Ok(Json(body))
}

#[utoipa::path(
    delete,
    path = "/api/lesson-contents/:id",
    responses((status = 200, description = "Deleted")),
    tag = "Lessons"
)]
pub async fn delete_lesson_content(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<uuid::Uuid>,
) -> AppResult<Json<Response<()>>> {
    service::delete_content(ctx.repos.lesson_contents.as_ref(), id).await?;
    let body = Response::with_message("Deleted", StatusCode::OK.as_u16());
    Ok(Json(body))
}
