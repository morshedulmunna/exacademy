use crate::pkg::error::{AppError, AppResult};
use crate::repositories::modules::{ModulesRepository, UpdateModuleRecord};
use crate::types::course_types::{CourseModule, UpdateModuleRequest};

/// Update a module partially and return updated CourseModule
pub async fn update_module_by_id(
    repo: &dyn ModulesRepository,
    id: uuid::Uuid,
    input: UpdateModuleRequest,
) -> AppResult<CourseModule> {
    let updated = repo
        .update_partial(
            id,
            UpdateModuleRecord {
                title: input.title,
                description: input.description,
                position: input.position,
            },
        )
        .await?;
    let module = updated.ok_or_else(|| AppError::NotFound("Module not found".into()))?;
    Ok(CourseModule::from(module))
}


