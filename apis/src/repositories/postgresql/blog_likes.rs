use sqlx::Row;

use crate::pkg::error::{AppError, AppResult};
use crate::repositories::blog_likes::{
    BlogLikeRecord, BlogLikeWithUser, BlogLikesRepository, CreateBlogLikeRecord,
};

pub struct PostgresBlogLikesRepository {
    pub pool: sqlx::Pool<sqlx::Postgres>,
}

#[async_trait::async_trait]
impl BlogLikesRepository for PostgresBlogLikesRepository {
    async fn create(&self, input: CreateBlogLikeRecord) -> AppResult<uuid::Uuid> {
        // Start transaction for ACID compliance
        let mut tx = self.pool.begin().await.map_err(AppError::from)?;

        // Validate that both post and user exist
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

        // Check if like already exists (unique constraint)
        let like_exists = sqlx::query_scalar::<_, bool>(
            "SELECT EXISTS(SELECT 1 FROM blog_likes WHERE post_id = $1 AND user_id = $2)",
        )
        .bind(&input.post_id)
        .bind(&input.user_id)
        .fetch_one(&mut *tx)
        .await
        .map_err(AppError::from)?;

        if like_exists {
            tx.rollback().await.map_err(AppError::from)?;
            return Err(AppError::Conflict(
                "User has already liked this post".to_string(),
            ));
        }

        // Insert the like
        let rec = sqlx::query(
            r#"INSERT INTO blog_likes (post_id, user_id)
                VALUES ($1, $2)
                RETURNING id"#,
        )
        .bind(&input.post_id)
        .bind(&input.user_id)
        .fetch_one(&mut *tx)
        .await
        .map_err(|e| AppError::from(e))?;

        let like_id: uuid::Uuid = rec.get("id");

        // Commit transaction
        tx.commit().await.map_err(AppError::from)?;

        Ok(like_id)
    }

