use sqlx::Row;

use crate::pkg::error::{AppError, AppResult};
use crate::repositories::course_categories::CourseCategoriesRepository;

pub struct PostgresCourseCategoriesRepository {
    pub pool: sqlx::Pool<sqlx::Postgres>,
}

#[async_trait::async_trait]
impl CourseCategoriesRepository for PostgresCourseCategoriesRepository {
    async fn attach(&self, course_id: uuid::Uuid, category_id: i32) -> AppResult<()> {
        sqlx::query(
            r#"INSERT INTO course_categories (course_id, category_id)
               VALUES ($1, $2)
               ON CONFLICT (course_id, category_id) DO NOTHING"#,
        )
        .bind(course_id)
        .bind(category_id)
        .execute(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(())
    }

    async fn detach(&self, course_id: uuid::Uuid, category_id: i32) -> AppResult<()> {
        sqlx::query(r#"DELETE FROM course_categories WHERE course_id = $1 AND category_id = $2"#)
            .bind(course_id)
            .bind(category_id)
            .execute(&self.pool)
            .await
            .map_err(AppError::from)?;
        Ok(())
    }

    async fn list_categories_for_course(&self, course_id: uuid::Uuid) -> AppResult<Vec<i32>> {
        let rows = sqlx::query(r#"SELECT category_id FROM course_categories WHERE course_id = $1 ORDER BY category_id"#)
            .bind(course_id)
            .fetch_all(&self.pool)
            .await
            .map_err(AppError::from)?;
        Ok(rows.into_iter().map(|r| r.get("category_id")).collect())
    }

    async fn list_courses_for_category(&self, category_id: i32) -> AppResult<Vec<uuid::Uuid>> {
        let rows = sqlx::query(r#"SELECT course_id FROM course_categories WHERE category_id = $1 ORDER BY created_at DESC"#)
            .bind(category_id)
            .fetch_all(&self.pool)
            .await
            .map_err(AppError::from)?;
        Ok(rows.into_iter().map(|r| r.get("course_id")).collect())
    }
}


