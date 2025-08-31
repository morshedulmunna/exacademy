use axum::{Extension, Json, extract::Path, http::StatusCode};
use axum_extra::extract::Multipart;

use crate::applications::courses as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::pkg::upload::{LocalFsStorage, Storage};
use crate::pkg::utils::multipart::MultipartForm;
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
    multipart: Multipart,
) -> AppResult<(StatusCode, Json<Response<Course>>)> {
    let form = MultipartForm::parse_with_limit(multipart, ctx.system.max_upload_bytes).await?;

    let title = form.text("title").map(|s| s.to_string());
    let description = form.text("description").map(|s| s.to_string());
    let excerpt = form.text("excerpt").map(|s| s.to_string());
    let price = form.f64("price");
    let original_price = form.f64("original_price");
    let duration = form.text("duration").map(|s| s.to_string());
    let lessons = form.text("lessons").and_then(|v| v.parse::<i32>().ok());
    let published = form.bool("published");
    let featured = form.bool("featured");
    let outcomes = form.json_vec_string("outcomes");

    // Thumbnail can be provided as a file or as a direct URL via "thumbnail_url"
    let mut thumbnail: Option<String> = form.text("thumbnail_url").map(|s| s.to_string());
    if thumbnail.is_none() {
        if let Some(file) = form.file("thumbnail").or_else(|| form.file("file")) {
            let storage = LocalFsStorage::new("./uploads/courses");
            let relative_path = storage
                .save_bytes(&file.data, file.file_name.as_deref())
                .await?;
            let base_url = format!("http://{}:{}", ctx.system.api_host, ctx.system.api_port);
            thumbnail = Some(format!("{}{}", base_url, relative_path));
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
