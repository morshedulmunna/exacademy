use crate::pkg::error::AppResult;

#[derive(Debug, Clone)]
pub struct LessonRecord {
    pub id: uuid::Uuid,
    pub module_id: uuid::Uuid,
    pub title: String,
    pub description: Option<String>,
    pub content: Option<String>,
    pub video_url: Option<String>,
    pub duration: String,
    pub position: i32,
    pub is_free: bool,
    pub published: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Clone)]
pub struct CreateLessonRecord {
    pub module_id: uuid::Uuid,
    pub title: String,
    pub description: Option<String>,
    pub content: Option<String>,
    pub video_url: Option<String>,
    pub duration: String,
    pub position: i32,
    pub is_free: bool,
    pub published: bool,
}

#[derive(Debug, Default, Clone)]
pub struct UpdateLessonRecord {
    pub title: Option<String>,
    pub description: Option<String>,
    pub content: Option<String>,
    pub video_url: Option<String>,
    pub duration: Option<String>,
    pub position: Option<i32>,
    pub is_free: Option<bool>,
    pub published: Option<bool>,
}

#[async_trait::async_trait]
pub trait LessonsRepository: Send + Sync {
    async fn create(&self, input: CreateLessonRecord) -> AppResult<uuid::Uuid>;
    async fn find_by_id(&self, id: uuid::Uuid) -> AppResult<Option<LessonRecord>>;
    async fn list_by_module(&self, module_id: uuid::Uuid) -> AppResult<Vec<LessonRecord>>;
    async fn update_partial(
        &self,
        id: uuid::Uuid,
        input: UpdateLessonRecord,
    ) -> AppResult<Option<LessonRecord>>;
    async fn delete_by_id(&self, id: uuid::Uuid) -> AppResult<()>;
}


