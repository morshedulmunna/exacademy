use crate::pkg::error::AppResult;
use crate::repositories::modules::{
    CreateLessonAssignmentData, CreateLessonDeepData, CreateLessonQuestionData,
    CreateLessonQuestionOptionData, CreateModuleDeepRecord, LessonDeepRecord, ModuleDeepRecord,
};
use crate::types::course_types::{
    CourseModule, CreateLessonDeepRequest, CreateModuleDeepRequest, Lesson, LessonContent,
    LessonDeep, LessonQuestion, ModuleDeep, QuestionOption, QuestionWithOptions,
};

/// Create a module with nested lessons/contents/questions/assignment in one ACID operation
pub async fn create_deep(
    repo: &dyn crate::repositories::modules::ModulesRepository,
    course_id: uuid::Uuid,
    req: CreateModuleDeepRequest,
) -> AppResult<ModuleDeep> {
    let record = repo
        .create_deep(CreateModuleDeepRecord {
            course_id: course_id,
            title: req.title,
            description: req.description,
            position: req.position,
            lessons: req
                .lessons
                .into_iter()
                .map(map_lesson_deep_request)
                .collect(),
        })
        .await?;
    Ok(map_module_deep(record))
}

fn map_lesson_deep_request(r: CreateLessonDeepRequest) -> CreateLessonDeepData {
    CreateLessonDeepData {
        title: r.title,
        description: r.description,
        content: r.content,
        video_url: r.video_url,
        duration: r.duration,
        position: r.position,
        is_free: r.is_free,
        published: r.published,
        contents: r
            .contents
            .into_iter()
            .map(|c| crate::repositories::modules::CreateLessonContentData {
                title: c.title,
                content_type: c.content_type,
                url: c.url,
                file_size: c.file_size,
                filename: c.filename,
                position: c.position,
            })
            .collect(),
        questions: r
            .questions
            .into_iter()
            .map(|q| CreateLessonQuestionData {
                question_text: q.question_text,
                position: q.position,
                options: q
                    .options
                    .into_iter()
                    .map(|o| CreateLessonQuestionOptionData {
                        option_text: o.option_text,
                        is_correct: o.is_correct,
                        position: o.position,
                    })
                    .collect(),
            })
            .collect(),
        assignment: r.assignment.map(|a| CreateLessonAssignmentData {
            title: a.title,
            description: a.description,
        }),
    }
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
        assignment: r
            .assignment
            .map(|a| crate::types::course_types::LessonAssignment {
                lesson_id: a.lesson_id,
                title: a.title,
                description: a.description,
                created_at: a.created_at,
                updated_at: a.updated_at,
            }),
    }
}