    async fn find_by_post_and_user(
        &self,
        post_id: uuid::Uuid,
        user_id: uuid::Uuid,
    ) -> AppResult<Option<BlogLikeRecord>> {
        let row = sqlx::query(
            r#"SELECT id, post_id, user_id, created_at
               FROM blog_likes WHERE post_id = $1 AND user_id = $2"#,
        )
        .bind(post_id)
        .bind(user_id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(row.map(map_blog_like_row))
    }

    async fn has_user_liked(&self, post_id: uuid::Uuid, user_id: uuid::Uuid) -> AppResult<bool> {
        let row = sqlx::query(
            r#"SELECT EXISTS(SELECT 1 FROM blog_likes WHERE post_id = $1 AND user_id = $2) as exists"#,
        )
        .bind(post_id)
        .bind(user_id)
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(row.get("exists"))
    }

    async fn count_by_post(&self, post_id: uuid::Uuid) -> AppResult<i64> {
        let row = sqlx::query(r#"SELECT COUNT(*) as count FROM blog_likes WHERE post_id = $1"#)
            .bind(post_id)
            .fetch_one(&self.pool)
            .await
            .map_err(AppError::from)?;

        Ok(row.get("count"))
    }

    async fn list_by_post_with_users(
        &self,
        post_id: uuid::Uuid,
        limit: Option<i64>,
    ) -> AppResult<Vec<BlogLikeWithUser>> {
        let (query, has_limit) = if let Some(_limit) = limit {
            (
                r#"SELECT bl.id, bl.post_id, bl.user_id, bl.created_at,
                u.username, u.full_name, u.avatar_url
               FROM blog_likes bl
               JOIN users u ON bl.user_id = u.id
               WHERE bl.post_id = $1
               ORDER BY bl.created_at DESC
               LIMIT $2"#,
                true,
            )
        } else {
            (
                r#"SELECT bl.id, bl.post_id, bl.user_id, bl.created_at,
                u.username, u.full_name, u.avatar_url
               FROM blog_likes bl
               JOIN users u ON bl.user_id = u.id
               WHERE bl.post_id = $1
               ORDER BY bl.created_at DESC"#,
                false,
            )
        };

        let mut query_builder = sqlx::query(query).bind(post_id);
        if has_limit {
            query_builder = query_builder.bind(limit.unwrap());
        }

        let rows = query_builder
            .fetch_all(&self.pool)
            .await
            .map_err(AppError::from)?;

        Ok(rows.into_iter().map(map_blog_like_with_user_row).collect())
    }

    async fn list_by_user(&self, user_id: uuid::Uuid) -> AppResult<Vec<BlogLikeRecord>> {
        let rows = sqlx::query(
            r#"SELECT id, post_id, user_id, created_at
               FROM blog_likes WHERE user_id = $1
               ORDER BY created_at DESC"#,
        )
        .bind(user_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(rows.into_iter().map(map_blog_like_row).collect())
    }

    async fn remove(&self, post_id: uuid::Uuid, user_id: uuid::Uuid) -> AppResult<()> {
        sqlx::query("DELETE FROM blog_likes WHERE post_id = $1 AND user_id = $2")
            .bind(post_id)
            .bind(user_id)
            .execute(&self.pool)
            .await
            .map_err(AppError::from)?;

        Ok(())
    }

    async fn toggle(&self, post_id: uuid::Uuid, user_id: uuid::Uuid) -> AppResult<bool> {
        // Start transaction for ACID compliance
        let mut tx = self.pool.begin().await.map_err(AppError::from)?;

        // Check if like exists within transaction
        let like_exists = sqlx::query_scalar::<_, bool>(
            "SELECT EXISTS(SELECT 1 FROM blog_likes WHERE post_id = $1 AND user_id = $2)",
        )
        .bind(post_id)
        .bind(user_id)
        .fetch_one(&mut *tx)
        .await
        .map_err(AppError::from)?;

        if like_exists {
            // Remove like
            let rows_affected =
                sqlx::query("DELETE FROM blog_likes WHERE post_id = $1 AND user_id = $2")
                    .bind(post_id)
                    .bind(user_id)
                    .execute(&mut *tx)
                    .await
                    .map_err(|e| AppError::from(e))?
                    .rows_affected();

            if rows_affected == 0 {
                tx.rollback().await.map_err(AppError::from)?;
                return Err(AppError::NotFound("Like not found".to_string()));
            }

            tx.commit().await.map_err(AppError::from)?;
            Ok(false)
        } else {
            // Validate that both post and user exist before adding like
            let post_exists = sqlx::query_scalar::<_, bool>(
                "SELECT EXISTS(SELECT 1 FROM blog_posts WHERE id = $1)",
            )
            .bind(post_id)
            .fetch_one(&mut *tx)
            .await
            .map_err(AppError::from)?;

            if !post_exists {
                tx.rollback().await.map_err(AppError::from)?;
                return Err(AppError::NotFound(format!(
                    "Blog post with id '{}' not found",
                    post_id
                )));
            }

            let user_exists = sqlx::query_scalar::<_, bool>(
                "SELECT EXISTS(SELECT 1 FROM users WHERE id = $1 AND is_active = true)",
            )
            .bind(user_id)
            .fetch_one(&mut *tx)
            .await
            .map_err(AppError::from)?;

            if !user_exists {
                tx.rollback().await.map_err(AppError::from)?;
                return Err(AppError::NotFound(format!(
                    "User with id '{}' not found or inactive",
                    user_id
                )));
            }

            // Add like
            sqlx::query("INSERT INTO blog_likes (post_id, user_id) VALUES ($1, $2)")
                .bind(post_id)
                .bind(user_id)
                .execute(&mut *tx)
                .await
                .map_err(|e| AppError::from(e))?;

            tx.commit().await.map_err(AppError::from)?;
            Ok(true)
        }
    }
}

fn map_blog_like_row(row: sqlx::postgres::PgRow) -> BlogLikeRecord {
    BlogLikeRecord {
        id: row.get("id"),
        post_id: row.get("post_id"),
        user_id: row.get("user_id"),
        created_at: row.get("created_at"),
    }
}

fn map_blog_like_with_user_row(row: sqlx::postgres::PgRow) -> BlogLikeWithUser {
    BlogLikeWithUser {
        id: row.get("id"),
        post_id: row.get("post_id"),
        user_id: row.get("user_id"),
        username: row.get("username"),
        full_name: row.get("full_name"),
        avatar_url: row.get("avatar_url"),
        created_at: row.get("created_at"),
    }
}
