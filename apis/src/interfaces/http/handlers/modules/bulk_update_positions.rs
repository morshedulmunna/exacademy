use axum::{Extension, Json, http::StatusCode};

use crate::applications::modules as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::pkg::validators::ValidatedJson;
use crate::types::course_types::{BulkUpdateModulePositionsRequest, CourseModule};

#[utoipa::path(
    patch,
    path = "/api/courses/{course_id}/modules/positions",
    request_body = BulkUpdateModulePositionsRequest,
    responses((status = 200, description = "Updated module positions", body = Vec<CourseModule>)),
    tag = "Courses"
)]
pub async fn bulk_update_module_positions(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    ValidatedJson(input): ValidatedJson<BulkUpdateModulePositionsRequest>,
) -> AppResult<(StatusCode, Json<Response<Vec<CourseModule>>>)> {
    let modules = service::bulk_update_module_positions(ctx.repos.modules.as_ref(), input).await?;
    
    let body = Response::with_data("Updated module positions", modules, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}
