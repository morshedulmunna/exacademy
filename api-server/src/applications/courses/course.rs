use crate::pkg::error::{AppError, AppResult};
use crate::repositories::courses::{
    CourseRecord, CoursesRepository, CreateCourseRecord, UpdateCourseRecord,
};
use crate::types::course_types::{
    Course, CreateCourseRequest, Page, PageMeta, UpdateCourseRequest,
};

fn map_course(record: CourseRecord) -> Course {
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
        published_at: record.published_at,
        created_at: record.created_at,
        updated_at: record.updated_at,
    }
}

pub async fn create_course(
    repo: &dyn CoursesRepository,
    instructor_id: uuid::Uuid,
    input: CreateCourseRequest,
) -> AppResult<uuid::Uuid> {
    let id = repo
        .create(CreateCourseRecord {
            slug: input.slug,
            title: input.title,
            description: input.description,
            excerpt: input.excerpt,
            thumbnail: input.thumbnail,
            price: input.price,
            original_price: input.original_price,
            duration: input.duration,
            lessons: input.lessons,
            featured: input.featured,
            instructor_id: Some(instructor_id),
        })
        .await?;
    Ok(id)
}

pub async fn get_course_by_id(repo: &dyn CoursesRepository, id: uuid::Uuid) -> AppResult<Course> {
    let course = repo
        .find_by_id(id)
        .await?
        .ok_or_else(|| AppError::NotFound("Course not found".into()))?;
    Ok(map_course(course))
}

pub async fn list_courses(repo: &dyn CoursesRepository) -> AppResult<Vec<Course>> {
    let records = repo.list_all().await?;
    Ok(records.into_iter().map(map_course).collect())
}

pub async fn list_courses_paginated(
    repo: &dyn CoursesRepository,
    page: i64,
    per_page: i64,
) -> AppResult<Page<Course>> {
    let safe_page = if page < 1 { 1 } else { page };
    let safe_per_page = if per_page < 1 { 10 } else { per_page.min(100) };
    let offset = (safe_page - 1) * safe_per_page;

    let (records, total) = repo.list_paginated(offset, safe_per_page).await?;
    let items: Vec<Course> = records.into_iter().map(map_course).collect();
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

pub async fn get_course_by_slug(repo: &dyn CoursesRepository, slug: &str) -> AppResult<Course> {
    let course = repo
        .find_by_slug(slug)
        .await?
        .ok_or_else(|| AppError::NotFound("Course not found".into()))?;
    Ok(map_course(course))
}

pub async fn update_course_by_id(
    repo: &dyn CoursesRepository,
    id: uuid::Uuid,
    input: UpdateCourseRequest,
) -> AppResult<Course> {
    let updated = repo
        .update_partial(
            id,
            UpdateCourseRecord {
                title: input.title,
                description: input.description,
                excerpt: input.excerpt,
                thumbnail: input.thumbnail,
                price: input.price,
                original_price: input.original_price,
                duration: input.duration,
                lessons: input.lessons,
                students: input.students,
                published: input.published,
                featured: input.featured,
            },
        )
        .await?;

    let course = updated.ok_or_else(|| AppError::NotFound("Course not found".into()))?;
    Ok(map_course(course))
}

pub async fn delete_course_by_id(repo: &dyn CoursesRepository, id: uuid::Uuid) -> AppResult<()> {
    repo.delete_by_id(id).await
}
