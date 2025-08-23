use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

/// API-facing Course types. Mirrors DB but keeps HTTP contract tidy.
#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct Course {
    pub id: Uuid,
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
    pub instructor_id: Option<Uuid>,
    pub published_at: Option<chrono::DateTime<chrono::Utc>>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct CourseModule {
    pub id: Uuid,
    pub course_id: Uuid,
    pub title: String,
    pub description: Option<String>,
    pub position: i32,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct Lesson {
    pub id: Uuid,
    pub module_id: Uuid,
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

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct CreateCourseRequest {
    #[validate(length(min = 1))]
    pub slug: String,
    #[validate(length(min = 1))]
    pub title: String,
    #[validate(length(min = 1))]
    pub description: String,
    pub excerpt: Option<String>,
    #[validate(url)]
    pub thumbnail: Option<String>,
    pub price: f64,
    pub original_price: Option<f64>,
    #[validate(length(min = 1))]
    pub duration: String,
    pub lessons: i32,
    pub featured: bool,
    pub instructor_id: Option<Uuid>,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct UpdateCourseRequest {
    pub title: Option<String>,
    pub description: Option<String>,
    pub excerpt: Option<String>,
    #[validate(url)]
    pub thumbnail: Option<String>,
    pub price: Option<f64>,
    pub original_price: Option<f64>,
    pub duration: Option<String>,
    pub lessons: Option<i32>,
    pub students: Option<i32>,
    pub published: Option<bool>,
    pub featured: Option<bool>,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct CreateModuleRequest {
    pub course_id: Uuid,
    #[validate(length(min = 1))]
    pub title: String,
    pub description: Option<String>,
    pub position: i32,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct UpdateModuleRequest {
    pub title: Option<String>,
    pub description: Option<String>,
    pub position: Option<i32>,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct CreateLessonRequest {
    pub module_id: Uuid,
    #[validate(length(min = 1))]
    pub title: String,
    pub description: Option<String>,
    pub content: Option<String>,
    #[validate(url)]
    pub video_url: Option<String>,
    #[validate(length(min = 1))]
    pub duration: String,
    pub position: i32,
    pub is_free: bool,
    pub published: bool,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct UpdateLessonRequest {
    pub title: Option<String>,
    pub description: Option<String>,
    pub content: Option<String>,
    #[validate(url)]
    pub video_url: Option<String>,
    pub duration: Option<String>,
    pub position: Option<i32>,
    pub is_free: Option<bool>,
    pub published: Option<bool>,
}
