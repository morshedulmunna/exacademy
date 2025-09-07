use crate::pkg::error::AppResult;

/// Domain model for a blog like as persisted in the database layer
#[derive(Debug, Clone)]
pub struct BlogLikeRecord {
    pub id: uuid::Uuid,
    pub post_id: uuid::Uuid,
    pub user_id: uuid::Uuid,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

/// Input for creating a blog like in the repository
#[derive(Debug, Clone)]
pub struct CreateBlogLikeRecord {
    pub post_id: uuid::Uuid,
    pub user_id: uuid::Uuid,
}

/// Blog like with user information
#[derive(Debug, Clone)]
pub struct BlogLikeWithUser {
    pub id: uuid::Uuid,
    pub post_id: uuid::Uuid,
    pub user_id: uuid::Uuid,
    pub username: String,
    pub full_name: Option<String>,
    pub avatar_url: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[async_trait::async_trait]
pub trait BlogLikesRepository: Send + Sync {
    /// Create a new blog like
    async fn create(&self, input: CreateBlogLikeRecord) -> AppResult<uuid::Uuid>;

    /// Find blog like by post and user ID
    async fn find_by_post_and_user(
        &self,
        post_id: uuid::Uuid,
        user_id: uuid::Uuid,
    ) -> AppResult<Option<BlogLikeRecord>>;

    /// Check if user has liked a specific post
    async fn has_user_liked(&self, post_id: uuid::Uuid, user_id: uuid::Uuid) -> AppResult<bool>;

    /// Get like count for a specific post
    async fn count_by_post(&self, post_id: uuid::Uuid) -> AppResult<i64>;

    /// List likes for a specific post with user information
    async fn list_by_post_with_users(
        &self,
        post_id: uuid::Uuid,
        limit: Option<i64>,
    ) -> AppResult<Vec<BlogLikeWithUser>>;

    /// List likes by user
    async fn list_by_user(&self, user_id: uuid::Uuid) -> AppResult<Vec<BlogLikeRecord>>;

    /// Remove a blog like (unlike)
    async fn remove(&self, post_id: uuid::Uuid, user_id: uuid::Uuid) -> AppResult<()>;

    /// Toggle like status (like if not liked, unlike if liked)
    async fn toggle(&self, post_id: uuid::Uuid, user_id: uuid::Uuid) -> AppResult<bool>;
}
