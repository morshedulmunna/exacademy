use crate::pkg::error::AppResult;
use crate::repositories::courses::CoursesRepository;
use crate::types::course_types::Course;

/// List all courses for an instructor.
pub async fn list_courses(
    repo: &dyn CoursesRepository,
    instructor_id: uuid::Uuid,
) -> AppResult<Vec<Course>> {
    let records = repo.list_by_instructor(instructor_id).await?;
    Ok(records.into_iter().map(Into::into).collect())
}
