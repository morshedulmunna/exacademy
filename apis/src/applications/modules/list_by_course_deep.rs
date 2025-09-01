use crate::pkg::error::AppResult;
use crate::repositories::modules::{LessonDeepRecord, ModuleDeepRecord, ModulesRepository};
use crate::types::course_types::{
    CourseModule, Lesson, LessonAssignment, LessonContent, LessonDeep, LessonQuestion, ModuleDeep,
    QuestionOption, QuestionWithOptions,
};

/// List all modules for a course with their nested lessons, contents, questions, and assignments
pub async fn list_modules_by_course_deep(
    repo: &dyn ModulesRepository,
    course_id: uuid::Uuid,
) -> AppResult<Vec<ModuleDeep>> {
    let records = repo.list_by_course_deep(course_id).await?;
    Ok(records.into_iter().map(map_module_deep).collect())
}

fn map_module_deep(r: ModuleDeepRecord) -> ModuleDeep {
    ModuleDeep {
        module: CourseModule {
            id: r.module.id,
            course_id: r.module.course_id,
            title: r.module.title,
            description: r.module.description,
            position: r.module.position,
            created_at: r.module.created_at,
            updated_at: r.module.updated_at,
        },
        lessons: r.lessons.into_iter().map(map_lesson_deep).collect(),
    }
}

fn map_lesson_deep(r: LessonDeepRecord) -> LessonDeep {
    LessonDeep {
        lesson: Lesson {
            id: r.lesson.id,
            module_id: r.lesson.module_id,
            title: r.lesson.title,
            description: r.lesson.description,
            content: r.lesson.content,
            video_url: r.lesson.video_url,
            duration: r.lesson.duration,
            position: r.lesson.position,
            is_free: r.lesson.is_free,
            published: r.lesson.published,
            created_at: r.lesson.created_at,
            updated_at: r.lesson.updated_at,
        },
        contents: r
            .contents
            .into_iter()
            .map(|c| LessonContent {
                id: c.id,
                lesson_id: c.lesson_id,
                title: c.title,
                content_type: c.content_type,
                url: c.url,
                file_size: c.file_size,
                filename: c.filename,
                position: c.position,
                created_at: c.created_at,
                updated_at: c.updated_at,
            })
            .collect(),
        questions: r
            .questions
            .into_iter()
            .map(|(q, opts)| QuestionWithOptions {
                question: LessonQuestion {
                    id: q.id,
                    lesson_id: q.lesson_id,
                    question_text: q.question_text,
                    position: q.position,
                    created_at: q.created_at,
                    updated_at: q.updated_at,
                },
                options: opts
                    .into_iter()
                    .map(|o| QuestionOption {
                        id: o.id,
                        question_id: o.question_id,
                        option_text: o.option_text,
                        is_correct: o.is_correct,
                        position: o.position,
                        created_at: o.created_at,
                        updated_at: o.updated_at,
                    })
                    .collect(),
            })
            .collect(),
        assignment: r.assignment.map(|a| LessonAssignment {
            lesson_id: a.lesson_id,
            title: a.title,
            description: a.description,
            created_at: a.created_at,
            updated_at: a.updated_at,
        }),
    }
}
