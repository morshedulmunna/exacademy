use crate::pkg::error::{AppError, AppResult};
use crate::repositories::courses::{CoursesRepository, UpdateCourseRecord};
use crate::types::course_types::{Course, UpdateCourseRequest};

/// Update a course partially by id.
pub async fn update_course_by_id(
    repo: &dyn CoursesRepository,
    id: uuid::Uuid,
    input: UpdateCourseRequest,
) -> AppResult<Course> {
    let updated = repo
        .update_partial(
            id,
            UpdateCourseRecord {
                title: input.title,
                description: input.description,
                excerpt: input.excerpt,
                thumbnail: input.thumbnail,
                price: input.price,
                original_price: input.original_price,
                duration: input.duration,
                lessons: input.lessons,
                status: input.status,
                outcomes: input.outcomes,
                category: input.category,
                tags: input.tags,
                featured: input.featured,
            },
        )
        .await?;

    let course = updated.ok_or_else(|| AppError::NotFound("Course not found".into()))?;
    Ok(course.into())
}
