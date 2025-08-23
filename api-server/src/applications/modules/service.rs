use crate::pkg::error::{AppError, AppResult};
use crate::repositories::modules::{CreateModuleRecord, ModulesRepository, UpdateModuleRecord};
use crate::types::course_types::{CourseModule, CreateModuleRequest, UpdateModuleRequest};

fn map_module(rec: crate::repositories::modules::ModuleRecord) -> CourseModule {
    CourseModule {
        id: rec.id,
        course_id: rec.course_id,
        title: rec.title,
        description: rec.description,
        position: rec.position,
        created_at: rec.created_at,
        updated_at: rec.updated_at,
    }
}

pub async fn list_modules_by_course(
    repo: &dyn ModulesRepository,
    course_id: uuid::Uuid,
) -> AppResult<Vec<CourseModule>> {
    let items = repo.list_by_course(course_id).await?;
    Ok(items.into_iter().map(map_module).collect())
}

pub async fn create_module(
    repo: &dyn ModulesRepository,
    input: CreateModuleRequest,
) -> AppResult<uuid::Uuid> {
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

pub async fn update_module(
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
    Ok(map_module(module))
}

pub async fn delete_module(repo: &dyn ModulesRepository, id: uuid::Uuid) -> AppResult<()> {
    repo.delete_by_id(id).await
}
