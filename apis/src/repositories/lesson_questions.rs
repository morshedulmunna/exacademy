use crate::pkg::error::AppResult;

#[derive(Debug, Clone)]
pub struct LessonQuestionRecord {
    pub id: uuid::Uuid,
    pub lesson_id: uuid::Uuid,
    pub question_text: String,
    pub position: i32,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Clone)]
pub struct CreateLessonQuestionRecord {
    pub lesson_id: uuid::Uuid,
    pub question_text: String,
    pub position: i32,
}

#[derive(Debug, Default, Clone)]
pub struct UpdateLessonQuestionRecord {
    pub question_text: Option<String>,
    pub position: Option<i32>,
}

#[derive(Debug, Clone)]
pub struct QuestionOptionRecord {
    pub id: uuid::Uuid,
    pub question_id: uuid::Uuid,
    pub option_text: String,
    pub is_correct: bool,
    pub position: i32,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Clone)]
pub struct CreateQuestionOptionRecord {
    pub question_id: uuid::Uuid,
    pub option_text: String,
    pub is_correct: bool,
    pub position: i32,
}

#[derive(Debug, Default, Clone)]
pub struct UpdateQuestionOptionRecord {
    pub option_text: Option<String>,
    pub is_correct: Option<bool>,
    pub position: Option<i32>,
}

#[async_trait::async_trait]
pub trait LessonQuestionsRepository: Send + Sync {
    async fn create_question(&self, input: CreateLessonQuestionRecord) -> AppResult<uuid::Uuid>;
    async fn list_questions(&self, lesson_id: uuid::Uuid) -> AppResult<Vec<LessonQuestionRecord>>;
    async fn update_question(
        &self,
        id: uuid::Uuid,
        input: UpdateLessonQuestionRecord,
    ) -> AppResult<Option<LessonQuestionRecord>>;
    async fn delete_question(&self, id: uuid::Uuid) -> AppResult<()>;

    async fn create_option(&self, input: CreateQuestionOptionRecord) -> AppResult<uuid::Uuid>;
    async fn list_options(&self, question_id: uuid::Uuid) -> AppResult<Vec<QuestionOptionRecord>>;
    async fn update_option(
        &self,
        id: uuid::Uuid,
        input: UpdateQuestionOptionRecord,
    ) -> AppResult<Option<QuestionOptionRecord>>;
    async fn delete_option(&self, id: uuid::Uuid) -> AppResult<()>;
}
