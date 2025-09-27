use crate::pkg::error::AppResult;

/// Summary of an instructor joined from users table for embedding in course records
#[derive(Debug, Clone)]
pub struct InstructorSummary {
    pub id: uuid::Uuid,
    pub username: String,
    pub full_name: Option<String>,
    pub avatar_url: Option<String>,
    pub email: Option<String>,
    pub role: Option<String>,
}

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
    pub featured: bool,
    pub view_count: i32,
    pub status: String,
    pub outcomes: Option<Vec<String>>,
    pub category: Option<String>,
    pub tags: Option<Vec<String>>,
    /// Instructor foreign key (required)
    pub instructor_id: uuid::Uuid,
    pub instructor: Option<InstructorSummary>,
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
    pub featured: bool,
    pub status: Option<String>,
    pub instructor_id: uuid::Uuid,
    pub outcomes: Option<Vec<String>>,
    pub category: Option<String>,
    pub tags: Option<Vec<String>>,
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
    pub status: Option<String>,
    pub featured: Option<bool>,
    pub outcomes: Option<Vec<String>>,
    pub category: Option<String>,
    pub tags: Option<Vec<String>>,
}

#[async_trait::async_trait]
pub trait CoursesRepository: Send + Sync {
    // create course
    async fn create(&self, input: CreateCourseRecord) -> AppResult<String>;

    /// List courses created by a specific instructor with pagination; returns (items, total)
    async fn list_by_instructor_paginated(
        &self,
        instructor_id: uuid::Uuid,
        offset: i64,
        limit: i64,
    ) -> AppResult<(Vec<CourseRecord>, i64)>;

    async fn list_all(&self, offset: i64, limit: i64) -> AppResult<Vec<CourseRecord>>;

    /// Return a page of courses and the total count for pagination
    async fn find_by_id(&self, id: uuid::Uuid) -> AppResult<Option<CourseRecord>>;

    // find course by slug
    async fn find_by_slug(&self, slug: &str) -> AppResult<Option<CourseRecord>>;

    // update course partially by id
    async fn update_partial(
        &self,
        id: uuid::Uuid,
        input: UpdateCourseRecord,
    ) -> AppResult<Option<CourseRecord>>;

    // delete course by id
    async fn delete_by_id(&self, id: uuid::Uuid) -> AppResult<()>;
}
