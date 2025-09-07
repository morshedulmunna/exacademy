use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::applications::course_categories as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;

#[utoipa::path(
    post,
    path = "/api/courses/:course_id/categories/:category_id",
    responses((status = 200, description = "Attached")),
    tag = "Categories"
)]
pub async fn attach(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path((course_id, category_id)): Path<(uuid::Uuid, i32)>,
) -> AppResult<Json<Response<()>>> {
    service::attach(ctx.repos.course_categories.as_ref(), course_id, category_id).await?;
    let body = Response::with_message("Attached", StatusCode::OK.as_u16());
    Ok(Json(body))
}

#[utoipa::path(
    delete,
    path = "/api/courses/:course_id/categories/:category_id",
    responses((status = 200, description = "Detached")),
    tag = "Categories"
)]
pub async fn detach(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path((course_id, category_id)): Path<(uuid::Uuid, i32)>,
) -> AppResult<Json<Response<()>>> {
    service::detach(ctx.repos.course_categories.as_ref(), course_id, category_id).await?;
    let body = Response::with_message("Detached", StatusCode::OK.as_u16());
    Ok(Json(body))
}


