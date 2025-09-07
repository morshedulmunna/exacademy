use crate::pkg::error::AppResult;
use crate::repositories::lessons::LessonsRepository;
use crate::types::course_types::{BulkUpdateLessonPositionsRequest, Lesson};

/// Bulk update lesson positions for a module
pub async fn bulk_update_lesson_positions(
    repo: &dyn LessonsRepository,
    input: BulkUpdateLessonPositionsRequest,
) -> AppResult<Vec<Lesson>> {
    // Validate that all lessons belong to the specified module
    let updated_lessons = repo
        .bulk_update_positions(input.module_id, input.lessons)
        .await?;

    // Convert to Lesson format
    let lessons: Vec<Lesson> = updated_lessons.into_iter().map(Lesson::from).collect();
    
    Ok(lessons)
}
