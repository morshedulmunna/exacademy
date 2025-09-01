use crate::pkg::error::AppResult;

#[derive(Debug, Clone)]
pub struct CategoryRecord {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Clone)]
pub struct CreateCategoryRecord {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Default, Clone)]
pub struct UpdateCategoryRecord {
    pub name: Option<String>,
    pub description: Option<String>,
}

#[async_trait::async_trait]
pub trait CategoriesRepository: Send + Sync {
    async fn create(&self, input: CreateCategoryRecord) -> AppResult<i32>;
    async fn list_all(&self) -> AppResult<Vec<CategoryRecord>>;
    async fn find_by_id(&self, id: i32) -> AppResult<Option<CategoryRecord>>;
    async fn update_partial(
        &self,
        id: i32,
        input: UpdateCategoryRecord,
    ) -> AppResult<Option<CategoryRecord>>;
    async fn delete_by_id(&self, id: i32) -> AppResult<()>;
}
