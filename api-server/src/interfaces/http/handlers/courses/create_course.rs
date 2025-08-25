use axum::{Extension, Json, http::StatusCode};

use crate::applications::courses as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::auth::AuthUser;
use crate::pkg::error::AppResult;
use crate::pkg::validators::ValidatedJson;
use crate::types::course_types::CreateCourseRequest;

#[utoipa::path(
    post,
    path = "/api/courses",
    request_body = CreateCourseRequest,
    responses((status = 201, description = "Created course", body = uuid::Uuid)),
    tag = "Courses"
)]
pub async fn create_course(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    auth_user: AuthUser,
    ValidatedJson(input): ValidatedJson<CreateCourseRequest>,
) -> AppResult<(StatusCode, Json<Response<uuid::Uuid>>)> {
    let id = service::create_course(ctx.repos.courses.as_ref(), auth_user.user_id, input).await?;
    let body = Response::with_data("Course created", id, StatusCode::CREATED.as_u16());
    Ok((StatusCode::CREATED, Json(body)))
}
