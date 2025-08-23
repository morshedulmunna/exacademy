use crate::pkg::error::AppResult;

/// Domain model for a course as persisted in the database layer
#[derive(Debug, Clone)]
pub struct CourseRecord {
    pub id: uuid::Uuid,
    pub slug: String,
    pub title: String,
    pub description: String,
    pub excerpt: Option<String>,
    pub thumbnail: Option<String>,
    pub price: f64,
    pub original_price: Option<f64>,
    pub duration: String,
    pub lessons: i32,
    pub students: i32,
    pub published: bool,
    pub featured: bool,
    pub view_count: i32,
    pub instructor_id: Option<uuid::Uuid>,
    pub published_at: Option<chrono::DateTime<chrono::Utc>>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Clone)]
pub struct CreateCourseRecord {
    pub slug: String,
    pub title: String,
    pub description: String,
    pub excerpt: Option<String>,
    pub thumbnail: Option<String>,
    pub price: f64,
    pub original_price: Option<f64>,
    pub duration: String,
    pub lessons: i32,
    pub featured: bool,
    pub instructor_id: Option<uuid::Uuid>,
}

#[derive(Debug, Default, Clone)]
pub struct UpdateCourseRecord {
    pub title: Option<String>,
    pub description: Option<String>,
    pub excerpt: Option<String>,
    pub thumbnail: Option<String>,
    pub price: Option<f64>,
    pub original_price: Option<f64>,
    pub duration: Option<String>,
    pub lessons: Option<i32>,
    pub students: Option<i32>,
    pub published: Option<bool>,
    pub featured: Option<bool>,
}

#[async_trait::async_trait]
pub trait CoursesRepository: Send + Sync {
    async fn create(&self, input: CreateCourseRecord) -> AppResult<uuid::Uuid>;
    async fn list_all(&self) -> AppResult<Vec<CourseRecord>>;
    async fn find_by_id(&self, id: uuid::Uuid) -> AppResult<Option<CourseRecord>>;
    async fn find_by_slug(&self, slug: &str) -> AppResult<Option<CourseRecord>>;
    async fn update_partial(
        &self,
        id: uuid::Uuid,
        input: UpdateCourseRecord,
    ) -> AppResult<Option<CourseRecord>>;
    async fn delete_by_id(&self, id: uuid::Uuid) -> AppResult<()>;
}
