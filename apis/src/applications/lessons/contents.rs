use crate::pkg::error::AppResult;
use crate::repositories::lesson_contents::{CreateLessonContentRecord, LessonContentRecord, LessonContentsRepository, UpdateLessonContentRecord};
use crate::types::course_types::{CreateLessonContentRequest, LessonContent, UpdateLessonContentRequest};

/// Create content for a lesson
pub async fn create_content(repo: &dyn LessonContentsRepository, input: CreateLessonContentRequest) -> AppResult<uuid::Uuid> {
    let id = repo
        .create(CreateLessonContentRecord {
            lesson_id: input.lesson_id,
            title: input.title,
            content_type: input.content_type,
            url: input.url,
            file_size: input.file_size,
            filename: input.filename,
            position: input.position,
        })
        .await?;
    Ok(id)
}

/// List lesson contents by lesson id
pub async fn list_contents(repo: &dyn LessonContentsRepository, lesson_id: uuid::Uuid) -> AppResult<Vec<LessonContent>> {
    let rows = repo.list_by_lesson(lesson_id).await?;
    Ok(rows.into_iter().map(map_content).collect())
}

/// Update a content by id
pub async fn update_content(repo: &dyn LessonContentsRepository, id: uuid::Uuid, input: UpdateLessonContentRequest) -> AppResult<Option<LessonContent>> {
    let updated = repo
        .update_partial(
            id,
            UpdateLessonContentRecord {
                title: input.title,
                content_type: input.content_type,
                url: input.url,
                file_size: input.file_size,
                filename: input.filename,
                position: input.position,
            },
        )
        .await?;
    Ok(updated.map(map_content))
}

/// Delete a content by id
pub async fn delete_content(repo: &dyn LessonContentsRepository, id: uuid::Uuid) -> AppResult<()> {
    repo.delete_by_id(id).await
}

fn map_content(r: LessonContentRecord) -> LessonContent {
    LessonContent {
        id: r.id,
        lesson_id: r.lesson_id,
        title: r.title,
        content_type: r.content_type,
        url: r.url,
        file_size: r.file_size,
        filename: r.filename,
        position: r.position,
        created_at: r.created_at,
        updated_at: r.updated_at,
    }
}


