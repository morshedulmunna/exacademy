use crate::pkg::error::AppResult;

#[derive(Debug, Clone)]
pub struct ModuleRecord {
    pub id: uuid::Uuid,
    pub course_id: uuid::Uuid,
    pub title: String,
    pub description: Option<String>,
    pub position: i32,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Clone)]
pub struct CreateModuleRecord {
    pub course_id: uuid::Uuid,
    pub title: String,
    pub description: Option<String>,
    pub position: i32,
}

#[derive(Debug, Default, Clone)]
pub struct UpdateModuleRecord {
    pub title: Option<String>,
    pub description: Option<String>,
    pub position: Option<i32>,
}

#[async_trait::async_trait]
pub trait ModulesRepository: Send + Sync {
    async fn create(&self, input: CreateModuleRecord) -> AppResult<uuid::Uuid>;
    async fn find_by_id(&self, id: uuid::Uuid) -> AppResult<Option<ModuleRecord>>;
    async fn list_by_course(&self, course_id: uuid::Uuid) -> AppResult<Vec<ModuleRecord>>;
    async fn update_partial(
        &self,
        id: uuid::Uuid,
        input: UpdateModuleRecord,
    ) -> AppResult<Option<ModuleRecord>>;
    async fn delete_by_id(&self, id: uuid::Uuid) -> AppResult<()>;
}


