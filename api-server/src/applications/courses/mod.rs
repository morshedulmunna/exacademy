//! Course application services - split by function files

pub mod course_list_by_instructor;
pub mod create;
pub mod delete_by_id;
pub mod get_by_id;
pub mod get_by_slug;
pub mod update_by_id;

pub use course_list_by_instructor::list_courses_paginated_by_instructor;
pub use create::create_course;
pub use delete_by_id::delete_course_by_id;
pub use get_by_id::get_course_by_id;
pub use get_by_slug::get_course_by_slug;
pub use update_by_id::update_course_by_id;

use crate::repositories::courses::{CourseRecord, InstructorSummary};
use crate::types::course_types::{Course, Instructor};

impl From<CourseRecord> for Course {
    fn from(record: CourseRecord) -> Self {
        Course {
            id: record.id,
            slug: record.slug,
            title: record.title,
            description: record.description,
            excerpt: record.excerpt,
            thumbnail: record.thumbnail,
            price: record.price,
            original_price: record.original_price,
            duration: record.duration,
            lessons: record.lessons,
            students: record.students,
            published: record.published,
            featured: record.featured,
            view_count: record.view_count,
            instructor_id: record.instructor_id,
            instructor: record.instructor.map(|ins: InstructorSummary| Instructor {
                id: ins.id,
                username: ins.username,
                full_name: ins.full_name,
                avatar_url: ins.avatar_url,
            }),
            published_at: record.published_at,
            created_at: record.created_at,
            updated_at: record.updated_at,
        }
    }
}
