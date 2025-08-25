use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::applications::courses as service;
use crate::types::course_types::Course;

#[utoipa::path(
    get,
    path = "/api/course/:slug",
    responses((status = 200, description = "Course by slug", body = Course)),
    tag = "Courses"
)]
pub async fn get_course_by_slug(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(slug): Path<String>,
) -> AppResult<(StatusCode, Json<Response<Course>>)> {
    let course = service::get_course_by_slug(ctx.repos.courses.as_ref(), &slug).await?;
    let body = Response::with_data("Course", course, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}


