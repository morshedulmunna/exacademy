use crate::pkg::error::AppResult;
use crate::repositories::lessons::LessonsRepository;

/// Delete a lesson by id
pub async fn delete_lesson_by_id(repo: &dyn LessonsRepository, id: uuid::Uuid) -> AppResult<()> {
    repo.delete_by_id(id).await
}


