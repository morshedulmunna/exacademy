use crate::pkg::error::AppResult;
use crate::repositories::lessons::LessonsRepository;
use crate::types::course_types::Lesson;

/// List lessons for a module ordered by position/created_at
pub async fn list_lessons_by_module(
    repo: &dyn LessonsRepository,
    module_id: uuid::Uuid,
) -> AppResult<Vec<Lesson>> {
    let items = repo.list_by_module(module_id).await?;
    Ok(items.into_iter().map(Lesson::from).collect())
}
