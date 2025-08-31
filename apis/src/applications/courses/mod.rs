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

use crate::repositories::courses::CourseRecord;
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
            // students column was removed from DB in migration 0006; expose 0 for now
            students: 0,
            featured: record.featured,
            view_count: record.view_count,
            status: record.status,
            outcomes: record.outcomes,
            category: record.category,
            tags: record.tags,
            instructor_id: record.instructor_id,
            instructor: record.instructor.map(|i| Instructor {
                id: i.id,
                username: i.username,
                full_name: i.full_name,
                avatar_url: i.avatar_url,
                email: i.email,
                role: i.role,
            }),
            published_at: record.published_at,
            created_at: record.created_at,
            updated_at: record.updated_at,
        }
    }
}
