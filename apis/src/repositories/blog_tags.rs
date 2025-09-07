use crate::pkg::error::AppResult;

/// Domain model for a blog tag as persisted in the database layer
#[derive(Debug, Clone)]
pub struct BlogTagRecord {
    pub id: uuid::Uuid,
    pub name: String,
    pub color: String,
    pub description: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

/// Input for creating a blog tag in the repository
#[derive(Debug, Clone)]
pub struct CreateBlogTagRecord {
    pub name: String,
    pub color: String,
    pub description: Option<String>,
}

/// Input for updating blog tag fields
#[derive(Debug, Default, Clone)]
pub struct UpdateBlogTagRecord {
    pub name: Option<String>,
    pub color: Option<String>,
    pub description: Option<String>,
}

/// Blog tag with post count for listing
#[derive(Debug, Clone)]
pub struct BlogTagWithCount {
    pub id: uuid::Uuid,
    pub name: String,
    pub color: String,
    pub description: Option<String>,
    pub post_count: i64,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[async_trait::async_trait]
pub trait BlogTagsRepository: Send + Sync {
    /// Create a new blog tag
    async fn create(&self, input: CreateBlogTagRecord) -> AppResult<uuid::Uuid>;

    /// Find blog tag by ID
    async fn find_by_id(&self, id: uuid::Uuid) -> AppResult<Option<BlogTagRecord>>;

    /// Find blog tag by name
    async fn find_by_name(&self, name: &str) -> AppResult<Option<BlogTagRecord>>;

    /// List all blog tags
    async fn list_all(&self) -> AppResult<Vec<BlogTagRecord>>;

    /// List blog tags with post counts
    async fn list_with_counts(&self) -> AppResult<Vec<BlogTagWithCount>>;

    /// Update blog tag partially by ID
    async fn update_partial(
        &self,
        id: uuid::Uuid,
        input: UpdateBlogTagRecord,
    ) -> AppResult<Option<BlogTagRecord>>;

    /// Delete blog tag by ID
    async fn delete_by_id(&self, id: uuid::Uuid) -> AppResult<()>;

    /// Find or create a blog tag by name
    async fn find_or_create(&self, name: &str, color: &str) -> AppResult<BlogTagRecord>;
}
