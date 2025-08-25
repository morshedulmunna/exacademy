use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::applications::modules as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::types::course_types::CourseModule;

#[utoipa::path(
    get,
    path = "/api/courses/:course_id/modules",
    responses((status = 200, description = "Modules", body = [CourseModule])),
    tag = "Courses"
)]
pub async fn list_modules(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(course_id): Path<uuid::Uuid>,
) -> AppResult<(StatusCode, Json<Response<Vec<CourseModule>>>)> {
    let items = service::list_modules_by_course(ctx.repos.modules.as_ref(), course_id).await?;
    let body = Response::with_data("Modules", items, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}


