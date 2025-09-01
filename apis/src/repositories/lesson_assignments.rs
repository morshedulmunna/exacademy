use crate::pkg::error::AppResult;

#[derive(Debug, Clone)]
pub struct LessonAssignmentRecord {
    pub lesson_id: uuid::Uuid,
    pub title: String,
    pub description: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Clone)]
pub struct UpsertLessonAssignmentRecord {
    pub lesson_id: uuid::Uuid,
    pub title: String,
    pub description: Option<String>,
}

#[async_trait::async_trait]
pub trait LessonAssignmentsRepository: Send + Sync {
    async fn upsert(&self, input: UpsertLessonAssignmentRecord) -> AppResult<uuid::Uuid>;
    async fn find_by_lesson(&self, lesson_id: uuid::Uuid) -> AppResult<Option<LessonAssignmentRecord>>;
    async fn delete(&self, lesson_id: uuid::Uuid) -> AppResult<()>;
}


