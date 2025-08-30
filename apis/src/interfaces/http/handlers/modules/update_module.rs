use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::applications::modules as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::pkg::validators::ValidatedJson;
use crate::types::course_types::{CourseModule, UpdateModuleRequest};

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


