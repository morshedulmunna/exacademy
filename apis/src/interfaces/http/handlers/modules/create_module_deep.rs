use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::applications::modules::deep_create as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::auth::AuthUser;
use crate::pkg::error::AppResult;
use crate::pkg::validators::ValidatedJson;
use crate::types::course_types::{CreateModuleDeepRequest, ModuleDeep};

#[utoipa::path(
    post,
    path = "/api/courses/:course_id/modules/deep",
    security(("bearerAuth" = [])),
    request_body = CreateModuleDeepRequest,
    responses((status = 201, description = "Created module with nested lessons", body = ModuleDeep)),
    tag = "Courses"
)]
pub async fn create_module_deep(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    auth_user: AuthUser,
    Path(course_id): Path<uuid::Uuid>,
    ValidatedJson(input): ValidatedJson<CreateModuleDeepRequest>,
) -> AppResult<(StatusCode, Json<Response<ModuleDeep>>)> {
    // Ensure only admin users can access this route
    auth_user.require_admin()?;

    let result = service::create_deep(ctx.repos.modules.as_ref(), course_id, input).await?;
    let body = Response::with_data(
        "Module and nested data created",
        result,
        StatusCode::CREATED.as_u16(),
    );
    Ok((StatusCode::CREATED, Json(body)))
}
