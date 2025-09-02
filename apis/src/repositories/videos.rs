use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

use crate::pkg::error::AppError;
use crate::types::video_types::{Video, VideoUploadStatus};

/// Repository for video upload operations
pub struct VideoRepository {
    pool: PgPool,
}

impl VideoRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    /// Create a new video record with individual parameters
    pub async fn create_video_with_params(
        &self,
        file_key: &str,
        filename: &str,
        content_type: &str,
        file_size: i64,
        lesson_id: Option<Uuid>,
        upload_id: Option<&str>,
    ) -> Result<Video, AppError> {
        let id = Uuid::new_v4();
        let now = Utc::now();

        let video = sqlx::query_as!(
            Video,
            r#"
            INSERT INTO videos (id, file_key, filename, content_type, file_size, status, lesson_id, upload_id, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, file_key, filename, content_type, file_size, status as "status: VideoUploadStatus", lesson_id, upload_id, video_url, created_at, updated_at
            "#,
            id,
            file_key,
            filename,
            content_type,
            file_size,
            "pending",
            lesson_id,
            upload_id,
            now,
        )
        .fetch_one(&self.pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to create video: {}", e)))?;

        Ok(video)
    }

    /// Get video by ID
    pub async fn get_video_by_id(&self, id: Uuid) -> Result<Option<Video>, AppError> {
        let video = sqlx::query_as!(
            Video,
            r#"
            SELECT id, file_key, filename, content_type, file_size, status as "status: VideoUploadStatus", lesson_id, upload_id, video_url, created_at, updated_at
            FROM videos
            WHERE id = $1
            "#,
            id,
        )
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to get video: {}", e)))?;

        Ok(video)
    }

    /// Get video by upload ID
    pub async fn get_video_by_upload_id(&self, upload_id: &str) -> Result<Option<Video>, AppError> {
        let video = sqlx::query_as!(
            Video,
            r#"
            SELECT id, file_key, filename, content_type, file_size, status as "status: VideoUploadStatus", lesson_id, upload_id, video_url, created_at, updated_at
            FROM videos
            WHERE upload_id = $1
            "#,
            upload_id,
        )
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to get video by upload ID: {}", e)))?;

        Ok(video)
    }

    /// Update video status
    pub async fn update_video_status(
        &self,
        id: Uuid,
        status: VideoUploadStatus,
        video_url: Option<&str>,
    ) -> Result<Video, AppError> {
        let now = Utc::now();

        let video = sqlx::query_as!(
            Video,
            r#"
            UPDATE videos
            SET status = $2, video_url = $3, updated_at = $4
            WHERE id = $1
            RETURNING id, file_key, filename, content_type, file_size, status as "status: VideoUploadStatus", lesson_id, upload_id, video_url, created_at, updated_at
            "#,
            id,
            match status {
                VideoUploadStatus::Pending => "pending",
                VideoUploadStatus::Uploading => "uploading", 
                VideoUploadStatus::Completed => "completed",
                VideoUploadStatus::Failed => "failed",
            },
            video_url,
            now,
        )
        .fetch_one(&self.pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to update video status: {}", e)))?;

        Ok(video)
    }

    /// Get videos by lesson ID
    pub async fn get_videos_by_lesson_id(&self, lesson_id: Uuid) -> Result<Vec<Video>, AppError> {
        let videos = sqlx::query_as!(
            Video,
            r#"
            SELECT id, file_key, filename, content_type, file_size, status as "status: VideoUploadStatus", lesson_id, upload_id, video_url, created_at, updated_at
            FROM videos
            WHERE lesson_id = $1
            ORDER BY created_at DESC
            "#,
            lesson_id,
        )
        .fetch_all(&self.pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to get videos by lesson ID: {}", e)))?;

        Ok(videos)
    }

    /// Delete video by ID
    pub async fn delete_video(&self, id: Uuid) -> Result<(), AppError> {
        sqlx::query!("DELETE FROM videos WHERE id = $1", id,)
            .execute(&self.pool)
            .await
            .map_err(|e| AppError::Internal(format!("Failed to delete video: {}", e)))?;

        Ok(())
    }

    /// Create a new video record with VideoCreateRequest
    pub async fn create_video(
        &self,
        request: crate::types::video_types::VideoCreateRequest,
    ) -> Result<Video, AppError> {
        self.create_video_with_params(
            &request.file_key,
            &request.filename,
            &request.content_type,
            request.file_size,
            request.lesson_id,
            request.upload_id.as_deref(),
        )
        .await
    }

    /// Get video by ID (returns error if not found)
    pub async fn get_video(&self, id: Uuid) -> Result<Video, AppError> {
        let video = self.get_video_by_id(id).await?;
        video.ok_or_else(|| AppError::NotFound("Video not found".to_string()))
    }

    /// Get video by upload ID (returns error if not found)
    pub async fn get_video_by_upload_id_required(
        &self,
        upload_id: &str,
    ) -> Result<Video, AppError> {
        let video = self.get_video_by_upload_id(upload_id).await?;
        video.ok_or_else(|| AppError::NotFound("Video not found".to_string()))
    }

    /// Update a video with VideoUpdateRequest
    pub async fn update_video(
        &self,
        id: Uuid,
        request: crate::types::video_types::VideoUpdateRequest,
    ) -> Result<Video, AppError> {
        let now = Utc::now();

        let video = sqlx::query_as!(
            Video,
            r#"
            UPDATE videos 
            SET 
                file_key = COALESCE($2, file_key),
                filename = COALESCE($3, filename),
                content_type = COALESCE($4, content_type),
                file_size = COALESCE($5, file_size),
                status = COALESCE($6, status),
                lesson_id = $7,
                upload_id = COALESCE($8, upload_id),
                video_url = COALESCE($9, video_url),
                updated_at = $10
            WHERE id = $1
            RETURNING id, file_key, filename, content_type, file_size, status as "status: VideoUploadStatus", lesson_id, upload_id, video_url, created_at, updated_at
            "#,
            id,
            request.file_key,
            request.filename,
            request.content_type,
            request.file_size,
            request.status.as_ref().map(|s| match s {
                VideoUploadStatus::Pending => "pending",
                VideoUploadStatus::Uploading => "uploading", 
                VideoUploadStatus::Completed => "completed",
                VideoUploadStatus::Failed => "failed",
            }),
            request.lesson_id,
            request.upload_id,
            request.video_url,
            now,
        )
        .fetch_one(&self.pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to update video: {}", e)))?;

        Ok(video)
    }

    /// List videos by lesson ID
    pub async fn list_videos_by_lesson(&self, lesson_id: Uuid) -> Result<Vec<Video>, AppError> {
        self.get_videos_by_lesson_id(lesson_id).await
    }
}
