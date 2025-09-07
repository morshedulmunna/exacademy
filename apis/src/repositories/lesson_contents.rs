use crate::pkg::error::AppResult;

/// Persisted record for lesson content resources (e.g., files or external links)
#[derive(Debug, Clone)]
pub struct LessonContentRecord {
    pub id: uuid::Uuid,
    pub lesson_id: uuid::Uuid,
    pub title: String,
    pub content_type: String,
    pub url: String,
    pub file_size: Option<i64>,
    pub filename: Option<String>,
    pub position: i32,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

/// Payload to create a new lesson content row
#[derive(Debug, Clone)]
pub struct CreateLessonContentRecord {
    pub lesson_id: uuid::Uuid,
    pub title: String,
    pub content_type: String,
    pub url: String,
    pub file_size: Option<i64>,
    pub filename: Option<String>,
    pub position: i32,
}

/// Partial update for a lesson content row
#[derive(Debug, Default, Clone)]
pub struct UpdateLessonContentRecord {
    pub title: Option<String>,
    pub content_type: Option<String>,
    pub url: Option<String>,
    pub file_size: Option<i64>,
    pub filename: Option<String>,
    pub position: Option<i32>,
}

#[async_trait::async_trait]
pub trait LessonContentsRepository: Send + Sync {
    async fn create(&self, input: CreateLessonContentRecord) -> AppResult<uuid::Uuid>;
    async fn list_by_lesson(&self, lesson_id: uuid::Uuid) -> AppResult<Vec<LessonContentRecord>>;
    async fn update_partial(
        &self,
        id: uuid::Uuid,
        input: UpdateLessonContentRecord,
    ) -> AppResult<Option<LessonContentRecord>>;
    async fn delete_by_id(&self, id: uuid::Uuid) -> AppResult<()>;
}
