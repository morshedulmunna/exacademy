use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::pkg::validators::ValidatedJson;
use crate::applications::courses as service;
use crate::types::course_types::{Course, UpdateCourseRequest};

#[utoipa::path(
    patch,
    path = "/api/courses/:id",
    request_body = UpdateCourseRequest,
    responses((status = 200, description = "Updated course", body = Course)),
    tag = "Courses"
)]
pub async fn update_course(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<uuid::Uuid>,
    ValidatedJson(input): ValidatedJson<UpdateCourseRequest>,
) -> AppResult<(StatusCode, Json<Response<Course>>)> {
    let course = service::update_course_by_id(ctx.repos.courses.as_ref(), id, input).await?;
    let body = Response::with_data("Updated course", course, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}


