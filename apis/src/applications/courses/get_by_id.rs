use crate::pkg::error::{AppError, AppResult};
use crate::repositories::courses::CoursesRepository;
use crate::types::course_types::Course;

/// Fetch a course by its id.
pub async fn get_course_by_id(repo: &dyn CoursesRepository, id: uuid::Uuid) -> AppResult<Course> {
    let course = repo
        .find_by_id(id)
        .await?
        .ok_or_else(|| AppError::NotFound("Course not found".into()))?;
    Ok(course.into())
}
