use axum::{Extension, Json, extract::Query, http::StatusCode};

use crate::applications::courses as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::auth::AuthUser;
use crate::pkg::error::AppResult;
use crate::types::course_types::{Course, Page, PaginationQuery};

#[utoipa::path(
    get,
    path = "/api/instructors/courses/list",
    params(("page" = Option<i64>, Query, description = "1-based page"), ("per_page" = Option<i64>, Query, description = "items per page")),
    responses((status = 200, description = "Paginated courses by instructor", body = Page<Course>)),
    tag = "Courses"
)]
pub async fn list_courses_by_instructor_paginated(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    auth_user: AuthUser,
    Query(q): Query<PaginationQuery>,
) -> AppResult<(StatusCode, Json<Response<Page<Course>>>)> {
    let page = q.page.unwrap_or(1);
    let per_page = q.per_page.unwrap_or(10);

    let data = service::list_courses_paginated_by_instructor(
        ctx.repos.courses.as_ref(),
        auth_user.user_id,
        page,
        per_page,
    )
    .await?;
    let body = Response::with_data("Courses", data, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}
