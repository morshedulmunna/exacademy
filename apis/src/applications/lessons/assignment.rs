use crate::pkg::error::AppResult;
use crate::repositories::lesson_assignments::{LessonAssignmentRecord, LessonAssignmentsRepository, UpsertLessonAssignmentRecord};
use crate::types::course_types::{LessonAssignment, UpsertLessonAssignmentRequest};

pub async fn upsert(repo: &dyn LessonAssignmentsRepository, input: UpsertLessonAssignmentRequest) -> AppResult<uuid::Uuid> {
    repo
        .upsert(UpsertLessonAssignmentRecord {
            lesson_id: input.lesson_id,
            title: input.title,
            description: input.description,
        })
        .await
}

pub async fn get(repo: &dyn LessonAssignmentsRepository, lesson_id: uuid::Uuid) -> AppResult<Option<LessonAssignment>> {
    let row = repo.find_by_lesson(lesson_id).await?;
    Ok(row.map(map))
}

pub async fn delete(repo: &dyn LessonAssignmentsRepository, lesson_id: uuid::Uuid) -> AppResult<()> {
    repo.delete(lesson_id).await
}

fn map(r: LessonAssignmentRecord) -> LessonAssignment {
    LessonAssignment {
        lesson_id: r.lesson_id,
        title: r.title,
        description: r.description,
        created_at: r.created_at,
        updated_at: r.updated_at,
    }
}


