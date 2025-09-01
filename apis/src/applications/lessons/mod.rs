//! Lesson application services - split by function files

pub mod create;
pub mod delete_by_id;
pub mod list_by_module;
pub mod update_by_id;
pub mod contents;
pub mod questions;
pub mod assignment;

pub use create::create_lesson;
pub use delete_by_id::delete_lesson_by_id as delete_lesson;
pub use list_by_module::list_lessons_by_module;
pub use update_by_id::update_lesson_by_id as update_lesson;

use crate::repositories::lessons::LessonRecord;
use crate::types::course_types::Lesson;

impl From<LessonRecord> for Lesson {
    fn from(rec: LessonRecord) -> Self {
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
}
