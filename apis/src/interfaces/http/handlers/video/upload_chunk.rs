use axum::{Extension, Json, http::StatusCode};
use std::sync::Arc;

use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::pkg::auth::AuthUser;
use crate::types::video_types::{
    UploadChunkRequest,
    UploadChunkResponse,
};

/// Upload a video chunk (alternative to direct upload to presigned URL)
#[utoipa::path(
    post,
    path = "/api/video/upload/chunk",
    request_body = UploadChunkRequest,
    responses((status = 200, description = "Chunk uploaded successfully", body = UploadChunkResponse)),
    tag = "Video Upload",
    security(("bearer_auth" = []))
)]
pub async fn upload_video_chunk(
    Extension(ctx): Extension<Arc<AppContext>>,
    _auth_user: AuthUser,
    Json(request): Json<UploadChunkRequest>,
) -> AppResult<(StatusCode, Json<Response<UploadChunkResponse>>)> {
    // Validate chunk size (5MB limit)
    const MAX_CHUNK_SIZE: usize = 5 * 1024 * 1024;
    if request.chunk_data.len() > MAX_CHUNK_SIZE {
        return Err(crate::pkg::error::AppError::BadRequest(
            "Chunk size exceeds 5MB limit".into()
        ));
    }

    // Get video record from database
    let video = ctx
        .repos
        .videos
        .get_video_by_upload_id_required(&request.upload_id)
        .await?;

    // Verify file key matches
    if video.file_key != request.file_key {
        return Err(crate::pkg::error::AppError::BadRequest(
            "File key mismatch".into()
        ));
    }

    // Upload chunk directly to DigitalOcean Spaces
    let part_number = request.chunk_number + 1; // AWS S3 uses 1-based part numbers
    
    let result = ctx
        .spaces_client
        .client
        .upload_part()
        .bucket(&ctx.spaces.bucket_name)
        .key(&request.file_key)
        .upload_id(&request.upload_id)
        .part_number(part_number as i32)
        .body(aws_sdk_s3::primitives::ByteStream::from(request.chunk_data))
        .send()
        .await
        .map_err(|e| crate::pkg::error::AppError::Internal(format!("Failed to upload chunk: {}", e)))?;

    let etag = result
        .e_tag()
        .ok_or_else(|| crate::pkg::error::AppError::Internal("No ETag returned".into()))?
        .to_string();

    let response = UploadChunkResponse {
        chunk_number: request.chunk_number,
        etag,
        status: "uploaded".to_string(),
    };

    let body = Response::with_data("Chunk uploaded successfully", response, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}
