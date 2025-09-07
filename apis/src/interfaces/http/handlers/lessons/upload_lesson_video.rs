use axum::{Extension, Json, extract::Path, http::StatusCode};
use axum_extra::extract::Multipart;

use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::{AppError, AppResult};

#[utoipa::path(
    post,
    path = "/api/lessons/:id/video",
    responses((status = 501, description = "Video upload not implemented")),
    tag = "Courses"
)]
pub async fn upload_lesson_video(
    Extension(_ctx): Extension<std::sync::Arc<AppContext>>,
    Path(_id): Path<uuid::Uuid>,
    _multipart: Multipart,
) -> AppResult<(StatusCode, Json<Response<String>>)> {
    // Video upload functionality has been removed
    Err(AppError::ServiceUnavailable(
        "Video upload functionality is not available".into(),
    ))
}
