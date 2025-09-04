use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::applications::courses as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::types::course_types::Course;

#[utoipa::path(
    get,
    path = "/api/courses/:id",
    responses((status = 200, description = "Course", body = Course)),
    security(
        ("bearerAuth" = [])
    ),
    tag = "Courses"
)]
pub async fn get_course_by_id(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<uuid::Uuid>,
) -> AppResult<(StatusCode, Json<Response<Course>>)> {
    let course = service::get_course_by_id(ctx.repos.courses.as_ref(), id).await?;
    let body = Response::with_data("Course", course, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}
