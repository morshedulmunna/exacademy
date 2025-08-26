use axum::{Extension, Json, http::StatusCode};
use axum_extra::extract::Multipart;

use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::pkg::upload;

#[derive(Debug, Serialize, Deserialize)]
pub struct UploadResponse {
    pub url: String,
    pub filename: String,
    pub size: usize,
    pub content_type: String,
}

#[utoipa::path(
    post,
    path = "/api/media/upload",
    responses((status = 200, description = "File uploaded successfully", body = UploadResponse)),
    tag = "Media"
)]
pub async fn upload_media(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    mut multipart: Multipart,
) -> AppResult<(StatusCode, Json<Response<UploadResponse>>)> {
    let mut file_bytes: Option<Vec<u8>> = None;
    let mut file_name: Option<String> = None;
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
            _ => {}
        }
    }

    let bytes = file_bytes
        .ok_or_else(|| crate::pkg::error::AppError::BadRequest("Missing file field".into()))?;

    // Validate file size (10MB limit)
    if bytes.len() > 10 * 1024 * 1024 {
        return Err(crate::pkg::error::AppError::BadRequest("File size exceeds 10MB limit".into()));
    }

    // Validate content type
    let content_type = content_type.unwrap_or_else(|| "application/octet-stream".to_string());
    if !is_allowed_content_type(&content_type) {
        return Err(crate::pkg::error::AppError::BadRequest("File type not allowed".into()));
    }

    // Save the file to uploads directory
    let file_path = upload::save_bytes(&bytes, file_name.as_deref()).await?;
    
    // Construct the full URL
    let base_url = &ctx.system.base_url;
    let full_url = format!("{}{}", base_url, file_path);

    let response = UploadResponse {
        url: full_url,
        filename: file_name.unwrap_or_else(|| "uploaded_file".to_string()),
        size: bytes.len(),
        content_type,
    };

    let body = Response::with_data("File uploaded successfully", response, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}

/// Check if the content type is allowed
fn is_allowed_content_type(content_type: &str) -> bool {
    let allowed_types = [
        // Images
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml",
        // Videos
        "video/mp4", "video/webm", "video/ogg", "video/avi", "video/mov",
        // Documents
        "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain", "text/csv",
        // Audio
        "audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4",
    ];
    
    allowed_types.contains(&content_type)
}
