use axum::{Extension, Json, extract::Path, http::StatusCode};
use axum_extra::extract::Multipart;

use crate::applications::lessons as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::types::course_types::Lesson;

#[utoipa::path(
    post,
    path = "/api/lessons/:id/video",
    responses((status = 200, description = "Uploaded video and updated lesson", body = Lesson)),
    tag = "Courses"
)]
pub async fn upload_lesson_video(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<uuid::Uuid>,
    mut multipart: Multipart,
) -> AppResult<(StatusCode, Json<Response<Lesson>>)> {
    // Expect a single file field named "file" and optional text fields: name, description, privacy_view, content_type
    let mut file_bytes: Option<Vec<u8>> = None;
    let mut file_name: Option<String> = None;
    let mut description: Option<String> = None;
    let mut privacy_view: Option<String> = None;
    let mut content_type: Option<String> = None;

    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?
    {
        let name = field.name().map(|s| s.to_string());
        let file_name_field = field.file_name().map(|s| s.to_string());
        let ct = field.content_type().map(|s| s.to_string());
        match name.as_deref() {
            Some("file") => {
                let data = field
                    .bytes()
                    .await
                    .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?;
                file_bytes = Some(data.to_vec());
                if let Some(fn_) = file_name_field {
                    file_name = Some(fn_);
                }
                if let Some(ct_) = ct {
                    content_type = Some(ct_);
                }
            }
            Some("name") => {
                let v = field
                    .text()
                    .await
                    .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?;
                file_name = Some(v);
            }
            Some("description") => {
                let v = field
                    .text()
                    .await
                    .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?;
                description = Some(v);
            }
            Some("privacy_view") => {
                let v = field
                    .text()
                    .await
                    .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?;
                privacy_view = Some(v);
            }
            Some("content_type") => {
                let v = field
                    .text()
                    .await
                    .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?;
                content_type = Some(v);
            }
            _ => {}
        }
    }

    let bytes = file_bytes
        .ok_or_else(|| crate::pkg::error::AppError::BadRequest("Missing file field".into()))?;
    let name = file_name.as_deref().unwrap_or("lesson-video");
    let pv = privacy_view
        .as_deref()
        .unwrap_or(&ctx.vimeo.default_privacy_view);
    let ct = content_type.as_deref();

    let res = ctx
        .vimeo_client
        .upload_bytes(name, description.as_deref(), Some(pv), bytes, ct)
        .await?;

    let link = res
        .link
        .unwrap_or_else(|| format!("https://vimeo.com{}", res.uri));

    // Update lesson video_url
    let updated = service::update_lesson(
        ctx.repos.lessons.as_ref(),
        id,
        crate::types::course_types::UpdateLessonRequest {
            title: None,
            description: None,
            content: None,
            video_url: Some(link),
            duration: None,
            position: None,
            is_free: None,
            published: None,
        },
    )
    .await?;

    let body = Response::with_data("Uploaded", updated, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}


