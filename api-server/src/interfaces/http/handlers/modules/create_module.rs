use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::applications::modules as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::pkg::validators::ValidatedJson;
use crate::types::course_types::CreateModuleRequest;

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


