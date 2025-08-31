use axum::{Extension, Json, http::StatusCode};
use axum_extra::extract::Multipart;

use crate::applications::courses as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::auth::AuthUser;
use crate::pkg::error::AppResult;
use crate::pkg::upload::{LocalFsStorage, Storage};
use crate::pkg::utils::multipart::MultipartForm;
use crate::types::course_types::CreateCourseRequest;
use validator::Validate;

/// Parsed fields for CreateCourse assembled from multipart form.
struct ParsedCreateCourseFields {
    slug: String,
    title: String,
    description: String,
    excerpt: Option<String>,
    price: f64,
    original_price: Option<f64>,
    duration: String,
    featured: bool,
    published: bool,
    status: Option<String>,
    outcomes: Option<Vec<String>>,
}

impl ParsedCreateCourseFields {
    fn from_form(form: &MultipartForm) -> crate::pkg::error::AppResult<Self> {
        Ok(Self {
            slug: form.required_text("slug")?.to_string(),
            title: form.required_text("title")?.to_string(),
            description: form.required_text("description")?.to_string(),
            excerpt: form.text("excerpt").map(|s| s.to_string()),
            price: form.f64("price").ok_or_else(|| {
                crate::pkg::error::AppError::BadRequest("price is required".into())
            })?,
            original_price: form.f64("original_price"),
            duration: form.required_text("duration")?.to_string(),
            featured: form.bool("featured").unwrap_or(false),
            published: form.bool("published").unwrap_or(false),
            status: form.text("status").map(|s| s.to_string()),
            outcomes: form.json_vec_string("outcomes"),
        })
    }
}

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
    multipart: Multipart,
) -> AppResult<(StatusCode, Json<Response<uuid::Uuid>>)> {
    // Use universal multipart parser with configured upload limit
    let form = MultipartForm::parse_with_limit(multipart, ctx.system.max_upload_bytes).await?;
    let parsed = ParsedCreateCourseFields::from_form(&form)?;

    // File handling: support keys "thumbnail" or "file"
    let mut thumbnail_url: Option<String> = None;
    if let Some(file) = form.file("thumbnail").or_else(|| form.file("file")) {
        let storage = LocalFsStorage::new("./uploads/courses");
        let relative_path = storage
            .save_bytes(&file.data, file.file_name.as_deref())
            .await?;
        let base_url = format!("http://{}:{}", ctx.system.api_host, ctx.system.api_port);
        thumbnail_url = Some(format!("{}{}", base_url, relative_path));
    }

    let input = CreateCourseRequest {
        slug: parsed.slug,
        title: parsed.title,
        description: parsed.description,
        excerpt: parsed.excerpt,
        thumbnail: thumbnail_url,
        price: parsed.price,
        original_price: parsed.original_price,
        duration: parsed.duration,
        featured: parsed.featured,
        published: parsed.published,
        status: parsed.status,
        outcomes: parsed.outcomes,
    };

    // Validate according to struct annotations
    input
        .validate()
        .map_err(|e| crate::pkg::error::AppError::BadRequest(e.to_string()))?;

    let id = service::create_course(ctx.repos.courses.as_ref(), auth_user.user_id, input).await?;
    let body = Response::with_data("Course created", id, StatusCode::CREATED.as_u16());
    Ok((StatusCode::CREATED, Json(body)))
}
