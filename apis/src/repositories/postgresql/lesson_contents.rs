use sqlx::Row;

use crate::pkg::error::{AppError, AppResult};
use crate::repositories::lesson_contents::{
    CreateLessonContentRecord, LessonContentRecord, LessonContentsRepository,
    UpdateLessonContentRecord,
};

pub struct PostgresLessonContentsRepository {
    pub pool: sqlx::Pool<sqlx::Postgres>,
}

#[async_trait::async_trait]
impl LessonContentsRepository for PostgresLessonContentsRepository {
    async fn create(&self, input: CreateLessonContentRecord) -> AppResult<uuid::Uuid> {
        let rec = sqlx::query(
            r#"INSERT INTO lesson_contents (
                    lesson_id, title, content_type, url, file_size, filename, position
                ) VALUES (
                    $1,$2,$3,$4,$5,$6,$7
                ) RETURNING id"#,
        )
        .bind(input.lesson_id)
        .bind(&input.title)
        .bind(&input.content_type)
        .bind(&input.url)
        .bind(input.file_size)
        .bind(&input.filename)
        .bind(input.position)
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(rec.get("id"))
    }

    async fn list_by_lesson(&self, lesson_id: uuid::Uuid) -> AppResult<Vec<LessonContentRecord>> {
        let rows = sqlx::query(
            r#"SELECT id, lesson_id, title, content_type, url, file_size, filename, position, created_at, updated_at
               FROM lesson_contents WHERE lesson_id = $1 ORDER BY position ASC, created_at ASC"#,
        )
        .bind(lesson_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(rows.into_iter().map(map_row).collect())
    }

    async fn update_partial(
        &self,
        id: uuid::Uuid,
        input: UpdateLessonContentRecord,
    ) -> AppResult<Option<LessonContentRecord>> {
        let row = sqlx::query(
            r#"UPDATE lesson_contents SET
                    title = COALESCE($1, title),
                    content_type = COALESCE($2, content_type),
                    url = COALESCE($3, url),
                    file_size = COALESCE($4, file_size),
                    filename = COALESCE($5, filename),
                    position = COALESCE($6, position)
               WHERE id = $7
               RETURNING id, lesson_id, title, content_type, url, file_size, filename, position, created_at, updated_at"#,
        )
        .bind(input.title)
        .bind(input.content_type)
        .bind(input.url)
        .bind(input.file_size)
        .bind(input.filename)
        .bind(input.position)
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(row.map(map_row))
    }

    async fn delete_by_id(&self, id: uuid::Uuid) -> AppResult<()> {
        sqlx::query(r#"DELETE FROM lesson_contents WHERE id = $1"#)
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(AppError::from)?;
        Ok(())
    }
}

fn map_row(row: sqlx::postgres::PgRow) -> LessonContentRecord {
    LessonContentRecord {
        id: row.get("id"),
        lesson_id: row.get("lesson_id"),
        title: row.get("title"),
        content_type: row.get("content_type"),
        url: row.get("url"),
        file_size: row.try_get("file_size").ok(),
        filename: row.try_get("filename").ok(),
        position: row.get("position"),
        created_at: row.get("created_at"),
        updated_at: row.try_get("updated_at").ok(),
    }
}
