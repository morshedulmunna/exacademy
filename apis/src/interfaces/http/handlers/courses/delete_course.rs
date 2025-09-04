use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::applications::courses as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;

#[utoipa::path(
    delete,
    path = "/api/courses/:id",
    responses((status = 200, description = "Deleted")),
    security(
        ("bearerAuth" = [])
    ),
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
