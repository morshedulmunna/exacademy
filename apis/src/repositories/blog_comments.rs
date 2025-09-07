use crate::pkg::error::AppResult;

/// Domain model for a blog comment as persisted in the database layer
#[derive(Debug, Clone)]
pub struct BlogCommentRecord {
    pub id: uuid::Uuid,
    pub post_id: uuid::Uuid,
    pub user_id: uuid::Uuid,
    pub parent_id: Option<uuid::Uuid>,
    pub content: String,
    pub approved: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

/// Input for creating a blog comment in the repository
#[derive(Debug, Clone)]
pub struct CreateBlogCommentRecord {
    pub post_id: uuid::Uuid,
    pub user_id: uuid::Uuid,
    pub parent_id: Option<uuid::Uuid>,
    pub content: String,
    pub approved: Option<bool>,
}

/// Input for updating blog comment fields
#[derive(Debug, Default, Clone)]
pub struct UpdateBlogCommentRecord {
    pub content: Option<String>,
    pub approved: Option<bool>,
}

/// Blog comment with user information and nested replies
#[derive(Debug, Clone)]
pub struct BlogCommentWithUser {
    pub id: uuid::Uuid,
    pub post_id: uuid::Uuid,
    pub user_id: uuid::Uuid,
    pub parent_id: Option<uuid::Uuid>,
    pub content: String,
    pub approved: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
    pub username: String,
    pub full_name: Option<String>,
    pub avatar_url: Option<String>,
    pub replies: Vec<BlogCommentWithUser>,
}

/// Pagination parameters for blog comment listing
#[derive(Debug, Clone)]
pub struct BlogCommentPagination {
    pub page: i64,
    pub limit: i64,
    pub total: i64,
    pub pages: i64,
}

/// Blog comment listing result with pagination
#[derive(Debug, Clone)]
pub struct BlogCommentListResult {
    pub comments: Vec<BlogCommentWithUser>,
    pub pagination: BlogCommentPagination,
}

#[async_trait::async_trait]
pub trait BlogCommentsRepository: Send + Sync {
    /// Create a new blog comment
    async fn create(&self, input: CreateBlogCommentRecord) -> AppResult<uuid::Uuid>;

    /// Find blog comment by ID
    async fn find_by_id(&self, id: uuid::Uuid) -> AppResult<Option<BlogCommentRecord>>;

    /// List comments for a specific post with nested structure
    async fn list_by_post_nested(
        &self,
        post_id: uuid::Uuid,
        approved_only: bool,
    ) -> AppResult<Vec<BlogCommentWithUser>>;

    /// List comments for a specific post with pagination
    async fn list_by_post_paginated(
        &self,
        post_id: uuid::Uuid,
        page: i64,
        limit: i64,
        approved_only: bool,
    ) -> AppResult<BlogCommentListResult>;

    /// List comments by user
    async fn list_by_user(&self, user_id: uuid::Uuid) -> AppResult<Vec<BlogCommentRecord>>;

    /// Get comment count for a specific post
    async fn count_by_post(&self, post_id: uuid::Uuid, approved_only: bool) -> AppResult<i64>;

    /// Update blog comment partially by ID
    async fn update_partial(
        &self,
        id: uuid::Uuid,
        input: UpdateBlogCommentRecord,
    ) -> AppResult<Option<BlogCommentRecord>>;

    /// Delete blog comment by ID
    async fn delete_by_id(&self, id: uuid::Uuid) -> AppResult<()>;

    /// Approve a blog comment
    async fn approve(&self, id: uuid::Uuid) -> AppResult<()>;

    /// Reject a blog comment
    async fn reject(&self, id: uuid::Uuid) -> AppResult<()>;

    /// List pending comments for moderation
    async fn list_pending(&self, limit: i64) -> AppResult<Vec<BlogCommentWithUser>>;
}
