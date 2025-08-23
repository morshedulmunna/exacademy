use crate::pkg::error::{AppError, AppResult};
use crate::repositories::lessons::{CreateLessonRecord, LessonsRepository, UpdateLessonRecord};
use crate::types::course_types::{CreateLessonRequest, Lesson, UpdateLessonRequest};

fn map_lesson(rec: crate::repositories::lessons::LessonRecord) -> Lesson {
    Lesson {
        id: rec.id,
        module_id: rec.module_id,
        title: rec.title,
        description: rec.description,
        content: rec.content,
        video_url: rec.video_url,
        duration: rec.duration,
        position: rec.position,
        is_free: rec.is_free,
        published: rec.published,
        created_at: rec.created_at,
        updated_at: rec.updated_at,
    }
}

pub async fn list_lessons_by_module(repo: &dyn LessonsRepository, module_id: uuid::Uuid) -> AppResult<Vec<Lesson>> {
    let items = repo.list_by_module(module_id).await?;
    Ok(items.into_iter().map(map_lesson).collect())
}

pub async fn create_lesson(repo: &dyn LessonsRepository, input: CreateLessonRequest) -> AppResult<uuid::Uuid> {
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

pub async fn update_lesson(repo: &dyn LessonsRepository, id: uuid::Uuid, input: UpdateLessonRequest) -> AppResult<Lesson> {
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
    Ok(map_lesson(lesson))
}

pub async fn delete_lesson(repo: &dyn LessonsRepository, id: uuid::Uuid) -> AppResult<()> {
    repo.delete_by_id(id).await
}


