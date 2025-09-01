use sqlx::Row;

use crate::pkg::error::{AppError, AppResult};
use crate::repositories::lesson_questions::{
    CreateLessonQuestionRecord, CreateQuestionOptionRecord, LessonQuestionRecord,
    LessonQuestionsRepository, QuestionOptionRecord, UpdateLessonQuestionRecord,
    UpdateQuestionOptionRecord,
};

pub struct PostgresLessonQuestionsRepository {
    pub pool: sqlx::Pool<sqlx::Postgres>,
}

#[async_trait::async_trait]
impl LessonQuestionsRepository for PostgresLessonQuestionsRepository {
    async fn create_question(&self, input: CreateLessonQuestionRecord) -> AppResult<uuid::Uuid> {
        let rec = sqlx::query(
            r#"INSERT INTO lesson_questions (
                    lesson_id, question_text, position
                ) VALUES (
                    $1,$2,$3
                ) RETURNING id"#,
        )
        .bind(input.lesson_id)
        .bind(&input.question_text)
        .bind(input.position)
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(rec.get("id"))
    }

    async fn list_questions(&self, lesson_id: uuid::Uuid) -> AppResult<Vec<LessonQuestionRecord>> {
        let rows = sqlx::query(
            r#"SELECT id, lesson_id, question_text, position, created_at, updated_at
               FROM lesson_questions WHERE lesson_id = $1 ORDER BY position ASC, created_at ASC"#,
        )
        .bind(lesson_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(rows.into_iter().map(map_question_row).collect())
    }

    async fn update_question(
        &self,
        id: uuid::Uuid,
        input: UpdateLessonQuestionRecord,
    ) -> AppResult<Option<LessonQuestionRecord>> {
        let row = sqlx::query(
            r#"UPDATE lesson_questions SET
                    question_text = COALESCE($1, question_text),
                    position = COALESCE($2, position)
               WHERE id = $3
               RETURNING id, lesson_id, question_text, position, created_at, updated_at"#,
        )
        .bind(input.question_text)
        .bind(input.position)
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(row.map(map_question_row))
    }

    async fn delete_question(&self, id: uuid::Uuid) -> AppResult<()> {
        sqlx::query(r#"DELETE FROM lesson_questions WHERE id = $1"#)
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(AppError::from)?;
        Ok(())
    }

    async fn create_option(&self, input: CreateQuestionOptionRecord) -> AppResult<uuid::Uuid> {
        let rec = sqlx::query(
            r#"INSERT INTO question_options (
                    question_id, option_text, is_correct, position
                ) VALUES (
                    $1,$2,$3,$4
                ) RETURNING id"#,
        )
        .bind(input.question_id)
        .bind(&input.option_text)
        .bind(input.is_correct)
        .bind(input.position)
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(rec.get("id"))
    }

    async fn list_options(&self, question_id: uuid::Uuid) -> AppResult<Vec<QuestionOptionRecord>> {
        let rows = sqlx::query(
            r#"SELECT id, question_id, option_text, is_correct, position, created_at, updated_at
               FROM question_options WHERE question_id = $1 ORDER BY position ASC, created_at ASC"#,
        )
        .bind(question_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(rows.into_iter().map(map_option_row).collect())
    }

    async fn update_option(
        &self,
        id: uuid::Uuid,
        input: UpdateQuestionOptionRecord,
    ) -> AppResult<Option<QuestionOptionRecord>> {
        let row = sqlx::query(
            r#"UPDATE question_options SET
                    option_text = COALESCE($1, option_text),
                    is_correct = COALESCE($2, is_correct),
                    position = COALESCE($3, position)
               WHERE id = $4
               RETURNING id, question_id, option_text, is_correct, position, created_at, updated_at"#,
        )
        .bind(input.option_text)
        .bind(input.is_correct)
        .bind(input.position)
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(row.map(map_option_row))
    }

    async fn delete_option(&self, id: uuid::Uuid) -> AppResult<()> {
        sqlx::query(r#"DELETE FROM question_options WHERE id = $1"#)
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(AppError::from)?;
        Ok(())
    }
}

fn map_question_row(row: sqlx::postgres::PgRow) -> LessonQuestionRecord {
    LessonQuestionRecord {
        id: row.get("id"),
        lesson_id: row.get("lesson_id"),
        question_text: row.get("question_text"),
        position: row.get("position"),
        created_at: row.get("created_at"),
        updated_at: row.try_get("updated_at").ok(),
    }
}

fn map_option_row(row: sqlx::postgres::PgRow) -> QuestionOptionRecord {
    QuestionOptionRecord {
        id: row.get("id"),
        question_id: row.get("question_id"),
        option_text: row.get("option_text"),
        is_correct: row.get("is_correct"),
        position: row.get("position"),
        created_at: row.get("created_at"),
        updated_at: row.try_get("updated_at").ok(),
    }
}
