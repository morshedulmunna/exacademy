use crate::pkg::error::AppResult;
use crate::repositories::lessons::{CreateLessonRecord, LessonsRepository};
use crate::types::course_types::CreateLessonRequest;

/// Create a new lesson under a module and return its id
pub async fn create_lesson(
    repo: &dyn LessonsRepository,
    input: CreateLessonRequest,
) -> AppResult<uuid::Uuid> {
    let id = repo
        .create(CreateLessonRecord {
            module_id: input.module_id,
            title: input.title,
            description: input.description,
            content: input.content,
            video_url: input.video_url,
            duration: input.duration,
            position: input.position,
            is_free: input.is_free,
            published: input.published,
        })
        .await?;
    Ok(id)
}
