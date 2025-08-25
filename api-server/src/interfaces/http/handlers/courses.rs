use axum::{
    Extension, Json,
    extract::{Path, Query},
    http::StatusCode,
};

use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::pkg::validators::ValidatedJson;
use crate::types::course_types::{
    Course, CreateCourseRequest, Page, PaginationQuery, UpdateCourseRequest,
};
use crate::{applications::courses as service, pkg::auth::AuthUser};

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

#[utoipa::path(
    get,
    path = "/api/courses/:id",
    responses((status = 200, description = "Course", body = Course)),
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

#[utoipa::path(
    delete,
    path = "/api/courses/:id",
    responses((status = 200, description = "Deleted")),
    tag = "Courses"
)]
pub async fn delete_course(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<uuid::Uuid>,
) -> AppResult<(StatusCode, Json<Response<serde_json::Value>>)> {
    service::delete_course_by_id(ctx.repos.courses.as_ref(), id).await?;
    let body = Response::with_data(
        "Deleted",
        serde_json::json!({"id": id}),
        StatusCode::OK.as_u16(),
    );
    Ok((StatusCode::OK, Json(body)))
}

// modules and lessons are moved to their own handlers

#[utoipa::path(
    get,
    path = "/api/instructors/:id/courses/paginated",
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
