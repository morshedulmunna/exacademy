use axum::{Extension, Json, http::StatusCode};
use axum_extra::extract::Multipart;

use crate::applications::courses as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::auth::AuthUser;
use crate::pkg::error::AppResult;
use crate::pkg::upload;
use crate::types::course_types::CreateCourseRequest;
use validator::Validate;

#[utoipa::path(
    post,
    path = "/api/courses",
    request_body = CreateCourseRequest,
    responses((status = 201, description = "Created course", body = uuid::Uuid)),
    tag = "Courses"
)]
pub async fn create_course(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    auth_user: AuthUser,
    mut multipart: Multipart,
) -> AppResult<(StatusCode, Json<Response<uuid::Uuid>>)> {
    // Fields parsed from multipart
    let mut slug: Option<String> = None;
    let mut title: Option<String> = None;
    let mut description: Option<String> = None;
    let mut excerpt: Option<String> = None;
    let mut price: Option<f64> = None;
    let mut original_price: Option<f64> = None;
    let mut duration: Option<String> = None;
    let mut featured: Option<bool> = None;
    let mut published: Option<bool> = None;
    let mut status: Option<String> = None;
    let mut outcomes: Option<Vec<String>> = None;
    let mut thumbnail_url: Option<String> = None;

    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?
    {
        let name = field.name().map(|s| s.to_string());
        match name.as_deref() {
            Some("slug") => {
                slug = Some(
                    field
                        .text()
                        .await
                        .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?,
                )
            }
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
            Some("featured") => {
                let v = field
                    .text()
                    .await
                    .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?;
                featured = Some(matches!(v.as_str(), "true" | "1" | "on"));
            }
            Some("published") => {
                let v = field
                    .text()
                    .await
                    .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?;
                published = Some(matches!(v.as_str(), "true" | "1" | "on"));
            }
            Some("status") => {
                status = Some(
                    field
                        .text()
                        .await
                        .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?,
                )
            }
            Some("outcomes") => {
                let v = field
                    .text()
                    .await
                    .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?;
                // Expect a JSON array string, fallback to comma-separated
                outcomes = serde_json::from_str::<Vec<String>>(&v).ok().or_else(|| {
                    Some(
                        v.split(',')
                            .map(|s| s.trim().to_string())
                            .filter(|s| !s.is_empty())
                            .collect(),
                    )
                });
            }
            Some("thumbnail") | Some("file") => {
                let file_name = field.file_name().map(|s| s.to_string());
                let bytes = field
                    .bytes()
                    .await
                    .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?;
                // 10MB limit similar to media upload
                if bytes.len() > 10 * 1024 * 1024 {
                    return Err(crate::pkg::error::AppError::BadRequest(
                        "File size exceeds 10MB limit".into(),
                    ));
                }
                let relative_path = upload::save_bytes(&bytes, file_name.as_deref()).await?;
                let base_url = format!("http://{}:{}", ctx.system.api_host, ctx.system.api_port);
                thumbnail_url = Some(format!("{}{}", base_url, relative_path));
            }
            _ => {}
        }
    }

    let input = CreateCourseRequest {
        slug: slug
            .ok_or_else(|| crate::pkg::error::AppError::BadRequest("slug is required".into()))?,
        title: title
            .ok_or_else(|| crate::pkg::error::AppError::BadRequest("title is required".into()))?,
        description: description.ok_or_else(|| {
            crate::pkg::error::AppError::BadRequest("description is required".into())
        })?,
        excerpt,
        thumbnail: thumbnail_url,
        price: price
            .ok_or_else(|| crate::pkg::error::AppError::BadRequest("price is required".into()))?,
        original_price,
        duration: duration.ok_or_else(|| {
            crate::pkg::error::AppError::BadRequest("duration is required".into())
        })?,
        featured: featured.unwrap_or(false),
        published: published.unwrap_or(false),
        status,
        outcomes,
    };

    // Validate according to struct annotations
    input
        .validate()
        .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?;

    let id = service::create_course(ctx.repos.courses.as_ref(), auth_user.user_id, input).await?;
    let body = Response::with_data("Course created", id, StatusCode::CREATED.as_u16());
    Ok((StatusCode::CREATED, Json(body)))
}
