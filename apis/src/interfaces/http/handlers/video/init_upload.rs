use axum::{Extension, Json, http::StatusCode};
use std::sync::Arc;
use std::time::Duration;

use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::auth::AuthUser;
use crate::pkg::error::AppResult;
use crate::types::video_types::{
    InitVideoUploadRequest, InitVideoUploadResponse, VideoUploadStatus,
};

/// Initialize a multipart video upload
#[utoipa::path(
    post,
    path = "/api/video/upload/init",
    request_body = InitVideoUploadRequest,
    responses((status = 200, description = "Upload initialized successfully", body = InitVideoUploadResponse)),
    tag = "Video Upload",
    security(("bearer_auth" = []))
)]
pub async fn init_video_upload(
    Extension(ctx): Extension<Arc<AppContext>>,
    _auth_user: AuthUser,
    Json(request): Json<InitVideoUploadRequest>,
) -> AppResult<(StatusCode, Json<Response<InitVideoUploadResponse>>)> {
    // Validate file size (100MB limit)
    const MAX_FILE_SIZE: u64 = 100 * 1024 * 1024;
    if request.file_size > MAX_FILE_SIZE {
        return Err(crate::pkg::error::AppError::BadRequest(
            "File size exceeds 100MB limit".into(),
        ));
    }

    // Validate content type
    if !is_video_content_type(&request.content_type) {
        return Err(crate::pkg::error::AppError::BadRequest(
            "Invalid video content type".into(),
        ));
    }

    // Generate unique file key
    let file_key = ctx
        .spaces_client
        .generate_file_key(&request.filename, request.lesson_id);

    // Initialize multipart upload
    let multipart_upload = ctx
        .spaces_client
        .create_multipart_upload(&file_key, &request.content_type)
        .await?;

    let upload_id = multipart_upload
        .upload_id()
        .ok_or_else(|| crate::pkg::error::AppError::Internal("No upload ID returned".into()))?;

    // Calculate chunk size (5MB)
    const CHUNK_SIZE: u64 = 5 * 1024 * 1024;
    let total_chunks = ((request.file_size + CHUNK_SIZE - 1) / CHUNK_SIZE) as u32;

    // Generate presigned URLs for each chunk
    let mut chunk_urls = Vec::new();
    let expires_in = Duration::from_secs(3600); // 1 hour

    for part_number in 1..=total_chunks {
        let presigned_url = ctx
            .spaces_client
            .generate_presigned_url(&file_key, upload_id, part_number as i32, expires_in)
            .await?;
        chunk_urls.push(presigned_url);
    }

    // Create video record in database
    let video = ctx
        .repos
        .videos
        .create_video_with_params(
            &file_key,
            &request.filename,
            &request.content_type,
            request.file_size as i64,
            request.lesson_id,
            Some(upload_id),
        )
        .await?;

    // Update status to uploading
    ctx.repos
        .videos
        .update_video_status(video.id, VideoUploadStatus::Uploading, None)
        .await?;

    let response = InitVideoUploadResponse {
        upload_id: upload_id.to_string(),
        file_key,
        chunk_urls,
        chunk_size: CHUNK_SIZE,
        total_chunks,
    };

    let body = Response::with_data(
        "Video upload initialized successfully",
        response,
        StatusCode::OK.as_u16(),
    );
    Ok((StatusCode::OK, Json(body)))
}

/// Check if the content type is a valid video type
fn is_video_content_type(content_type: &str) -> bool {
    let video_types = [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/avi",
        "video/mov",
        "video/wmv",
        "video/flv",
        "video/mkv",
    ];

    video_types.contains(&content_type)
}
