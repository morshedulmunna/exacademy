use crate::pkg::error::AppResult;
use crate::repositories::modules::ModulesRepository;
use crate::types::course_types::{BulkUpdateModulePositionsRequest, CourseModule};

/// Bulk update module positions for a course
pub async fn bulk_update_module_positions(
    repo: &dyn ModulesRepository,
    input: BulkUpdateModulePositionsRequest,
) -> AppResult<Vec<CourseModule>> {
    // Validate that all modules belong to the specified course
    let updated_modules = repo
        .bulk_update_positions(input.course_id, input.modules)
        .await?;

    // Convert to CourseModule format
    let course_modules: Vec<CourseModule> = updated_modules
        .into_iter()
        .map(CourseModule::from)
        .collect();

    Ok(course_modules)
}
