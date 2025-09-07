use sqlx::Row;

use crate::pkg::error::{AppError, AppResult};
use crate::repositories::lessons::{
    CreateLessonRecord, LessonRecord, LessonsRepository, UpdateLessonRecord,
};

pub struct PostgresLessonsRepository {
    pub pool: sqlx::Pool<sqlx::Postgres>,
}

#[async_trait::async_trait]
impl LessonsRepository for PostgresLessonsRepository {
    async fn create(&self, input: CreateLessonRecord) -> AppResult<uuid::Uuid> {
        let rec = sqlx::query(
            r#"INSERT INTO lessons (
                    module_id, title, description, content, video_url,
                    duration, position, is_free, published
                ) VALUES (
                    $1,$2,$3,$4,$5,$6,$7,$8,$9
                ) RETURNING id"#,
        )
        .bind(input.module_id)
        .bind(&input.title)
        .bind(&input.description)
        .bind(&input.content)
        .bind(&input.video_url)
        .bind(&input.duration)
        .bind(input.position)
        .bind(input.is_free)
        .bind(input.published)
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(rec.get("id"))
    }

    async fn find_by_id(&self, id: uuid::Uuid) -> AppResult<Option<LessonRecord>> {
        let row = sqlx::query(
            r#"SELECT id, module_id, title, description, content, video_url,
                       duration, position, is_free, published,
                       created_at, updated_at
               FROM lessons WHERE id = $1"#,
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(row.map(map_lesson_row))
    }

    async fn list_by_module(&self, module_id: uuid::Uuid) -> AppResult<Vec<LessonRecord>> {
        let rows = sqlx::query(
            r#"SELECT id, module_id, title, description, content, video_url,
                       duration, position, is_free, published,
                       created_at, updated_at
               FROM lessons WHERE module_id = $1 ORDER BY position ASC, created_at ASC"#,
        )
        .bind(module_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(rows.into_iter().map(map_lesson_row).collect())
    }

    async fn update_partial(
        &self,
        id: uuid::Uuid,
        input: UpdateLessonRecord,
    ) -> AppResult<Option<LessonRecord>> {
        let row = sqlx::query(
            r#"UPDATE lessons SET
                    title = COALESCE($1, title),
                    description = COALESCE($2, description),
                    content = COALESCE($3, content),
                    video_url = COALESCE($4, video_url),
                    duration = COALESCE($5, duration),
                    position = COALESCE($6, position),
                    is_free = COALESCE($7, is_free),
                    published = COALESCE($8, published)
               WHERE id = $9
               RETURNING id, module_id, title, description, content, video_url,
                         duration, position, is_free, published,
                         created_at, updated_at"#,
        )
        .bind(input.title)
        .bind(input.description)
        .bind(input.content)
        .bind(input.video_url)
        .bind(input.duration)
        .bind(input.position)
        .bind(input.is_free)
        .bind(input.published)
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(row.map(map_lesson_row))
    }

    async fn delete_by_id(&self, id: uuid::Uuid) -> AppResult<()> {
        sqlx::query(r#"DELETE FROM lessons WHERE id = $1"#)
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(AppError::from)?;
        Ok(())
    }

    async fn bulk_update_positions(
        &self,
        module_id: uuid::Uuid,
        lessons: Vec<crate::types::course_types::LessonPositionUpdate>,
    ) -> AppResult<Vec<LessonRecord>> {
        // Validate input
        if lessons.is_empty() {
            return Ok(Vec::new());
        }

        // Check for duplicate positions
        let mut positions: std::collections::HashSet<i32> = std::collections::HashSet::new();
        for lesson_update in &lessons {
            if !positions.insert(lesson_update.position) {
                return Err(AppError::BadRequest(format!(
                    "Duplicate position {} found in lesson updates",
                    lesson_update.position
                )));
            }
        }

        // Start a transaction to ensure all position updates are atomic
        let mut tx = self.pool.begin().await.map_err(AppError::from)?;

        // Get the current maximum position in the module to use as a safe offset
        let max_pos_row = sqlx::query(
            "SELECT COALESCE(MAX(position), 0) as max_pos FROM lessons WHERE module_id = $1",
        )
        .bind(module_id)
        .fetch_one(&mut *tx)
        .await
        .map_err(AppError::from)?;

        let max_pos: i32 = max_pos_row.get("max_pos");
        let safe_offset = max_pos + 10000; // Use a very high offset to avoid conflicts

        // First, move all lessons to very high temporary positions
        for lesson_update in &lessons {
            sqlx::query(
                r#"UPDATE lessons 
                   SET position = $1, updated_at = NOW()
                   WHERE id = $2 AND module_id = $3"#,
            )
            .bind(safe_offset + lesson_update.position)
            .bind(lesson_update.id)
            .bind(module_id)
            .execute(&mut *tx)
            .await
            .map_err(AppError::from)?;
        }

        // Now update to the final positions
        for lesson_update in &lessons {
            sqlx::query(
                r#"UPDATE lessons 
                   SET position = $1, updated_at = NOW()
                   WHERE id = $2 AND module_id = $3"#,
            )
            .bind(lesson_update.position)
            .bind(lesson_update.id)
            .bind(module_id)
            .execute(&mut *tx)
            .await
            .map_err(AppError::from)?;
        }

        // Fetch all updated lessons
        let rows = sqlx::query(
            r#"SELECT id, module_id, title, description, content, video_url, duration, position, is_free, published, created_at, updated_at
               FROM lessons 
               WHERE module_id = $1 
               ORDER BY position ASC, created_at ASC"#,
        )
        .bind(module_id)
        .fetch_all(&mut *tx)
        .await
        .map_err(AppError::from)?;

        let updated_lessons: Vec<LessonRecord> = rows.into_iter().map(map_lesson_row).collect();

        // Commit the transaction
        tx.commit().await.map_err(AppError::from)?;

        Ok(updated_lessons)
    }
}

fn map_lesson_row(row: sqlx::postgres::PgRow) -> LessonRecord {
    LessonRecord {
        id: row.get("id"),
        module_id: row.get("module_id"),
        title: row.get("title"),
        description: row.try_get("description").ok(),
        content: row.try_get("content").ok(),
        video_url: row.try_get("video_url").ok(),
        duration: row.get("duration"),
        position: row.get("position"),
        is_free: row.get("is_free"),
        published: row.get("published"),
        created_at: row.get("created_at"),
        updated_at: row.try_get("updated_at").ok(),
    }
}
