use sqlx::Row;

use crate::pkg::error::{AppError, AppResult};
use crate::repositories::categories::{CategoriesRepository, CategoryRecord, CreateCategoryRecord, UpdateCategoryRecord};

pub struct PostgresCategoriesRepository {
    pub pool: sqlx::Pool<sqlx::Postgres>,
}

#[async_trait::async_trait]
impl CategoriesRepository for PostgresCategoriesRepository {
    async fn create(&self, input: CreateCategoryRecord) -> AppResult<i32> {
        let rec = sqlx::query(r#"INSERT INTO categories (name, description) VALUES ($1,$2) RETURNING id"#)
            .bind(&input.name)
            .bind(&input.description)
            .fetch_one(&self.pool)
            .await
            .map_err(AppError::from)?;
        Ok(rec.get("id"))
    }

    async fn list_all(&self) -> AppResult<Vec<CategoryRecord>> {
        let rows = sqlx::query(r#"SELECT id, name, description FROM categories ORDER BY name ASC"#)
            .fetch_all(&self.pool)
            .await
            .map_err(AppError::from)?;
        Ok(rows
            .into_iter()
            .map(|row| CategoryRecord {
                id: row.get("id"),
                name: row.get("name"),
                description: row.try_get("description").ok(),
            })
            .collect())
    }

    async fn find_by_id(&self, id: i32) -> AppResult<Option<CategoryRecord>> {
        let row = sqlx::query(r#"SELECT id, name, description FROM categories WHERE id = $1"#)
            .bind(id)
            .fetch_optional(&self.pool)
            .await
            .map_err(AppError::from)?;
        Ok(row.map(|row| CategoryRecord {
            id: row.get("id"),
            name: row.get("name"),
            description: row.try_get("description").ok(),
        }))
    }

    async fn update_partial(&self, id: i32, input: UpdateCategoryRecord) -> AppResult<Option<CategoryRecord>> {
        let row = sqlx::query(
            r#"UPDATE categories SET
                    name = COALESCE($1, name),
                    description = COALESCE($2, description)
               WHERE id = $3
               RETURNING id, name, description"#,
        )
        .bind(input.name)
        .bind(input.description)
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(row.map(|row| CategoryRecord {
            id: row.get("id"),
            name: row.get("name"),
            description: row.try_get("description").ok(),
        }))
    }

    async fn delete_by_id(&self, id: i32) -> AppResult<()> {
        sqlx::query(r#"DELETE FROM categories WHERE id = $1"#)
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(AppError::from)?;
        Ok(())
    }
}


