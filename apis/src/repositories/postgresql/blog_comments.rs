use sqlx::Row;

use crate::pkg::error::{AppError, AppResult};
use crate::repositories::blog_comments::{
    BlogCommentListResult, BlogCommentPagination, BlogCommentRecord, BlogCommentWithUser,
    BlogCommentsRepository, CreateBlogCommentRecord, UpdateBlogCommentRecord,
};

pub struct PostgresBlogCommentsRepository {
    pub pool: sqlx::Pool<sqlx::Postgres>,
}

#[async_trait::async_trait]
impl BlogCommentsRepository for PostgresBlogCommentsRepository {
    async fn create(&self, input: CreateBlogCommentRecord) -> AppResult<uuid::Uuid> {
        // Start transaction for ACID compliance
        let mut tx = self.pool.begin().await.map_err(AppError::from)?;

        // Validate constraints
        self.validate_comment_constraints(&mut tx, &input).await?;

        // Validate that post exists
        let post_exists =
            sqlx::query_scalar::<_, bool>("SELECT EXISTS(SELECT 1 FROM blog_posts WHERE id = $1)")
                .bind(&input.post_id)
                .fetch_one(&mut *tx)
                .await
                .map_err(AppError::from)?;

        if !post_exists {
            tx.rollback().await.map_err(AppError::from)?;
            return Err(AppError::NotFound(format!(
                "Blog post with id '{}' not found",
                input.post_id
            )));
        }

        // Validate that user exists and is active
        let user_exists = sqlx::query_scalar::<_, bool>(
            "SELECT EXISTS(SELECT 1 FROM users WHERE id = $1 AND is_active = true)",
        )
        .bind(&input.user_id)
        .fetch_one(&mut *tx)
        .await
        .map_err(AppError::from)?;

        if !user_exists {
            tx.rollback().await.map_err(AppError::from)?;
            return Err(AppError::NotFound(format!(
                "User with id '{}' not found or inactive",
                input.user_id
            )));
        }

        // Validate parent comment exists if provided
        if let Some(parent_id) = &input.parent_id {
            let parent_exists = sqlx::query_scalar::<_, bool>(
                "SELECT EXISTS(SELECT 1 FROM blog_comments WHERE id = $1 AND post_id = $2)",
            )
            .bind(parent_id)
            .bind(&input.post_id)
            .fetch_one(&mut *tx)
            .await
            .map_err(AppError::from)?;

            if !parent_exists {
                tx.rollback().await.map_err(AppError::from)?;
                return Err(AppError::NotFound(format!(
                    "Parent comment with id '{}' not found for this post",
                    parent_id
                )));
            }
        }

        // Insert the comment
        let rec = sqlx::query(
            r#"INSERT INTO blog_comments (post_id, user_id, parent_id, content, approved)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id"#,
        )
        .bind(&input.post_id)
        .bind(&input.user_id)
        .bind(&input.parent_id)
        .bind(&input.content)
        .bind(input.approved.unwrap_or(false))
        .fetch_one(&mut *tx)
        .await
        .map_err(|e| AppError::from(e))?;

        let comment_id: uuid::Uuid = rec.get("id");

        // Commit transaction
        tx.commit().await.map_err(AppError::from)?;

        Ok(comment_id)
    }

