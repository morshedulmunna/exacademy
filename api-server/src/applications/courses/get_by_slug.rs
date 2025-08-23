use crate::pkg::error::{AppError, AppResult};
use crate::repositories::courses::CoursesRepository;
use crate::types::course_types::Course;

/// Fetch a course by its slug.
pub async fn get_course_by_slug(repo: &dyn CoursesRepository, slug: &str) -> AppResult<Course> {
    let course = repo
        .find_by_slug(slug)
        .await?
        .ok_or_else(|| AppError::NotFound("Course not found".into()))?;
    Ok(course.into())
}
