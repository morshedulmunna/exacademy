use crate::pkg::error::AppResult;

#[derive(Debug, Clone)]
pub struct CourseCategoryLinkRecord {
    pub course_id: uuid::Uuid,
    pub category_id: i32,
}

#[async_trait::async_trait]
pub trait CourseCategoriesRepository: Send + Sync {
    async fn attach(&self, course_id: uuid::Uuid, category_id: i32) -> AppResult<()>;
    async fn detach(&self, course_id: uuid::Uuid, category_id: i32) -> AppResult<()>;
    async fn list_categories_for_course(&self, course_id: uuid::Uuid) -> AppResult<Vec<i32>>;
    async fn list_courses_for_category(&self, category_id: i32) -> AppResult<Vec<uuid::Uuid>>;
}
