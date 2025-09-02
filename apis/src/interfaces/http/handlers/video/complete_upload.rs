use axum::{Extension, Json, http::StatusCode};
use std::sync::Arc;

use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::auth::AuthUser;
use crate::pkg::error::AppResult;
use crate::types::video_types::{
    CompleteVideoUploadRequest, CompleteVideoUploadResponse, VideoUploadStatus,
};

/// Complete a multipart video upload
#[utoipa::path(
    post,
    path = "/api/video/upload/complete",
    request_body = CompleteVideoUploadRequest,
    responses((status = 200, description = "Upload completed successfully", body = CompleteVideoUploadResponse)),
    tag = "Video Upload",
    security(("bearer_auth" = []))
)]
pub async fn complete_video_upload(
    Extension(ctx): Extension<Arc<AppContext>>,
    _auth_user: AuthUser,
    Json(request): Json<CompleteVideoUploadRequest>,
) -> AppResult<(StatusCode, Json<Response<CompleteVideoUploadResponse>>)> {
    // Get video record from database
    let video = ctx
        .repos
        .videos
        .get_video_by_upload_id_required(&request.upload_id)
        .await?;

    // Verify file key matches
    if video.file_key != request.file_key {
        return Err(crate::pkg::error::AppError::BadRequest(
            "File key mismatch".into(),
        ));
    }

    // Debug: Log the ETags being sent
    println!("Completing multipart upload:");
    println!("  File key: {}", request.file_key);
    println!("  Upload ID: {}", request.upload_id);
    println!("  Chunk ETags: {:?}", request.chunk_etags);

    // Complete the multipart upload
    let _result = ctx
        .spaces_client
        .complete_multipart_upload(&request.file_key, &request.upload_id, request.chunk_etags)
        .await?;

    // Get the final video URL
    let video_url = ctx.spaces_client.get_public_url(&request.file_key);

    // Update video status to completed
    let _updated_video = ctx
        .repos
        .videos
        .update_video_status(video.id, VideoUploadStatus::Completed, Some(&video_url))
        .await?;

    // If this video is associated with a lesson, update the lesson's video_url
    if let Some(lesson_id) = video.lesson_id {
        // Update lesson with video URL
        let update_record = crate::repositories::lessons::UpdateLessonRecord {
            title: None,
            description: None,
            content: None,
            video_url: Some(video_url.clone()),
            duration: None,
            position: None,
            is_free: None,
            published: None,
        };

        ctx.repos
            .lessons
            .update_partial(lesson_id, update_record)
            .await?;
    }

    let response = CompleteVideoUploadResponse {
        video_url,
        file_key: request.file_key,
        status: "completed".to_string(),
    };

    let body = Response::with_data(
        "Video upload completed successfully",
        response,
        StatusCode::OK.as_u16(),
    );
    Ok((StatusCode::OK, Json(body)))
}
