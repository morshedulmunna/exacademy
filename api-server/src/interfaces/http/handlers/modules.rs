use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::applications::modules as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::pkg::validators::ValidatedJson;
use crate::types::course_types::{CourseModule, CreateModuleRequest, UpdateModuleRequest};

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

#[utoipa::path(
    post,
    path = "/api/courses/:course_id/modules",
    request_body = CreateModuleRequest,
    responses((status = 201, description = "Created module", body = uuid::Uuid)),
    tag = "Courses"
)]
pub async fn create_module(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(_course_id): Path<uuid::Uuid>,
    ValidatedJson(input): ValidatedJson<CreateModuleRequest>,
) -> AppResult<(StatusCode, Json<Response<uuid::Uuid>>)> {
    let id = service::create_module(ctx.repos.modules.as_ref(), input).await?;
    let body = Response::with_data("Module created", id, StatusCode::CREATED.as_u16());
    Ok((StatusCode::CREATED, Json(body)))
}

#[utoipa::path(
    patch,
    path = "/api/modules/:id",
    request_body = UpdateModuleRequest,
    responses((status = 200, description = "Updated module", body = CourseModule)),
    tag = "Courses"
)]
pub async fn update_module(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<uuid::Uuid>,
    ValidatedJson(input): ValidatedJson<UpdateModuleRequest>,
) -> AppResult<(StatusCode, Json<Response<CourseModule>>)> {
    let module = service::update_module(ctx.repos.modules.as_ref(), id, input).await?;
    let body = Response::with_data("Updated module", module, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}

#[utoipa::path(
    delete,
    path = "/api/modules/:id",
    responses((status = 200, description = "Deleted")),
    tag = "Courses"
)]
pub async fn delete_module(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<uuid::Uuid>,
) -> AppResult<(StatusCode, Json<Response<serde_json::Value>>)> {
    service::delete_module(ctx.repos.modules.as_ref(), id).await?;
    let body = Response::with_data(
        "Deleted",
        serde_json::json!({"id": id}),
        StatusCode::OK.as_u16(),
    );
    Ok((StatusCode::OK, Json(body)))
}
