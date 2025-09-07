use sqlx::{Postgres, Row, Transaction};

use crate::pkg::error::{AppError, AppResult};
use crate::repositories::blog_posts::{
    AuthorSummary, BlogPostFilters, BlogPostListResult, BlogPostPagination, BlogPostRecord,
    BlogPostsRepository, BlogTag, CreateBlogPostRecord, UpdateBlogPostRecord,
};

pub struct PostgresBlogPostsRepository {
    pub pool: sqlx::Pool<sqlx::Postgres>,
}

#[async_trait::async_trait]
impl BlogPostsRepository for PostgresBlogPostsRepository {
    async fn create(&self, input: CreateBlogPostRecord) -> AppResult<uuid::Uuid> {
        // Start transaction for ACID compliance
        let mut tx = self.pool.begin().await.map_err(AppError::from)?;

        // Validate constraints before insertion
        self.validate_blog_post_constraints(&mut tx, &input).await?;

        // Check for unique slug constraint
        let existing_slug =
            sqlx::query_scalar::<_, Option<String>>("SELECT slug FROM blog_posts WHERE slug = $1")
                .bind(&input.slug)
                .fetch_optional(&mut *tx)
                .await
                .map_err(AppError::from)?;

        if existing_slug.is_some() {
            tx.rollback().await.map_err(AppError::from)?;
            return Err(AppError::Conflict(format!(
                "Blog post with slug '{}' already exists",
                input.slug
            )));
        }

        // Validate author exists if provided
        if let Some(author_id) = &input.author_id {
            let author_exists = sqlx::query_scalar::<_, bool>(
                "SELECT EXISTS(SELECT 1 FROM users WHERE id = $1 AND is_active = true)",
            )
            .bind(author_id)
            .fetch_one(&mut *tx)
            .await
            .map_err(AppError::from)?;

            if !author_exists {
                tx.rollback().await.map_err(AppError::from)?;
                return Err(AppError::NotFound(format!(
                    "Author with id '{}' not found or inactive",
                    author_id
                )));
            }
        }

        // Insert blog post with proper error handling
        let rec = sqlx::query(
            r#"INSERT INTO blog_posts (slug, title, excerpt, content, cover_image, published, featured, author_id, published_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id"#,
        )
        .bind(&input.slug)
        .bind(&input.title)
        .bind(&input.excerpt)
        .bind(&input.content)
        .bind(&input.cover_image)
        .bind(input.published)
        .bind(input.featured)
        .bind(&input.author_id)
        .bind(&input.published_at)
        .fetch_one(&mut *tx)
        .await
        .map_err(|e| {
            AppError::from(e)
        })?;

        let post_id: uuid::Uuid = rec.get("id");

        // Commit transaction
        tx.commit().await.map_err(AppError::from)?;

        Ok(post_id)
    }

