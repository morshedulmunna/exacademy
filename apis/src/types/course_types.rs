use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

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
    /// Price must be non-negative.
    #[validate(range(min = 0.0))]
    pub price: f64,
    /// Original price must be non-negative.
    #[validate(range(min = 0.0))]
    pub original_price: Option<f64>,

    #[validate(length(min = 1))]
    pub duration: String,
    pub featured: bool,
    pub status: Option<String>,
    pub outcomes: Option<Vec<String>>,
    pub category: Option<String>,
    pub tags: Option<Vec<String>>,
}

// Checking -----
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
    pub featured: bool,
    pub view_count: i32,
    pub status: String,
    pub outcomes: Option<Vec<String>>,
    pub category: Option<String>,
    pub tags: Option<Vec<String>>,
    pub instructor_id: Uuid,
    pub instructor: Option<Instructor>,
    pub published_at: Option<chrono::DateTime<chrono::Utc>>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct Instructor {
    pub id: Uuid,
    pub username: String,
    pub full_name: Option<String>,
    pub avatar_url: Option<String>,
    pub email: Option<String>,
    pub role: Option<String>,
}

/// Pagination query for list endpoints
#[derive(Debug, Deserialize, ToSchema)]
pub struct PaginationQuery {
    /// 1-based page index
    #[serde(default)]
    pub page: Option<i64>,
    /// Items per page
    #[serde(default, rename = "per_page")]
    pub per_page: Option<i64>,
}

/// Pagination metadata
#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct PageMeta {
    pub page: i64,
    #[serde(rename = "per_page")]
    pub per_page: i64,
    pub total: i64,
    #[serde(rename = "total_pages")]
    pub total_pages: i64,
}

/// Paginated list response payload
#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct Page<T>
where
    T: Serialize,
{
    pub items: Vec<T>,
    pub meta: PageMeta,
}

// ----- Categories -----

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct Category {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct CreateCategoryRequest {
    #[validate(length(min = 1))]
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct UpdateCategoryRequest {
    pub name: Option<String>,
    pub description: Option<String>,
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
    pub featured: Option<bool>,
    pub outcomes: Option<Vec<String>>,
    pub status: Option<String>,
    pub category: Option<String>,
    pub tags: Option<Vec<String>>,
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
pub struct BulkUpdateModulePositionsRequest {
    pub course_id: Uuid,
    pub modules: Vec<ModulePositionUpdate>,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct ModulePositionUpdate {
    pub id: Uuid,
    pub position: i32,
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

// ----- Lesson Contents -----

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct LessonContent {
    pub id: Uuid,
    pub lesson_id: Uuid,
    pub title: String,
    pub content_type: String,
    pub url: String,
    pub file_size: Option<i64>,
    pub filename: Option<String>,
    pub position: i32,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct CreateLessonContentRequest {
    pub lesson_id: Uuid,
    #[validate(length(min = 1))]
    pub title: String,
    #[validate(length(min = 1))]
    pub content_type: String,
    #[validate(length(min = 1))]
    pub url: String,
    pub file_size: Option<i64>,
    pub filename: Option<String>,
    pub position: i32,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct UpdateLessonContentRequest {
    pub title: Option<String>,
    pub content_type: Option<String>,
    pub url: Option<String>,
    pub file_size: Option<i64>,
    pub filename: Option<String>,
    pub position: Option<i32>,
}

// ----- Lesson Questions / Options -----

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct LessonQuestion {
    pub id: Uuid,
    pub lesson_id: Uuid,
    pub question_text: String,
    pub position: i32,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct CreateLessonQuestionRequest {
    pub lesson_id: Uuid,
    #[validate(length(min = 1))]
    pub question_text: String,
    pub position: i32,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct UpdateLessonQuestionRequest {
    pub question_text: Option<String>,
    pub position: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct QuestionOption {
    pub id: Uuid,
    pub question_id: Uuid,
    pub option_text: String,
    pub is_correct: bool,
    pub position: i32,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct CreateQuestionOptionRequest {
    pub question_id: Uuid,
    #[validate(length(min = 1))]
    pub option_text: String,
    pub is_correct: bool,
    pub position: i32,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct UpdateQuestionOptionRequest {
    pub option_text: Option<String>,
    pub is_correct: Option<bool>,
    pub position: Option<i32>,
}

// ----- Lesson Assignment -----

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct LessonAssignment {
    pub lesson_id: Uuid,
    pub title: String,
    pub description: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct UpsertLessonAssignmentRequest {
    pub lesson_id: Uuid,
    #[validate(length(min = 1))]
    pub title: String,
    pub description: Option<String>,
}

// ----- Deep Create Module (with Lessons, Contents, Questions, Assignment) -----

#[derive(Debug, Serialize, Deserialize, ToSchema, Validate)]
pub struct CreateLessonContentInput {
    #[validate(length(min = 1))]
    pub title: String,
    #[validate(length(min = 1))]
    pub content_type: String,
    #[validate(length(min = 1))]
    pub url: String,
    pub file_size: Option<i64>,
    pub filename: Option<String>,
    pub position: i32,
}

#[derive(Debug, Serialize, Deserialize, ToSchema, Validate)]
pub struct CreateQuestionOptionInput {
    #[validate(length(min = 1))]
    pub option_text: String,
    pub is_correct: bool,
    pub position: i32,
}

#[derive(Debug, Serialize, Deserialize, ToSchema, Validate)]
pub struct CreateLessonQuestionInput {
    #[validate(length(min = 1))]
    pub question_text: String,
    pub position: i32,
    #[validate(length(min = 1))]
    pub options: Vec<CreateQuestionOptionInput>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema, Validate)]
pub struct CreateLessonAssignmentInput {
    #[validate(length(min = 1))]
    pub title: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema, Validate)]
pub struct CreateLessonDeepRequest {
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
    #[validate(length(min = 0))]
    pub contents: Vec<CreateLessonContentInput>,
    #[validate(length(min = 0))]
    pub questions: Vec<CreateLessonQuestionInput>,
    pub assignment: Option<CreateLessonAssignmentInput>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema, Validate)]
pub struct CreateModuleDeepRequest {
    #[validate(length(min = 1))]
    pub title: String,
    pub description: Option<String>,
    pub position: i32,
    #[validate(length(min = 0))]
    pub lessons: Vec<CreateLessonDeepRequest>,
}

// Response shapes for deep-created payload

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct QuestionWithOptions {
    pub question: LessonQuestion,
    pub options: Vec<QuestionOption>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct LessonDeep {
    pub lesson: Lesson,
    pub contents: Vec<LessonContent>,
    pub questions: Vec<QuestionWithOptions>,
    pub assignment: Option<LessonAssignment>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct ModuleDeep {
    pub module: CourseModule,
    pub lessons: Vec<LessonDeep>,
}