    async fn find_by_id(&self, id: uuid::Uuid) -> AppResult<Option<BlogCommentRecord>> {
        let row = sqlx::query(
            r#"SELECT id, post_id, user_id, parent_id, content, approved, created_at, updated_at
               FROM blog_comments WHERE id = $1"#,
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(row.map(map_blog_comment_row))
    }

    async fn list_by_post_nested(
        &self,
        post_id: uuid::Uuid,
        approved_only: bool,
    ) -> AppResult<Vec<BlogCommentWithUser>> {
        let where_clause = if approved_only {
            "WHERE bc.post_id = $1 AND bc.approved = true AND bc.parent_id IS NULL"
        } else {
            "WHERE bc.post_id = $1 AND bc.parent_id IS NULL"
        };

        let rows = sqlx::query(&format!(
            r#"SELECT bc.id, bc.post_id, bc.user_id, bc.parent_id, bc.content, bc.approved, bc.created_at, bc.updated_at,
                u.username, u.full_name, u.avatar_url
               FROM blog_comments bc
               JOIN users u ON bc.user_id = u.id
               {}
               ORDER BY bc.created_at ASC"#,
            where_clause
        ))
        .bind(post_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;

        let mut comments = rows
            .into_iter()
            .map(map_blog_comment_with_user_row)
            .collect::<Vec<_>>();

        // Fetch replies for each comment
        for comment in &mut comments {
            comment.replies = self.fetch_replies(comment.id, approved_only).await?;
        }

        Ok(comments)
    }

    async fn list_by_post_paginated(
        &self,
        post_id: uuid::Uuid,
        page: i64,
        limit: i64,
        approved_only: bool,
    ) -> AppResult<BlogCommentListResult> {
        let offset = (page - 1) * limit;
        let where_clause = if approved_only {
            "WHERE bc.post_id = $1 AND bc.approved = true"
        } else {
            "WHERE bc.post_id = $1"
        };

        // Count total records
        let count_query = format!(
            r#"SELECT COUNT(*) as total FROM blog_comments bc {}"#,
            where_clause
        );

        let total_row = sqlx::query(&count_query)
            .bind(post_id)
            .fetch_one(&self.pool)
            .await
            .map_err(AppError::from)?;
        let total: i64 = total_row.get("total");

        // Get paginated results
        let rows = sqlx::query(&format!(
            r#"SELECT bc.id, bc.post_id, bc.user_id, bc.parent_id, bc.content, bc.approved, bc.created_at, bc.updated_at,
                u.username, u.full_name, u.avatar_url
               FROM blog_comments bc
               JOIN users u ON bc.user_id = u.id
               {}
               ORDER BY bc.created_at DESC
               LIMIT $2 OFFSET $3"#,
            where_clause
        ))
        .bind(post_id)
        .bind(limit)
        .bind(offset)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;

        let comments = rows
            .into_iter()
            .map(map_blog_comment_with_user_row)
            .collect();

        let pages = (total + limit - 1) / limit;
        let pagination = BlogCommentPagination {
            page,
            limit,
            total,
            pages,
        };

        Ok(BlogCommentListResult {
            comments,
            pagination,
        })
    }

    async fn list_by_user(&self, user_id: uuid::Uuid) -> AppResult<Vec<BlogCommentRecord>> {
        let rows = sqlx::query(
            r#"SELECT id, post_id, user_id, parent_id, content, approved, created_at, updated_at
               FROM blog_comments WHERE user_id = $1
               ORDER BY created_at DESC"#,
        )
        .bind(user_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(rows.into_iter().map(map_blog_comment_row).collect())
    }

    async fn count_by_post(&self, post_id: uuid::Uuid, approved_only: bool) -> AppResult<i64> {
        let where_clause = if approved_only {
            "WHERE post_id = $1 AND approved = true"
        } else {
            "WHERE post_id = $1"
        };

        let row = sqlx::query(&format!(
            r#"SELECT COUNT(*) as count FROM blog_comments {}"#,
            where_clause
        ))
        .bind(post_id)
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(row.get("count"))
    }

    async fn update_partial(
        &self,
        id: uuid::Uuid,
        input: UpdateBlogCommentRecord,
    ) -> AppResult<Option<BlogCommentRecord>> {
        // Simplified version using COALESCE for partial updates
        let row = sqlx::query(
            r#"UPDATE blog_comments SET 
                content = COALESCE($2, content),
                approved = COALESCE($3, approved)
               WHERE id = $1 
               RETURNING id, post_id, user_id, parent_id, content, approved, created_at, updated_at"#,
        )
        .bind(id)
        .bind(&input.content)
        .bind(&input.approved)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(row.map(map_blog_comment_row))
    }

    async fn delete_by_id(&self, id: uuid::Uuid) -> AppResult<()> {
        sqlx::query("DELETE FROM blog_comments WHERE id = $1")
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(AppError::from)?;

        Ok(())
    }

    async fn approve(&self, id: uuid::Uuid) -> AppResult<()> {
        sqlx::query("UPDATE blog_comments SET approved = true WHERE id = $1")
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(AppError::from)?;

        Ok(())
    }

    async fn reject(&self, id: uuid::Uuid) -> AppResult<()> {
        sqlx::query("UPDATE blog_comments SET approved = false WHERE id = $1")
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(AppError::from)?;

        Ok(())
    }

    async fn list_pending(&self, limit: i64) -> AppResult<Vec<BlogCommentWithUser>> {
        let rows = sqlx::query(
            r#"SELECT bc.id, bc.post_id, bc.user_id, bc.parent_id, bc.content, bc.approved, bc.created_at, bc.updated_at,
                u.username, u.full_name, u.avatar_url
               FROM blog_comments bc
               JOIN users u ON bc.user_id = u.id
               WHERE bc.approved = false
               ORDER BY bc.created_at ASC
               LIMIT $1"#,
        )
        .bind(limit)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(rows
            .into_iter()
            .map(map_blog_comment_with_user_row)
            .collect())
    }
}

impl PostgresBlogCommentsRepository {
    /// Helper method to fetch replies for a comment
    /// Using Box::pin to handle recursive async calls
    async fn fetch_replies(
        &self,
        parent_id: uuid::Uuid,
        approved_only: bool,
    ) -> AppResult<Vec<BlogCommentWithUser>> {
        let where_clause = if approved_only {
            "WHERE bc.parent_id = $1 AND bc.approved = true"
        } else {
            "WHERE bc.parent_id = $1"
        };

        let rows = sqlx::query(&format!(
            r#"SELECT bc.id, bc.post_id, bc.user_id, bc.parent_id, bc.content, bc.approved, bc.created_at, bc.updated_at,
                u.username, u.full_name, u.avatar_url
               FROM blog_comments bc
               JOIN users u ON bc.user_id = u.id
               {}
               ORDER BY bc.created_at ASC"#,
            where_clause
        ))
        .bind(parent_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;

        let mut replies = rows
            .into_iter()
            .map(map_blog_comment_with_user_row)
            .collect::<Vec<_>>();

        // Recursively fetch nested replies using Box::pin
        for reply in &mut replies {
            let fetch_future = self.fetch_replies(reply.id, approved_only);
            reply.replies = Box::pin(fetch_future).await?;
        }

        Ok(replies)
    }

    /// Validate comment constraints for ACID compliance
    async fn validate_comment_constraints(
        &self,
        _tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
        input: &CreateBlogCommentRecord,
    ) -> AppResult<()> {
        // Validate content is not empty
        if input.content.trim().is_empty() {
            return Err(AppError::Validation {
                message: "Comment content cannot be empty".to_string(),
                details: serde_json::json!({}),
            });
        }

        // Validate content length
        if input.content.len() > 2000 {
            return Err(AppError::Validation {
                message: "Comment content cannot exceed 2000 characters".to_string(),
                details: serde_json::json!({}),
            });
        }

        // Validate content doesn't contain only whitespace
        if input.content.trim().is_empty() {
            return Err(AppError::Validation {
                message: "Comment content cannot be only whitespace".to_string(),
                details: serde_json::json!({}),
            });
        }

        // Validate content doesn't contain malicious patterns (basic check)
        let malicious_patterns = ["<script", "javascript:", "data:", "vbscript:"];
        let content_lower = input.content.to_lowercase();
        for pattern in &malicious_patterns {
            if content_lower.contains(pattern) {
                return Err(AppError::Validation {
                    message: "Comment content contains potentially malicious content".to_string(),
                    details: serde_json::json!({}),
                });
            }
        }

        Ok(())
    }
}

fn map_blog_comment_row(row: sqlx::postgres::PgRow) -> BlogCommentRecord {
    BlogCommentRecord {
        id: row.get("id"),
        post_id: row.get("post_id"),
        user_id: row.get("user_id"),
        parent_id: row.get("parent_id"),
        content: row.get("content"),
        approved: row.get("approved"),
        created_at: row.get("created_at"),
        updated_at: row.get("updated_at"),
    }
}

fn map_blog_comment_with_user_row(row: sqlx::postgres::PgRow) -> BlogCommentWithUser {
    BlogCommentWithUser {
        id: row.get("id"),
        post_id: row.get("post_id"),
        user_id: row.get("user_id"),
        parent_id: row.get("parent_id"),
        content: row.get("content"),
        approved: row.get("approved"),
        created_at: row.get("created_at"),
        updated_at: row.get("updated_at"),
        username: row.get("username"),
        full_name: row.get("full_name"),
        avatar_url: row.get("avatar_url"),
        replies: Vec::new(),
    }
}
