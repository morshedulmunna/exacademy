use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::applications::categories as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::pkg::validators::ValidatedJson;
use crate::types::course_types::{Category, CreateCategoryRequest, UpdateCategoryRequest};

#[utoipa::path(
    post,
    path = "/api/categories",
    request_body = CreateCategoryRequest,
    responses((status = 201, description = "Created category", body = i32)),
    tag = "Categories"
)]
pub async fn create_category(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    ValidatedJson(input): ValidatedJson<CreateCategoryRequest>,
) -> AppResult<(StatusCode, Json<Response<i32>>)> {
    let id = service::create(ctx.repos.categories.as_ref(), input).await?;
    let body = Response::with_data("Category created", id, StatusCode::CREATED.as_u16());
    Ok((StatusCode::CREATED, Json(body)))
}

#[utoipa::path(
    get,
    path = "/api/categories",
    responses((status = 200, description = "List categories", body = [Category])),
    tag = "Categories"
)]
pub async fn list_categories(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
) -> AppResult<Json<Response<Vec<Category>>>> {
    let items = service::list_all(ctx.repos.categories.as_ref()).await?;
    let body = Response::with_data("OK", items, StatusCode::OK.as_u16());
    Ok(Json(body))
}

#[utoipa::path(
    get,
    path = "/api/categories/:id",
    responses((status = 200, description = "Get category", body = Category)),
    tag = "Categories"
)]
pub async fn get_category(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<i32>,
) -> AppResult<Json<Response<Option<Category>>>> {
    let item = service::get_by_id(ctx.repos.categories.as_ref(), id).await?;
    let body = Response::with_data("OK", item, StatusCode::OK.as_u16());
    Ok(Json(body))
}

#[utoipa::path(
    patch,
    path = "/api/categories/:id",
    request_body = UpdateCategoryRequest,
    responses((status = 200, description = "Updated category", body = Category)),
    tag = "Categories"
)]
pub async fn update_category(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<i32>,
    ValidatedJson(input): ValidatedJson<UpdateCategoryRequest>,
) -> AppResult<Json<Response<Option<Category>>>> {
    let updated = service::update_by_id(ctx.repos.categories.as_ref(), id, input).await?;
    let body = Response::with_data("OK", updated, StatusCode::OK.as_u16());
    Ok(Json(body))
}

#[utoipa::path(
    delete,
    path = "/api/categories/:id",
    responses((status = 200, description = "Deleted category")),
    tag = "Categories"
)]
pub async fn delete_category(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<i32>,
) -> AppResult<Json<Response<()>>> {
    service::delete_by_id(ctx.repos.categories.as_ref(), id).await?;
    let body = Response::with_message("Deleted", StatusCode::OK.as_u16());
    Ok(Json(body))
}


