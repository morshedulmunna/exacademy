use crate::pkg::error::AppResult;
use crate::repositories::categories::{CategoriesRepository, CategoryRecord, CreateCategoryRecord, UpdateCategoryRecord};
use crate::types::course_types::{Category, CreateCategoryRequest, UpdateCategoryRequest};

pub async fn create(repo: &dyn CategoriesRepository, input: CreateCategoryRequest) -> AppResult<i32> {
    repo.create(CreateCategoryRecord { name: input.name, description: input.description }).await
}

pub async fn list_all(repo: &dyn CategoriesRepository) -> AppResult<Vec<Category>> {
    let rows = repo.list_all().await?;
    Ok(rows.into_iter().map(map).collect())
}

pub async fn get_by_id(repo: &dyn CategoriesRepository, id: i32) -> AppResult<Option<Category>> {
    let row = repo.find_by_id(id).await?;
    Ok(row.map(map))
}

pub async fn update_by_id(repo: &dyn CategoriesRepository, id: i32, input: UpdateCategoryRequest) -> AppResult<Option<Category>> {
    let row = repo.update_partial(id, UpdateCategoryRecord { name: input.name, description: input.description }).await?;
    Ok(row.map(map))
}

pub async fn delete_by_id(repo: &dyn CategoriesRepository, id: i32) -> AppResult<()> {
    repo.delete_by_id(id).await
}

fn map(r: CategoryRecord) -> Category {
    Category { id: r.id, name: r.name, description: r.description }
}


