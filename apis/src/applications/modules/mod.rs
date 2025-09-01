//! Module application services - split by function files

pub mod create;
pub mod delete_by_id;
pub mod list_by_course;
pub mod list_by_course_deep;
pub mod update_by_id;
pub mod deep_create;

pub use create::create_module;
pub use delete_by_id::delete_module_by_id as delete_module;
pub use list_by_course::list_modules_by_course;
pub use list_by_course_deep::list_modules_by_course_deep;
pub use update_by_id::update_module_by_id as update_module;

use crate::repositories::modules::ModuleRecord;
use crate::types::course_types::CourseModule;

impl From<ModuleRecord> for CourseModule {
    fn from(rec: ModuleRecord) -> Self {
        CourseModule {
            id: rec.id,
            course_id: rec.course_id,
            title: rec.title,
            description: rec.description,
            position: rec.position,
            created_at: rec.created_at,
            updated_at: rec.updated_at,
        }
    }
}
