use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::applications::lessons as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::types::course_types::Lesson;

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


