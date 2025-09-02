use crate::{
    pkg::error::AppError,
    repositories::Repositories,
    types::video_types::{Video, VideoCreateRequest, VideoUpdateRequest},
};
use uuid::Uuid;

/// Video application service for business logic
pub struct VideoService {
    repos: Repositories,
}

impl VideoService {
    pub fn new(repos: Repositories) -> Self {
        Self { repos }
    }

    /// Create a new video record
    pub async fn create_video(&self, request: VideoCreateRequest) -> Result<Video, AppError> {
        self.repos.videos.create_video(request).await
    }

    /// Get video by ID
    pub async fn get_video(&self, id: Uuid) -> Result<Video, AppError> {
        self.repos.videos.get_video(id).await
    }

    /// Update video
    pub async fn update_video(&self, id: Uuid, request: VideoUpdateRequest) -> Result<Video, AppError> {
        self.repos.videos.update_video(id, request).await
    }

    /// Delete video
    pub async fn delete_video(&self, id: Uuid) -> Result<(), AppError> {
        self.repos.videos.delete_video(id).await
    }

    /// Get videos by lesson ID
    pub async fn get_videos_by_lesson(&self, lesson_id: Uuid) -> Result<Vec<Video>, AppError> {
        self.repos.videos.list_videos_by_lesson(lesson_id).await
    }
}