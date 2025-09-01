use crate::pkg::error::AppResult;
use crate::types::course_types::ModulePositionUpdate;

#[derive(Debug, Clone)]
pub struct ModuleRecord {
    pub id: uuid::Uuid,
    pub course_id: uuid::Uuid,
    pub title: String,
    pub description: Option<String>,
    pub position: i32,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Clone)]
pub struct CreateModuleRecord {
    pub course_id: uuid::Uuid,
    pub title: String,
    pub description: Option<String>,
    pub position: i32,
}

#[derive(Debug, Default, Clone)]
pub struct UpdateModuleRecord {
    pub title: Option<String>,
    pub description: Option<String>,
    pub position: Option<i32>,
}

/// Input types to create a full module with nested lessons, contents, questions, and assignment atomically.
#[derive(Debug, Clone)]
pub struct CreateLessonContentData {
    pub title: String,
    pub content_type: String,
    pub url: String,
    pub file_size: Option<i64>,
    pub filename: Option<String>,
    pub position: i32,
}

#[derive(Debug, Clone)]
pub struct CreateLessonQuestionOptionData {
    pub option_text: String,
    pub is_correct: bool,
    pub position: i32,
}

#[derive(Debug, Clone)]
pub struct CreateLessonQuestionData {
    pub question_text: String,
    pub position: i32,
    pub options: Vec<CreateLessonQuestionOptionData>,
}

#[derive(Debug, Clone)]
pub struct CreateLessonAssignmentData {
    pub title: String,
    pub description: Option<String>,
}

#[derive(Debug, Clone)]
pub struct CreateLessonDeepData {
    pub title: String,
    pub description: Option<String>,
    pub content: Option<String>,
    pub video_url: Option<String>,
    pub duration: String,
    pub position: i32,
    pub is_free: bool,
    pub published: bool,
    pub contents: Vec<CreateLessonContentData>,
    pub questions: Vec<CreateLessonQuestionData>,
    pub assignment: Option<CreateLessonAssignmentData>,
}

#[derive(Debug, Clone)]
pub struct CreateModuleDeepRecord {
    pub course_id: uuid::Uuid,
    pub title: String,
    pub description: Option<String>,
    pub position: i32,
    pub lessons: Vec<CreateLessonDeepData>,
}

/// Fully materialized lesson with nested relations returned from a deep create
#[derive(Debug, Clone)]
pub struct LessonDeepRecord {
    pub lesson: crate::repositories::lessons::LessonRecord,
    pub contents: Vec<crate::repositories::lesson_contents::LessonContentRecord>,
    pub questions: Vec<(
        crate::repositories::lesson_questions::LessonQuestionRecord,
        Vec<crate::repositories::lesson_questions::QuestionOptionRecord>,
    )>,
    pub assignment: Option<crate::repositories::lesson_assignments::LessonAssignmentRecord>,
}

/// Fully materialized module with lessons and all nested lesson relations
#[derive(Debug, Clone)]
pub struct ModuleDeepRecord {
    pub module: ModuleRecord,
    pub lessons: Vec<LessonDeepRecord>,
}

#[async_trait::async_trait]
pub trait ModulesRepository: Send + Sync {
    async fn create(&self, input: CreateModuleRecord) -> AppResult<uuid::Uuid>;
    async fn find_by_id(&self, id: uuid::Uuid) -> AppResult<Option<ModuleRecord>>;
    async fn list_by_course(&self, course_id: uuid::Uuid) -> AppResult<Vec<ModuleRecord>>;
    async fn update_partial(
        &self,
        id: uuid::Uuid,
        input: UpdateModuleRecord,
    ) -> AppResult<Option<ModuleRecord>>;
    async fn delete_by_id(&self, id: uuid::Uuid) -> AppResult<()>;

    /// Bulk update module positions for a course
    async fn bulk_update_positions(
        &self,
        course_id: uuid::Uuid,
        modules: Vec<ModulePositionUpdate>,
    ) -> AppResult<Vec<ModuleRecord>>;

    /// Create a module and all of its nested lessons (plus lesson contents, questions/options,
    /// and optional assignment) within a single ACID transaction, returning the full created graph.
    async fn create_deep(&self, input: CreateModuleDeepRecord) -> AppResult<ModuleDeepRecord>;

    /// List all modules for a course with their nested lessons, contents, questions, and assignments.
    async fn list_by_course_deep(&self, course_id: uuid::Uuid) -> AppResult<Vec<ModuleDeepRecord>>;
}
