use crate::pkg::error::AppResult;
use crate::repositories::lesson_questions::{CreateLessonQuestionRecord, CreateQuestionOptionRecord, LessonQuestionRecord, LessonQuestionsRepository, QuestionOptionRecord, UpdateLessonQuestionRecord, UpdateQuestionOptionRecord};
use crate::types::course_types::{CreateLessonQuestionRequest, CreateQuestionOptionRequest, LessonQuestion, QuestionOption, UpdateLessonQuestionRequest, UpdateQuestionOptionRequest};

// Questions
pub async fn create_question(repo: &dyn LessonQuestionsRepository, input: CreateLessonQuestionRequest) -> AppResult<uuid::Uuid> {
    repo
        .create_question(CreateLessonQuestionRecord {
            lesson_id: input.lesson_id,
            question_text: input.question_text,
            position: input.position,
        })
        .await
}

pub async fn list_questions(repo: &dyn LessonQuestionsRepository, lesson_id: uuid::Uuid) -> AppResult<Vec<LessonQuestion>> {
    let rows = repo.list_questions(lesson_id).await?;
    Ok(rows.into_iter().map(map_question).collect())
}

pub async fn update_question(repo: &dyn LessonQuestionsRepository, id: uuid::Uuid, input: UpdateLessonQuestionRequest) -> AppResult<Option<LessonQuestion>> {
    let row = repo
        .update_question(
            id,
            UpdateLessonQuestionRecord {
                question_text: input.question_text,
                position: input.position,
            },
        )
        .await?;
    Ok(row.map(map_question))
}

pub async fn delete_question(repo: &dyn LessonQuestionsRepository, id: uuid::Uuid) -> AppResult<()> {
    repo.delete_question(id).await
}

// Options
pub async fn create_option(repo: &dyn LessonQuestionsRepository, input: CreateQuestionOptionRequest) -> AppResult<uuid::Uuid> {
    repo
        .create_option(CreateQuestionOptionRecord {
            question_id: input.question_id,
            option_text: input.option_text,
            is_correct: input.is_correct,
            position: input.position,
        })
        .await
}

pub async fn list_options(repo: &dyn LessonQuestionsRepository, question_id: uuid::Uuid) -> AppResult<Vec<QuestionOption>> {
    let rows = repo.list_options(question_id).await?;
    Ok(rows.into_iter().map(map_option).collect())
}

pub async fn update_option(repo: &dyn LessonQuestionsRepository, id: uuid::Uuid, input: UpdateQuestionOptionRequest) -> AppResult<Option<QuestionOption>> {
    let row = repo
        .update_option(
            id,
            UpdateQuestionOptionRecord {
                option_text: input.option_text,
                is_correct: input.is_correct,
                position: input.position,
            },
        )
        .await?;
    Ok(row.map(map_option))
}

pub async fn delete_option(repo: &dyn LessonQuestionsRepository, id: uuid::Uuid) -> AppResult<()> {
    repo.delete_option(id).await
}

fn map_question(r: LessonQuestionRecord) -> LessonQuestion {
    LessonQuestion {
        id: r.id,
        lesson_id: r.lesson_id,
        question_text: r.question_text,
        position: r.position,
        created_at: r.created_at,
        updated_at: r.updated_at,
    }
}

fn map_option(r: QuestionOptionRecord) -> QuestionOption {
    QuestionOption {
        id: r.id,
        question_id: r.question_id,
        option_text: r.option_text,
        is_correct: r.is_correct,
        position: r.position,
        created_at: r.created_at,
        updated_at: r.updated_at,
    }
}


