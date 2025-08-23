use sqlx::Row;

use crate::pkg::error::{AppError, AppResult};
use crate::repositories::modules::{CreateModuleRecord, ModuleRecord, ModulesRepository, UpdateModuleRecord};

pub struct PostgresModulesRepository {
    pub pool: sqlx::Pool<sqlx::Postgres>,
}

#[async_trait::async_trait]
impl ModulesRepository for PostgresModulesRepository {
    async fn create(&self, input: CreateModuleRecord) -> AppResult<uuid::Uuid> {
        let rec = sqlx::query(
            r#"INSERT INTO course_modules (course_id, title, description, position)
                VALUES ($1,$2,$3,$4)
                RETURNING id"#,
        )
        .bind(input.course_id)
        .bind(&input.title)
        .bind(&input.description)
        .bind(input.position)
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(rec.get("id"))
    }

    async fn find_by_id(&self, id: uuid::Uuid) -> AppResult<Option<ModuleRecord>> {
        let row = sqlx::query(
            r#"SELECT id, course_id, title, description, position, created_at, updated_at
               FROM course_modules WHERE id = $1"#,
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(row.map(map_module_row))
    }

    async fn list_by_course(&self, course_id: uuid::Uuid) -> AppResult<Vec<ModuleRecord>> {
        let rows = sqlx::query(
            r#"SELECT id, course_id, title, description, position, created_at, updated_at
               FROM course_modules WHERE course_id = $1 ORDER BY position ASC, created_at ASC"#,
        )
        .bind(course_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(rows.into_iter().map(map_module_row).collect())
    }

    async fn update_partial(&self, id: uuid::Uuid, input: UpdateModuleRecord) -> AppResult<Option<ModuleRecord>> {
        let row = sqlx::query(
            r#"UPDATE course_modules SET
                    title = COALESCE($1, title),
                    description = COALESCE($2, description),
                    position = COALESCE($3, position)
               WHERE id = $4
               RETURNING id, course_id, title, description, position, created_at, updated_at"#,
        )
        .bind(input.title)
        .bind(input.description)
        .bind(input.position)
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(row.map(map_module_row))
    }

    async fn delete_by_id(&self, id: uuid::Uuid) -> AppResult<()> {
        sqlx::query(r#"DELETE FROM course_modules WHERE id = $1"#)
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(AppError::from)?;
        Ok(())
    }
}

fn map_module_row(row: sqlx::postgres::PgRow) -> ModuleRecord {
    ModuleRecord {
        id: row.get("id"),
        course_id: row.get("course_id"),
        title: row.get("title"),
        description: row.try_get("description").ok(),
        position: row.get("position"),
        created_at: row.get("created_at"),
        updated_at: row.try_get("updated_at").ok(),
    }
}


