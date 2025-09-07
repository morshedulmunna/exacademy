use crate::pkg::error::AppResult;

/// Summary of an author joined from users table for embedding in blog post records
#[derive(Debug, Clone)]
pub struct AuthorSummary {
    pub id: uuid::Uuid,
    pub username: String,
    pub full_name: Option<String>,
    pub avatar_url: Option<String>,
}

/// Blog tag information for blog posts
#[derive(Debug, Clone)]
pub struct BlogTag {
    pub id: uuid::Uuid,
    pub name: String,
    pub color: String,
}

/// Domain model for a blog post as persisted in the database layer
#[derive(Debug, Clone)]
pub struct BlogPostRecord {
    pub id: uuid::Uuid,
    pub slug: String,
    pub title: String,
    pub excerpt: Option<String>,
    pub content: String,
    pub cover_image: Option<String>,
    pub view_count: i32,
    pub read_time: i32,
    pub published: bool,
    pub featured: bool,
    pub author_id: Option<uuid::Uuid>,
    pub author: Option<AuthorSummary>,
    pub published_at: Option<chrono::DateTime<chrono::Utc>>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
    pub likes_count: Option<i64>,
    pub tags: Option<Vec<BlogTag>>,
}

/// Input for creating a blog post in the repository
#[derive(Debug, Clone)]
pub struct CreateBlogPostRecord {
    pub slug: String,
    pub title: String,
    pub excerpt: Option<String>,
    pub content: String,
    pub cover_image: Option<String>,
    pub published: bool,
    pub featured: bool,
    pub author_id: Option<uuid::Uuid>,
    pub published_at: Option<chrono::DateTime<chrono::Utc>>,
}

/// Input for updating blog post fields
#[derive(Debug, Default, Clone)]
pub struct UpdateBlogPostRecord {
    pub title: Option<String>,
    pub excerpt: Option<String>,
    pub content: Option<String>,
    pub cover_image: Option<String>,
    pub published: Option<bool>,
    pub featured: Option<bool>,
    pub published_at: Option<chrono::DateTime<chrono::Utc>>,
}

/// Pagination parameters for blog post listing
#[derive(Debug, Clone)]
pub struct BlogPostPagination {
    pub page: i64,
    pub limit: i64,
    pub total: i64,
    pub pages: i64,
}

/// Blog post listing result with pagination
#[derive(Debug, Clone)]
pub struct BlogPostListResult {
    pub posts: Vec<BlogPostRecord>,
    pub pagination: BlogPostPagination,
}

/// Search and filter parameters for blog posts
#[derive(Debug, Clone)]
pub struct BlogPostFilters {
    pub search: Option<String>,
    pub tag: Option<String>,
    pub author_id: Option<uuid::Uuid>,
    pub published: Option<bool>,
    pub featured: Option<bool>,
}

#[async_trait::async_trait]
pub trait BlogPostsRepository: Send + Sync {
    /// Create a new blog post
    async fn create(&self, input: CreateBlogPostRecord) -> AppResult<uuid::Uuid>;

    /// Find blog post by ID
    async fn find_by_id(&self, id: uuid::Uuid) -> AppResult<Option<BlogPostRecord>>;

    /// Find blog post by slug with aggregated data (likes, tags, author)
    async fn find_by_slug_with_aggregates(&self, slug: &str) -> AppResult<Option<BlogPostRecord>>;

    /// List blog posts with pagination and filters
    async fn list_paginated(
        &self,
        filters: BlogPostFilters,
        page: i64,
        limit: i64,
    ) -> AppResult<BlogPostListResult>;

    /// Update blog post partially by ID
    async fn update_partial(
        &self,
        id: uuid::Uuid,
        input: UpdateBlogPostRecord,
    ) -> AppResult<Option<BlogPostRecord>>;

    /// Delete blog post by ID
    async fn delete_by_id(&self, id: uuid::Uuid) -> AppResult<()>;

    /// Increment view count for a blog post
    async fn increment_view_count(&self, id: uuid::Uuid) -> AppResult<()>;

    /// Get featured blog posts
    async fn find_featured(&self, limit: i64) -> AppResult<Vec<BlogPostRecord>>;

    /// Get recent blog posts
    async fn find_recent(&self, limit: i64) -> AppResult<Vec<BlogPostRecord>>;

    /// Get blog posts by author with pagination
    async fn list_by_author_paginated(
        &self,
        author_id: uuid::Uuid,
        page: i64,
        limit: i64,
    ) -> AppResult<BlogPostListResult>;
}
