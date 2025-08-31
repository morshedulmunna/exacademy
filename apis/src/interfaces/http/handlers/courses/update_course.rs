use axum::{Extension, Json, extract::Path, http::StatusCode};
use axum_extra::extract::Multipart;

use crate::applications::courses as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::pkg::upload;
use crate::types::course_types::{Course, UpdateCourseRequest};

#[utoipa::path(
    patch,
    path = "/api/courses/:id",
    request_body = UpdateCourseRequest,
    responses((status = 200, description = "Updated course", body = Course)),
    tag = "Courses"
)]
pub async fn update_course(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<uuid::Uuid>,
    mut multipart: Multipart,
) -> AppResult<(StatusCode, Json<Response<Course>>)> {
    let mut title: Option<String> = None;
    let mut description: Option<String> = None;
    let mut excerpt: Option<String> = None;
    let mut thumbnail: Option<String> = None;
    let mut price: Option<f64> = None;
    let mut original_price: Option<f64> = None;
    let mut duration: Option<String> = None;
    let mut lessons: Option<i32> = None;
    let mut published: Option<bool> = None;
    let mut featured: Option<bool> = None;
    let mut outcomes: Option<Vec<String>> = None;

    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?
    {
        let name = field.name().map(|s| s.to_string());
        match name.as_deref() {
            Some("title") => {
                title = Some(
                    field
                        .text()
                        .await
                        .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?,
                )
            }
            Some("description") => {
                description = Some(
                    field
                        .text()
                        .await
                        .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?,
                )
            }
            Some("excerpt") => {
                excerpt = Some(
                    field
                        .text()
                        .await
                        .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?,
                )
            }
            Some("thumbnail") | Some("file") => {
                let file_name = field.file_name().map(|s| s.to_string());
                let bytes = field
                    .bytes()
                    .await
                    .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?;
                if bytes.len() > 10 * 1024 * 1024 {
                    return Err(crate::pkg::error::AppError::BadRequest(
                        "File size exceeds 10MB limit".into(),
                    ));
                }
                let relative_path = upload::save_bytes(&bytes, file_name.as_deref()).await?;
                let base_url = format!("http://{}:{}", ctx.system.api_host, ctx.system.api_port);
                thumbnail = Some(format!("{}{}", base_url, relative_path));
            }
            Some("thumbnail_url") => {
                thumbnail = Some(
                    field
                        .text()
                        .await
                        .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?,
                );
            }
            Some("price") => {
                let v = field
                    .text()
                    .await
                    .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?;
                price = v.parse::<f64>().ok();
            }
            Some("original_price") => {
                let v = field
                    .text()
                    .await
                    .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?;
                original_price = v.parse::<f64>().ok();
            }
            Some("duration") => {
                duration = Some(
                    field
                        .text()
                        .await
                        .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?,
                )
            }
            Some("lessons") => {
                let v = field
                    .text()
                    .await
                    .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?;
                lessons = v.parse::<i32>().ok();
            }
            Some("published") => {
                let v = field
                    .text()
                    .await
                    .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?;
                published = Some(matches!(v.as_str(), "true" | "1" | "on"));
            }
            Some("featured") => {
                let v = field
                    .text()
                    .await
                    .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?;
                featured = Some(matches!(v.as_str(), "true" | "1" | "on"));
            }
            Some("outcomes") => {
                let v = field
                    .text()
                    .await
                    .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?;
                outcomes = serde_json::from_str::<Vec<String>>(&v).ok().or_else(|| {
                    Some(
                        v.split(',')
                            .map(|s| s.trim().to_string())
                            .filter(|s| !s.is_empty())
                            .collect(),
                    )
                });
            }
            _ => {}
        }
    }

    let input = UpdateCourseRequest {
        title,
        description,
        excerpt,
        thumbnail,
        price,
        original_price,
        duration,
        lessons,
        students: None,
        published,
        featured,
        outcomes,
    };

    let course = service::update_course_by_id(ctx.repos.courses.as_ref(), id, input).await?;
    let body = Response::with_data("Updated course", course, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}
