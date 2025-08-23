use crate::pkg::error::AppResult;
use crate::repositories::modules::ModulesRepository;
use crate::types::course_types::CourseModule;

/// List modules for a course ordered by position/created_at
pub async fn list_modules_by_course(repo: &dyn ModulesRepository, course_id: uuid::Uuid) -> AppResult<Vec<CourseModule>> {
    let items = repo.list_by_course(course_id).await?;
    Ok(items.into_iter().map(CourseModule::from).collect())
}


