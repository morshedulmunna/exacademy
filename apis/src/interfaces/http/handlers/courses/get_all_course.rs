use axum::{Extension, Json, extract::Query, http::StatusCode};

use crate::applications::courses as service;
use crate::configs::app_context::AppContext;
use crate::pkg::error::AppResult;
use crate::types::course_types::{Course, PaginationQuery};

#[utoipa::path(
    get,
    path = "/api/courses",
    params(("page" = Option<i64>, Query, description = "1-based page"), ("per_page" = Option<i64>, Query, description = "items per page")),
    responses((status = 200, description = "List of all courses", body = Vec<Course>)),
    tag = "courses"
)]
pub async fn all_course_list(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Query(query): Query<PaginationQuery>,
) -> AppResult<(StatusCode, Json<Vec<Course>>)> {
    let courses = service::get_all_course(
        ctx.repos.courses.as_ref(),
        query.page.unwrap_or(1),
        query.per_page.unwrap_or(10),
    )
    .await?;
    let body = courses;
    Ok((StatusCode::OK, Json(body)))
}