    async fn find_by_id(&self, id: uuid::Uuid) -> AppResult<Option<BlogPostRecord>> {
        let row = sqlx::query(
            r#"SELECT id, slug, title, excerpt, content, cover_image, view_count, read_time,
                published, featured, author_id, published_at, created_at, updated_at
               FROM blog_posts WHERE id = $1"#,
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(row.map(map_blog_post_row))
    }

    async fn find_by_slug_with_aggregates(&self, slug: &str) -> AppResult<Option<BlogPostRecord>> {
        let row = sqlx::query(r#"SELECT * FROM get_blog_post_with_aggregates($1)"#)
            .bind(slug)
            .fetch_optional(&self.pool)
            .await
            .map_err(AppError::from)?;

        Ok(row.map(map_blog_post_aggregate_row))
    }

    async fn list_paginated(
        &self,
        filters: BlogPostFilters,
        page: i64,
        limit: i64,
    ) -> AppResult<BlogPostListResult> {
        let offset = (page - 1) * limit;

        // For now, implement a simplified version without dynamic query building
        // This can be enhanced later with proper query building
        let rows = sqlx::query(
            r#"SELECT bp.id, bp.slug, bp.title, bp.excerpt, bp.content, bp.cover_image, bp.view_count, bp.read_time,
                bp.published, bp.featured, bp.author_id, bp.published_at, bp.created_at, bp.updated_at,
                u.username as author_username, u.full_name as author_full_name, u.avatar_url as author_avatar_url,
                COALESCE(bl.likes_count, 0) as likes_count
               FROM blog_posts bp
               LEFT JOIN users u ON bp.author_id = u.id
               LEFT JOIN (
                   SELECT post_id, COUNT(*) as likes_count
                   FROM blog_likes
                   GROUP BY post_id
               ) bl ON bp.id = bl.post_id
               WHERE ($1::text IS NULL OR (bp.title ILIKE $1 OR bp.excerpt ILIKE $1 OR bp.content ILIKE $1))
                 AND ($2::text IS NULL OR EXISTS (SELECT 1 FROM blog_post_tags bpt JOIN blog_tags bt ON bpt.tag_id = bt.id WHERE bpt.post_id = bp.id AND bt.name = $2))
                 AND ($3::uuid IS NULL OR bp.author_id = $3)
                 AND ($4::boolean IS NULL OR bp.published = $4)
                 AND ($5::boolean IS NULL OR bp.featured = $5)
               ORDER BY bp.published_at DESC NULLS LAST, bp.created_at DESC
               LIMIT $6 OFFSET $7"#,
        )
        .bind(filters.search.as_ref().map(|s| format!("%{}%", s)))
        .bind(&filters.tag)
        .bind(&filters.author_id)
        .bind(&filters.published)
        .bind(&filters.featured)
        .bind(limit)
        .bind(offset)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;

        // Count total records with same filters
        let total_row = sqlx::query(
            r#"SELECT COUNT(*) as total FROM blog_posts bp
               WHERE ($1::text IS NULL OR (bp.title ILIKE $1 OR bp.excerpt ILIKE $1 OR bp.content ILIKE $1))
                 AND ($2::text IS NULL OR EXISTS (SELECT 1 FROM blog_post_tags bpt JOIN blog_tags bt ON bpt.tag_id = bt.id WHERE bpt.post_id = bp.id AND bt.name = $2))
                 AND ($3::uuid IS NULL OR bp.author_id = $3)
                 AND ($4::boolean IS NULL OR bp.published = $4)
                 AND ($5::boolean IS NULL OR bp.featured = $5)"#,
        )
        .bind(filters.search.as_ref().map(|s| format!("%{}%", s)))
        .bind(&filters.tag)
        .bind(&filters.author_id)
        .bind(&filters.published)
        .bind(&filters.featured)
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::from)?;
        let total: i64 = total_row.get("total");

        let posts = rows
            .into_iter()
            .map(map_blog_post_with_author_row)
            .collect();

        let pages = (total + limit - 1) / limit;
        let pagination = BlogPostPagination {
            page,
            limit,
            total,
            pages,
        };

        Ok(BlogPostListResult { posts, pagination })
    }

    async fn update_partial(
        &self,
        id: uuid::Uuid,
        input: UpdateBlogPostRecord,
    ) -> AppResult<Option<BlogPostRecord>> {
        // Start transaction for ACID compliance
        let mut tx = self.pool.begin().await.map_err(AppError::from)?;

        // Check if blog post exists and get current version for optimistic locking
        let current_post = sqlx::query(
            "SELECT id, slug, title, updated_at FROM blog_posts WHERE id = $1 FOR UPDATE",
        )
        .bind(id)
        .fetch_optional(&mut *tx)
        .await
        .map_err(AppError::from)?;

        if current_post.is_none() {
            tx.rollback().await.map_err(AppError::from)?;
            return Ok(None);
        }

        // Validate constraints for updates
        if let Some(title) = &input.title {
            if title.trim().is_empty() {
                tx.rollback().await.map_err(AppError::from)?;
                return Err(AppError::Validation {
                    message: "Title cannot be empty".to_string(),
                    details: serde_json::json!({}),
                });
            }
        }

        if let Some(content) = &input.content {
            if content.trim().is_empty() {
                tx.rollback().await.map_err(AppError::from)?;
                return Err(AppError::Validation {
                    message: "Content cannot be empty".to_string(),
                    details: serde_json::json!({}),
                });
            }
        }

        // Perform update with proper error handling
        let row = sqlx::query(
            r#"UPDATE blog_posts SET 
                title = COALESCE($2, title),
                excerpt = COALESCE($3, excerpt),
                content = COALESCE($4, content),
                cover_image = COALESCE($5, cover_image),
                published = COALESCE($6, published),
                featured = COALESCE($7, featured),
                published_at = COALESCE($8, published_at),
                updated_at = NOW()
               WHERE id = $1 
               RETURNING id, slug, title, excerpt, content, cover_image, view_count, read_time, published, featured, author_id, published_at, created_at, updated_at"#,
        )
        .bind(id)
        .bind(&input.title)
        .bind(&input.excerpt)
        .bind(&input.content)
        .bind(&input.cover_image)
        .bind(&input.published)
        .bind(&input.featured)
        .bind(&input.published_at)
        .fetch_optional(&mut *tx)
        .await
        .map_err(|e| {
            AppError::from(e)
        })?;

        // Commit transaction
        tx.commit().await.map_err(AppError::from)?;

        Ok(row.map(map_blog_post_row))
    }

    async fn delete_by_id(&self, id: uuid::Uuid) -> AppResult<()> {
        // Start transaction for ACID compliance
        let mut tx = self.pool.begin().await.map_err(AppError::from)?;

        // Check if blog post exists
        let post_exists =
            sqlx::query_scalar::<_, bool>("SELECT EXISTS(SELECT 1 FROM blog_posts WHERE id = $1)")
                .bind(id)
                .fetch_one(&mut *tx)
                .await
                .map_err(AppError::from)?;

        if !post_exists {
            tx.rollback().await.map_err(AppError::from)?;
            return Err(AppError::NotFound(format!(
                "Blog post with id '{}' not found",
                id
            )));
        }

        // Delete related records first (cascade delete)
        sqlx::query("DELETE FROM blog_post_tags WHERE post_id = $1")
            .bind(id)
            .execute(&mut *tx)
            .await
            .map_err(|e| AppError::from(e))?;

        sqlx::query("DELETE FROM blog_likes WHERE post_id = $1")
            .bind(id)
            .execute(&mut *tx)
            .await
            .map_err(|e| AppError::from(e))?;

        sqlx::query("DELETE FROM blog_comments WHERE post_id = $1")
            .bind(id)
            .execute(&mut *tx)
            .await
            .map_err(|e| AppError::from(e))?;

        // Delete the blog post
        sqlx::query("DELETE FROM blog_posts WHERE id = $1")
            .bind(id)
            .execute(&mut *tx)
            .await
            .map_err(|e| AppError::from(e))?;

        // Commit transaction
        tx.commit().await.map_err(AppError::from)?;

        Ok(())
    }

    async fn increment_view_count(&self, id: uuid::Uuid) -> AppResult<()> {
        sqlx::query("UPDATE blog_posts SET view_count = view_count + 1 WHERE id = $1")
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(AppError::from)?;

        Ok(())
    }

    async fn find_featured(&self, limit: i64) -> AppResult<Vec<BlogPostRecord>> {
        let rows = sqlx::query(
            r#"SELECT bp.id, bp.slug, bp.title, bp.excerpt, bp.content, bp.cover_image, bp.view_count, bp.read_time,
                bp.published, bp.featured, bp.author_id, bp.published_at, bp.created_at, bp.updated_at,
                u.username as author_username, u.full_name as author_full_name, u.avatar_url as author_avatar_url,
                COALESCE(bl.likes_count, 0) as likes_count
               FROM blog_posts bp
               LEFT JOIN users u ON bp.author_id = u.id
               LEFT JOIN (
                   SELECT post_id, COUNT(*) as likes_count
                   FROM blog_likes
                   GROUP BY post_id
               ) bl ON bp.id = bl.post_id
               WHERE bp.published = true AND bp.featured = true
               ORDER BY bp.published_at DESC NULLS LAST, bp.created_at DESC
               LIMIT $1"#,
        )
        .bind(limit)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(rows
            .into_iter()
            .map(map_blog_post_with_author_row)
            .collect())
    }

    async fn find_recent(&self, limit: i64) -> AppResult<Vec<BlogPostRecord>> {
        let rows = sqlx::query(
            r#"SELECT bp.id, bp.slug, bp.title, bp.excerpt, bp.content, bp.cover_image, bp.view_count, bp.read_time,
                bp.published, bp.featured, bp.author_id, bp.published_at, bp.created_at, bp.updated_at,
                u.username as author_username, u.full_name as author_full_name, u.avatar_url as author_avatar_url,
                COALESCE(bl.likes_count, 0) as likes_count
               FROM blog_posts bp
               LEFT JOIN users u ON bp.author_id = u.id
               LEFT JOIN (
                   SELECT post_id, COUNT(*) as likes_count
                   FROM blog_likes
                   GROUP BY post_id
               ) bl ON bp.id = bl.post_id
               WHERE bp.published = true
               ORDER BY bp.published_at DESC NULLS LAST, bp.created_at DESC
               LIMIT $1"#,
        )
        .bind(limit)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(rows
            .into_iter()
            .map(map_blog_post_with_author_row)
            .collect())
    }

    async fn list_by_author_paginated(
        &self,
        author_id: uuid::Uuid,
        page: i64,
        limit: i64,
    ) -> AppResult<BlogPostListResult> {
        let offset = (page - 1) * limit;

        // Count total records
        let total_row =
            sqlx::query("SELECT COUNT(*) as total FROM blog_posts WHERE author_id = $1")
                .bind(author_id)
                .fetch_one(&self.pool)
                .await
                .map_err(AppError::from)?;
        let total: i64 = total_row.get("total");

        // Get paginated results
        let rows = sqlx::query(
            r#"SELECT bp.id, bp.slug, bp.title, bp.excerpt, bp.content, bp.cover_image, bp.view_count, bp.read_time,
                bp.published, bp.featured, bp.author_id, bp.published_at, bp.created_at, bp.updated_at,
                u.username as author_username, u.full_name as author_full_name, u.avatar_url as author_avatar_url,
                COALESCE(bl.likes_count, 0) as likes_count
               FROM blog_posts bp
               LEFT JOIN users u ON bp.author_id = u.id
               LEFT JOIN (
                   SELECT post_id, COUNT(*) as likes_count
                   FROM blog_likes
                   GROUP BY post_id
               ) bl ON bp.id = bl.post_id
               WHERE bp.author_id = $1
               ORDER BY bp.created_at DESC
               LIMIT $2 OFFSET $3"#,
        )
        .bind(author_id)
        .bind(limit)
        .bind(offset)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;

        let posts = rows
            .into_iter()
            .map(map_blog_post_with_author_row)
            .collect();

        let pages = (total + limit - 1) / limit;
        let pagination = BlogPostPagination {
            page,
            limit,
            total,
            pages,
        };

        Ok(BlogPostListResult { posts, pagination })
    }
}

impl PostgresBlogPostsRepository {
    /// Validate blog post constraints for ACID compliance
    async fn validate_blog_post_constraints(
        &self,
        _tx: &mut Transaction<'_, Postgres>,
        input: &CreateBlogPostRecord,
    ) -> AppResult<()> {
        // Validate required fields
        if input.slug.trim().is_empty() {
            return Err(AppError::Validation {
                message: "Slug cannot be empty".to_string(),
                details: serde_json::json!({}),
            });
        }

        if input.title.trim().is_empty() {
            return Err(AppError::Validation {
                message: "Title cannot be empty".to_string(),
                details: serde_json::json!({}),
            });
        }

        if input.content.trim().is_empty() {
            return Err(AppError::Validation {
                message: "Content cannot be empty".to_string(),
                details: serde_json::json!({}),
            });
        }

        // Validate slug format (alphanumeric, hyphens, underscores only)
        if !input
            .slug
            .chars()
            .all(|c| c.is_alphanumeric() || c == '-' || c == '_')
        {
            return Err(AppError::Validation {
                message: "Slug can only contain alphanumeric characters, hyphens, and underscores"
                    .to_string(),
                details: serde_json::json!({}),
            });
        }

        // Validate slug length
        if input.slug.len() > 100 {
            return Err(AppError::Validation {
                message: "Slug cannot exceed 100 characters".to_string(),
                details: serde_json::json!({}),
            });
        }

        // Validate title length
        if input.title.len() > 200 {
            return Err(AppError::Validation {
                message: "Title cannot exceed 200 characters".to_string(),
                details: serde_json::json!({}),
            });
        }

        // Validate content length
        if input.content.len() > 100000 {
            return Err(AppError::Validation {
                message: "Content cannot exceed 100,000 characters".to_string(),
                details: serde_json::json!({}),
            });
        }

        // Validate excerpt length if provided
        if let Some(excerpt) = &input.excerpt {
            if excerpt.len() > 500 {
                return Err(AppError::Validation {
                    message: "Excerpt cannot exceed 500 characters".to_string(),
                    details: serde_json::json!({}),
                });
            }
        }

        // Validate published_at consistency
        if input.published && input.published_at.is_none() {
            return Err(AppError::Validation {
                message: "Published posts must have a published_at timestamp".to_string(),
                details: serde_json::json!({}),
            });
        }

        if !input.published && input.published_at.is_some() {
            return Err(AppError::Validation {
                message: "Unpublished posts cannot have a published_at timestamp".to_string(),
                details: serde_json::json!({}),
            });
        }

        Ok(())
    }
}

fn map_blog_post_row(row: sqlx::postgres::PgRow) -> BlogPostRecord {
    BlogPostRecord {
        id: row.get("id"),
        slug: row.get("slug"),
        title: row.get("title"),
        excerpt: row.get("excerpt"),
        content: row.get("content"),
        cover_image: row.get("cover_image"),
        view_count: row.get("view_count"),
        read_time: row.get("read_time"),
        published: row.get("published"),
        featured: row.get("featured"),
        author_id: row.get("author_id"),
        author: None,
        published_at: row.get("published_at"),
        created_at: row.get("created_at"),
        updated_at: row.get("updated_at"),
        likes_count: None,
        tags: None,
    }
}

fn map_blog_post_with_author_row(row: sqlx::postgres::PgRow) -> BlogPostRecord {
    let author = if let Some(author_id) = row.get::<Option<uuid::Uuid>, _>("author_id") {
        Some(AuthorSummary {
            id: author_id,
            username: row.get("author_username"),
            full_name: row.get("author_full_name"),
            avatar_url: row.get("author_avatar_url"),
        })
    } else {
        None
    };

    BlogPostRecord {
        id: row.get("id"),
        slug: row.get("slug"),
        title: row.get("title"),
        excerpt: row.get("excerpt"),
        content: row.get("content"),
        cover_image: row.get("cover_image"),
        view_count: row.get("view_count"),
        read_time: row.get("read_time"),
        published: row.get("published"),
        featured: row.get("featured"),
        author_id: row.get("author_id"),
        author,
        published_at: row.get("published_at"),
        created_at: row.get("created_at"),
        updated_at: row.get("updated_at"),
        likes_count: Some(row.get("likes_count")),
        tags: None,
    }
}

fn map_blog_post_aggregate_row(row: sqlx::postgres::PgRow) -> BlogPostRecord {
    let author = if let Some(author_id) = row.get::<Option<uuid::Uuid>, _>("author_id") {
        Some(AuthorSummary {
            id: author_id,
            username: row.get("author_name"),
            full_name: None,
            avatar_url: row.get("author_avatar"),
        })
    } else {
        None
    };

    // Parse tags from JSONB
    let tags: Option<Vec<BlogTag>> =
        row.get::<Option<serde_json::Value>, _>("tags")
            .and_then(|json| {
                if let serde_json::Value::Array(arr) = json {
                    Some(
                        arr.into_iter()
                            .filter_map(|item| {
                                if let serde_json::Value::Object(obj) = item {
                                    Some(BlogTag {
                                        id: obj.get("id")?.as_str()?.parse().ok()?,
                                        name: obj.get("name")?.as_str()?.to_string(),
                                        color: obj.get("color")?.as_str()?.to_string(),
                                    })
                                } else {
                                    None
                                }
                            })
                            .collect(),
                    )
                } else {
                    None
                }
            });

    BlogPostRecord {
        id: row.get("id"),
        slug: row.get("slug"),
        title: row.get("title"),
        excerpt: row.get("excerpt"),
        content: row.get("content"),
        cover_image: row.get("cover_image"),
        view_count: row.get("view_count"),
        read_time: row.get("read_time"),
        published: row.get("published"),
        featured: row.get("featured"),
        author_id: row.get("author_id"),
        author,
        published_at: row.get("published_at"),
        created_at: row.get("created_at"),
        updated_at: row.get("updated_at"),
        likes_count: Some(row.get("likes_count")),
        tags,
    }
}
