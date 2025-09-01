use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::applications::modules as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::types::course_types::ModuleDeep;

#[utoipa::path(
    get,
    path = "/api/courses/:course_id/modules/deep",
    responses((status = 200, description = "Modules with nested lessons", body = [ModuleDeep])),
    tag = "Courses"
)]
pub async fn list_modules_deep(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(course_id): Path<uuid::Uuid>,
) -> AppResult<(StatusCode, Json<Response<Vec<ModuleDeep>>>)> {
    let items = service::list_modules_by_course_deep(ctx.repos.modules.as_ref(), course_id).await?;
    let body = Response::with_data("Modules with nested lessons", items, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}
