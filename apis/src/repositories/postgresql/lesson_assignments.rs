use sqlx::Row;

use crate::pkg::error::{AppError, AppResult};
use crate::repositories::lesson_assignments::{
    LessonAssignmentRecord, LessonAssignmentsRepository, UpsertLessonAssignmentRecord,
};

pub struct PostgresLessonAssignmentsRepository {
    pub pool: sqlx::Pool<sqlx::Postgres>,
}

#[async_trait::async_trait]
impl LessonAssignmentsRepository for PostgresLessonAssignmentsRepository {
    async fn upsert(&self, input: UpsertLessonAssignmentRecord) -> AppResult<uuid::Uuid> {
        let rec = sqlx::query(
            r#"INSERT INTO lesson_assignments (lesson_id, title, description)
                VALUES ($1,$2,$3)
                ON CONFLICT (lesson_id) DO UPDATE SET
                    title = EXCLUDED.title,
                    description = EXCLUDED.description
                RETURNING lesson_id"#,
        )
        .bind(input.lesson_id)
        .bind(&input.title)
        .bind(&input.description)
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(rec.get("lesson_id"))
    }

    async fn find_by_lesson(
        &self,
        lesson_id: uuid::Uuid,
    ) -> AppResult<Option<LessonAssignmentRecord>> {
        let row = sqlx::query(
            r#"SELECT lesson_id, title, description, created_at, updated_at
               FROM lesson_assignments WHERE lesson_id = $1"#,
        )
        .bind(lesson_id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(row.map(map_row))
    }

    async fn delete(&self, lesson_id: uuid::Uuid) -> AppResult<()> {
        sqlx::query(r#"DELETE FROM lesson_assignments WHERE lesson_id = $1"#)
            .bind(lesson_id)
            .execute(&self.pool)
            .await
            .map_err(AppError::from)?;
        Ok(())
    }
}

fn map_row(row: sqlx::postgres::PgRow) -> LessonAssignmentRecord {
    LessonAssignmentRecord {
        lesson_id: row.get("lesson_id"),
        title: row.get("title"),
        description: row.try_get("description").ok(),
        created_at: row.get("created_at"),
        updated_at: row.try_get("updated_at").ok(),
    }
}
