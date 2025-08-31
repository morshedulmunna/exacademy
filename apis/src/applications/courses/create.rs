use crate::pkg::error::AppResult;
use crate::repositories::courses::{CoursesRepository, CreateCourseRecord};
use crate::types::course_types::CreateCourseRequest;

/// Create a new course and return its id.
pub async fn create_course(
    repo: &dyn CoursesRepository,
    instructor_id: uuid::Uuid,
    input: CreateCourseRequest,
) -> AppResult<String> {
    let slug = repo
        .create(CreateCourseRecord {
            slug: input.slug,
            title: input.title,
            description: input.description,
            excerpt: input.excerpt,
            thumbnail: input.thumbnail,
            price: input.price,
            original_price: input.original_price,
            duration: input.duration,
            featured: input.featured,
            published: input.published,
            status: Some(input.status.unwrap_or("draft".to_string())),
            instructor_id,
            // Ensure NOT NULL constraint: default to empty array when missing
            outcomes: Some(input.outcomes.unwrap_or_default()),
        })
        .await?;
    Ok(slug)
}
