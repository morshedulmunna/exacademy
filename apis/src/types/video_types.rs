use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

/// Request to initialize a multipart video upload
#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct InitVideoUploadRequest {
    /// Original filename of the video
    #[validate(length(min = 1))]
    pub filename: String,
    /// Content type of the video (e.g., video/mp4)
    #[validate(length(min = 1))]
    pub content_type: String,
    /// Total file size in bytes
    #[validate(range(min = 1))]
    pub file_size: u64,
    /// Lesson ID this video belongs to
    pub lesson_id: Option<Uuid>,
}

/// Response from multipart upload initialization
#[derive(Debug, Serialize, ToSchema)]
pub struct InitVideoUploadResponse {
    /// Unique upload ID for this multipart upload
    pub upload_id: String,
    /// File key in the storage bucket
    pub file_key: String,
    /// Presigned URLs for each chunk
    pub chunk_urls: Vec<String>,
    /// Chunk size in bytes
    pub chunk_size: u64,
    /// Total number of chunks
    pub total_chunks: u32,
}

/// Request to complete a multipart upload
#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct CompleteVideoUploadRequest {
    /// Upload ID from initialization
    #[validate(length(min = 1))]
    pub upload_id: String,
    /// File key from initialization
    #[validate(length(min = 1))]
    pub file_key: String,
    /// ETags for each uploaded chunk
    #[validate(length(min = 1))]
    pub chunk_etags: Vec<String>,
}

/// Response from completed upload
#[derive(Debug, Serialize, ToSchema)]
pub struct CompleteVideoUploadResponse {
    /// Final video URL
    pub video_url: String,
    /// File key in storage
    pub file_key: String,
    /// Upload status
    pub status: String,
}

/// Video upload status
#[derive(Debug, Serialize, Deserialize, ToSchema, PartialEq, sqlx::Type)]
#[sqlx(type_name = "text")]
pub enum VideoUploadStatus {
    #[sqlx(rename = "pending")]
    Pending,
    #[sqlx(rename = "uploading")]
    Uploading,
    #[sqlx(rename = "completed")]
    Completed,
    #[sqlx(rename = "failed")]
    Failed,
}

/// Video record in database
#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct Video {
    pub id: Uuid,
    pub file_key: String,
    pub filename: String,
    pub content_type: String,
    pub file_size: i64,
    pub status: VideoUploadStatus,
    pub lesson_id: Option<Uuid>,
    pub upload_id: Option<String>,
    pub video_url: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

/// Chunk upload request
#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct UploadChunkRequest {
    /// Upload ID
    #[validate(length(min = 1))]
    pub upload_id: String,
    /// File key
    #[validate(length(min = 1))]
    pub file_key: String,
    /// Chunk number (0-based)
    #[validate(range(min = 0))]
    pub chunk_number: u32,
    /// Chunk data
    #[validate(length(min = 1))]
    pub chunk_data: Vec<u8>,
}

/// Chunk upload response
#[derive(Debug, Serialize, ToSchema)]
pub struct UploadChunkResponse {
    /// Chunk number
    pub chunk_number: u32,
    /// ETag for the uploaded chunk
    pub etag: String,
    /// Upload status
    pub status: String,
}

/// Request to create a new video
#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct VideoCreateRequest {
    /// File key in storage
    #[validate(length(min = 1))]
    pub file_key: String,
    /// Original filename
    #[validate(length(min = 1))]
    pub filename: String,
    /// Content type
    #[validate(length(min = 1))]
    pub content_type: String,
    /// File size in bytes
    #[validate(range(min = 1))]
    pub file_size: i64,
    /// Lesson ID this video belongs to
    pub lesson_id: Option<Uuid>,
    /// Upload ID from multipart upload
    pub upload_id: Option<String>,
    /// Video URL
    pub video_url: Option<String>,
}

/// Request to update a video
#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct VideoUpdateRequest {
    /// File key in storage
    pub file_key: Option<String>,
    /// Original filename
    pub filename: Option<String>,
    /// Content type
    pub content_type: Option<String>,
    /// File size in bytes
    pub file_size: Option<i64>,
    /// Status
    pub status: Option<VideoUploadStatus>,
    /// Lesson ID this video belongs to
    pub lesson_id: Option<Uuid>,
    /// Upload ID from multipart upload
    pub upload_id: Option<String>,
    /// Video URL
    pub video_url: Option<String>,
}
