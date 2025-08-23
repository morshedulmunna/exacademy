use crate::pkg::error::AppResult;
use crate::repositories::modules::{CreateModuleRecord, ModulesRepository};
use crate::types::course_types::CreateModuleRequest;

/// Create a new module for a course and return its id
pub async fn create_module(repo: &dyn ModulesRepository, input: CreateModuleRequest) -> AppResult<uuid::Uuid> {
    let id = repo
        .create(CreateModuleRecord {
            course_id: input.course_id,
            title: input.title,
            description: input.description,
            position: input.position,
        })
        .await?;
    Ok(id)
}


