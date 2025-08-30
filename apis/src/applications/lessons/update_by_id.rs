use crate::pkg::error::{AppError, AppResult};
use crate::repositories::lessons::{LessonsRepository, UpdateLessonRecord};
use crate::types::course_types::{Lesson, UpdateLessonRequest};

/// Update a lesson partially and return updated Lesson
pub async fn update_lesson_by_id(
    repo: &dyn LessonsRepository,
    id: uuid::Uuid,
    input: UpdateLessonRequest,
) -> AppResult<Lesson> {
    let updated = repo
        .update_partial(
            id,
            UpdateLessonRecord {
                title: input.title,
                description: input.description,
                content: input.content,
                video_url: input.video_url,
                duration: input.duration,
                position: input.position,
                is_free: input.is_free,
                published: input.published,
            },
        )
        .await?;
    let lesson = updated.ok_or_else(|| AppError::NotFound("Lesson not found".into()))?;
    Ok(Lesson::from(lesson))
}
