use sqlx::Row;

use crate::pkg::error::{AppError, AppResult};
use crate::repositories::blog_tags::{
    BlogTagRecord, BlogTagWithCount, BlogTagsRepository, CreateBlogTagRecord, UpdateBlogTagRecord,
};

pub struct PostgresBlogTagsRepository {
    pub pool: sqlx::Pool<sqlx::Postgres>,
}

#[async_trait::async_trait]
impl BlogTagsRepository for PostgresBlogTagsRepository {
    async fn create(&self, input: CreateBlogTagRecord) -> AppResult<uuid::Uuid> {
        // Start transaction for ACID compliance
        let mut tx = self.pool.begin().await.map_err(AppError::from)?;

        // Validate constraints
        self.validate_tag_constraints(&mut tx, &input).await?;

        // Check for unique name constraint
        let existing_name = sqlx::query_scalar::<_, Option<String>>(
            "SELECT name FROM blog_tags WHERE LOWER(name) = LOWER($1)",
        )
        .bind(&input.name)
        .fetch_optional(&mut *tx)
        .await
        .map_err(AppError::from)?;

        if existing_name.is_some() {
            tx.rollback().await.map_err(AppError::from)?;
            return Err(AppError::Conflict(format!(
                "Blog tag with name '{}' already exists",
                input.name
            )));
        }

        // Insert the tag
        let rec = sqlx::query(
            r#"INSERT INTO blog_tags (name, color, description)
                VALUES ($1, $2, $3)
                RETURNING id"#,
        )
        .bind(&input.name)
        .bind(&input.color)
        .bind(&input.description)
        .fetch_one(&mut *tx)
        .await
        .map_err(|e| AppError::from(e))?;

        let tag_id: uuid::Uuid = rec.get("id");

        // Commit transaction
        tx.commit().await.map_err(AppError::from)?;

        Ok(tag_id)
    }

    async fn find_by_id(&self, id: uuid::Uuid) -> AppResult<Option<BlogTagRecord>> {
        let row = sqlx::query(
            r#"SELECT id, name, color, description, created_at
               FROM blog_tags WHERE id = $1"#,
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(row.map(map_blog_tag_row))
    }

    async fn find_by_name(&self, name: &str) -> AppResult<Option<BlogTagRecord>> {
        let row = sqlx::query(
            r#"SELECT id, name, color, description, created_at
               FROM blog_tags WHERE name = $1"#,
        )
        .bind(name)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(row.map(map_blog_tag_row))
    }

    async fn list_all(&self) -> AppResult<Vec<BlogTagRecord>> {
        let rows = sqlx::query(
            r#"SELECT id, name, color, description, created_at
               FROM blog_tags
               ORDER BY name"#,
        )
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(rows.into_iter().map(map_blog_tag_row).collect())
    }

    async fn list_with_counts(&self) -> AppResult<Vec<BlogTagWithCount>> {
        let rows = sqlx::query(
            r#"SELECT bt.id, bt.name, bt.color, bt.description, bt.created_at,
                COALESCE(COUNT(bpt.post_id), 0) as post_count
               FROM blog_tags bt
               LEFT JOIN blog_post_tags bpt ON bt.id = bpt.tag_id
               LEFT JOIN blog_posts bp ON bpt.post_id = bp.id AND bp.published = true
               GROUP BY bt.id, bt.name, bt.color, bt.description, bt.created_at
               ORDER BY post_count DESC, bt.name"#,
        )
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(rows.into_iter().map(map_blog_tag_with_count_row).collect())
    }

    async fn update_partial(
        &self,
        id: uuid::Uuid,
        input: UpdateBlogTagRecord,
    ) -> AppResult<Option<BlogTagRecord>> {
        // Simplified version using COALESCE for partial updates
        let row = sqlx::query(
            r#"UPDATE blog_tags SET 
                name = COALESCE($2, name),
                color = COALESCE($3, color),
                description = COALESCE($4, description)
               WHERE id = $1 
               RETURNING id, name, color, description, created_at"#,
        )
        .bind(id)
        .bind(&input.name)
        .bind(&input.color)
        .bind(&input.description)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(row.map(map_blog_tag_row))
    }

    async fn delete_by_id(&self, id: uuid::Uuid) -> AppResult<()> {
        sqlx::query("DELETE FROM blog_tags WHERE id = $1")
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(AppError::from)?;

        Ok(())
    }

    async fn find_or_create(&self, name: &str, color: &str) -> AppResult<BlogTagRecord> {
        // Try to find existing tag first
        if let Some(tag) = self.find_by_name(name).await? {
            return Ok(tag);
        }

        // Create new tag if not found
        let id = self
            .create(CreateBlogTagRecord {
                name: name.to_string(),
                color: color.to_string(),
                description: None,
            })
            .await?;

        self.find_by_id(id)
            .await?
            .ok_or_else(|| AppError::Internal("Failed to retrieve created tag".to_string()))
    }
}

impl PostgresBlogTagsRepository {
    /// Validate tag constraints for ACID compliance
    async fn validate_tag_constraints(
        &self,
        _tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
        input: &CreateBlogTagRecord,
    ) -> AppResult<()> {
        // Validate name is not empty
        if input.name.trim().is_empty() {
            return Err(AppError::Validation {
                message: "Tag name cannot be empty".to_string(),
                details: serde_json::json!({}),
            });
        }

        // Validate name length
        if input.name.len() > 50 {
            return Err(AppError::Validation {
                message: "Tag name cannot exceed 50 characters".to_string(),
                details: serde_json::json!({}),
            });
        }

        // Validate name format (alphanumeric, spaces, hyphens, underscores only)
        if !input
            .name
            .chars()
            .all(|c| c.is_alphanumeric() || c.is_whitespace() || c == '-' || c == '_')
        {
            return Err(AppError::Validation {
                message: "Tag name can only contain alphanumeric characters, spaces, hyphens, and underscores".to_string(),
                details: serde_json::json!({}),
            });
        }

        // Validate color format (hex color)
        if !input.color.starts_with('#') || input.color.len() != 7 {
            return Err(AppError::Validation {
                message: "Color must be a valid hex color (e.g., #FF0000)".to_string(),
                details: serde_json::json!({}),
            });
        }

        // Validate color hex characters
        if !input.color[1..].chars().all(|c| c.is_ascii_hexdigit()) {
            return Err(AppError::Validation {
                message: "Color must contain valid hex characters".to_string(),
                details: serde_json::json!({}),
            });
        }

        // Validate description length if provided
        if let Some(description) = &input.description {
            if description.len() > 200 {
                return Err(AppError::Validation {
                    message: "Tag description cannot exceed 200 characters".to_string(),
                    details: serde_json::json!({}),
                });
            }
        }

        Ok(())
    }
}

fn map_blog_tag_row(row: sqlx::postgres::PgRow) -> BlogTagRecord {
    BlogTagRecord {
        id: row.get("id"),
        name: row.get("name"),
        color: row.get("color"),
        description: row.get("description"),
        created_at: row.get("created_at"),
    }
}

fn map_blog_tag_with_count_row(row: sqlx::postgres::PgRow) -> BlogTagWithCount {
    BlogTagWithCount {
        id: row.get("id"),
        name: row.get("name"),
        color: row.get("color"),
        description: row.get("description"),
        post_count: row.get("post_count"),
        created_at: row.get("created_at"),
    }
}
