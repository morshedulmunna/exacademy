use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::applications::lessons::assignment as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::pkg::validators::ValidatedJson;
use crate::types::course_types::{LessonAssignment, UpsertLessonAssignmentRequest};

#[utoipa::path(
    put,
    path = "/api/lessons/:lesson_id/assignment",
    request_body = UpsertLessonAssignmentRequest,
    responses((status = 200, description = "Upsert assignment", body = uuid::Uuid)),
    tag = "Lessons"
)]
pub async fn upsert_assignment(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(_lesson_id): Path<uuid::Uuid>,
    ValidatedJson(input): ValidatedJson<UpsertLessonAssignmentRequest>,
) -> AppResult<Json<Response<uuid::Uuid>>> {
    let id = service::upsert(ctx.repos.lesson_assignments.as_ref(), input).await?;
    let body = Response::with_data("OK", id, StatusCode::OK.as_u16());
    Ok(Json(body))
}

#[utoipa::path(
    get,
    path = "/api/lessons/:lesson_id/assignment",
    responses((status = 200, description = "Get assignment", body = LessonAssignment)),
    tag = "Lessons"
)]
pub async fn get_assignment(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(lesson_id): Path<uuid::Uuid>,
) -> AppResult<Json<Response<Option<LessonAssignment>>>> {
    let item = service::get(ctx.repos.lesson_assignments.as_ref(), lesson_id).await?;
    let body = Response::with_data("OK", item, StatusCode::OK.as_u16());
    Ok(Json(body))
}

#[utoipa::path(
    delete,
    path = "/api/lessons/:lesson_id/assignment",
    responses((status = 200, description = "Delete assignment")),
    tag = "Lessons"
)]
pub async fn delete_assignment(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(lesson_id): Path<uuid::Uuid>,
) -> AppResult<Json<Response<()>>> {
    service::delete(ctx.repos.lesson_assignments.as_ref(), lesson_id).await?;
    let body = Response::with_message("Deleted", StatusCode::OK.as_u16());
    Ok(Json(body))
}


