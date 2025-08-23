use crate::pkg::error::AppResult;
use crate::repositories::courses::CoursesRepository;
use crate::types::course_types::{Course, Page, PageMeta};

/// List courses with pagination.
pub async fn list_courses_paginated(
    repo: &dyn CoursesRepository,
    page: i64,
    per_page: i64,
) -> AppResult<Page<Course>> {
    let safe_page = if page < 1 { 1 } else { page };
    let safe_per_page = if per_page < 1 { 10 } else { per_page.min(100) };
    let offset = (safe_page - 1) * safe_per_page;

    let (records, total) = repo.list_paginated(offset, safe_per_page).await?;
    let items: Vec<Course> = records.into_iter().map(Into::into).collect();
    let total_pages = if total == 0 {
        1
    } else {
        (total + safe_per_page - 1) / safe_per_page
    };
    Ok(Page {
        items,
        meta: PageMeta {
            page: safe_page,
            per_page: safe_per_page,
            total,
            total_pages,
        },
    })
}
