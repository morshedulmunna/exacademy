use crate::pkg::error::AppResult;
use crate::repositories::modules::ModulesRepository;

/// Delete a module by id
pub async fn delete_module_by_id(repo: &dyn ModulesRepository, id: uuid::Uuid) -> AppResult<()> {
    repo.delete_by_id(id).await
}


