use crate::pkg::error::AppResult;
use crate::repositories::course_categories::CourseCategoriesRepository;

pub async fn attach(repo: &dyn CourseCategoriesRepository, course_id: uuid::Uuid, category_id: i32) -> AppResult<()> {
    repo.attach(course_id, category_id).await
}

pub async fn detach(repo: &dyn CourseCategoriesRepository, course_id: uuid::Uuid, category_id: i32) -> AppResult<()> {
    repo.detach(course_id, category_id).await
}

pub async fn list_categories_for_course(repo: &dyn CourseCategoriesRepository, course_id: uuid::Uuid) -> AppResult<Vec<i32>> {
    repo.list_categories_for_course(course_id).await
}

pub async fn list_courses_for_category(repo: &dyn CourseCategoriesRepository, category_id: i32) -> AppResult<Vec<uuid::Uuid>> {
    repo.list_courses_for_category(category_id).await
}


