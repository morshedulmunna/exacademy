use crate::pkg::error::AppResult;
use crate::repositories::courses::CoursesRepository;
use crate::types::course_types::{Course, Page, PageMeta};

/// Get all courses with pagination
///
/// Fetches all courses from the database with optional pagination.
/// Returns a vector of Course domain objects.
pub async fn get_all_course(
    repo: &dyn CoursesRepository,
    page: i64,
    per_page: i64,
) -> AppResult<Page<Course>> {
    let safe_page = if page < 1 { 1 } else { page };
    let safe_per_page = if per_page < 1 { 10 } else { per_page.min(100) };
    let offset = (safe_page - 1) * safe_per_page;

    let (course_records, total) = repo.list_all(offset, safe_per_page).await?;

    // Convert CourseRecord to Course domain objects
    let courses = course_records.into_iter().map(Course::from).collect();

    let total_pages = if total == 0 {
        1
    } else {
        (total + safe_per_page - 1) / safe_per_page
    };

    Ok(Page {
        items: courses,
        meta: PageMeta {
            page: safe_page,
            per_page: safe_per_page,
            total,
            total_pages,
        },
    })
}
