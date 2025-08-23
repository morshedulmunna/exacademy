use crate::pkg::error::AppResult;
use crate::repositories::courses::CoursesRepository;

/// Delete a course by id.
pub async fn delete_course_by_id(repo: &dyn CoursesRepository, id: uuid::Uuid) -> AppResult<()> {
    repo.delete_by_id(id).await
}
