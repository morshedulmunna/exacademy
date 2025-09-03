use utoipa::openapi::security::{HttpAuthScheme, HttpBuilder, SecurityScheme};
use utoipa::{Modify, OpenApi};

/// Central OpenAPI document for execute_academy HTTP API.
///
/// This aggregates all annotated `#[utoipa::path]` endpoints and schemas.
#[derive(OpenApi)]
#[openapi(
    info(
        title = "execute_academy API",
        version = "0.1.0",
        description = "REST API for execute_academy. See category, product, auth, and user endpoints."
    ),
    servers(
        (url = "http://localhost:9098", description = "Local dev"),
        (url = "https://api.executeacademy.com", description = "Production")
    ),
    paths(
        // Auth
        crate::interfaces::http::handlers::auth::register::register,
        crate::interfaces::http::handlers::auth::login::login,
        crate::interfaces::http::handlers::auth::refresh::refresh,
        crate::interfaces::http::handlers::auth::logout::logout,
        crate::interfaces::http::handlers::auth::verify::verify,
        crate::interfaces::http::handlers::auth::resend_otp::resend_otp,
        // Users
        crate::interfaces::http::handlers::users::get_user::get_user,
        crate::interfaces::http::handlers::users::update_user::update_user,
        // Courses
        crate::interfaces::http::handlers::courses::create_course::create_course,
        crate::interfaces::http::handlers::courses::get_course_by_id::get_course_by_id,
        crate::interfaces::http::handlers::courses::get_course_by_slug::get_course_by_slug,
        crate::interfaces::http::handlers::courses::update_course::update_course,
        crate::interfaces::http::handlers::courses::delete_course::delete_course,
        // Modules
        crate::interfaces::http::handlers::modules::list_modules::list_modules,
        crate::interfaces::http::handlers::modules::list_modules_deep::list_modules_deep,
        crate::interfaces::http::handlers::modules::create_module::create_module,
        crate::interfaces::http::handlers::modules::update_module::update_module,
        crate::interfaces::http::handlers::modules::delete_module::delete_module,
        // Lessons
        crate::interfaces::http::handlers::lessons::list_lessons::list_lessons,
        crate::interfaces::http::handlers::lessons::create_lesson::create_lesson,
        crate::interfaces::http::handlers::lessons::update_lesson::update_lesson,
        crate::interfaces::http::handlers::lessons::delete_lesson::delete_lesson,
    ),
    components(schemas(
            // Shared
            crate::pkg::response::ApiErrorResponse,
            // Users
            crate::types::users::request_type::RegisterRequest,
            crate::types::users::response_type::RegisterResponse,
            crate::types::users::request_type::LoginRequest,
            crate::types::users::response_type::LoginResponse,
            crate::types::users::request_type::RefreshRequest,
            crate::types::users::request_type::VerifyOtpRequest,
            crate::types::users::response_type::TokenResponse,
            crate::types::users::response_type::OkResponse,
            crate::types::users::response_type::UserResponse,
            crate::types::users::user_types::UserProfile,
            crate::types::users::request_type::UpdateUserRequest,
            crate::types::users::request_type::ResendOtpRequest,
            // Courses & content
            crate::types::course_types::Course,
            crate::types::course_types::Instructor,
            crate::types::course_types::PaginationQuery,
            crate::types::course_types::PageMeta,
            crate::types::course_types::CreateCourseRequest,
            crate::types::course_types::UpdateCourseRequest,
            crate::types::course_types::CourseModule,
            crate::types::course_types::CreateModuleRequest,
            crate::types::course_types::UpdateModuleRequest,
            crate::types::course_types::Lesson,
            crate::types::course_types::CreateLessonRequest,
            crate::types::course_types::UpdateLessonRequest
    )),
    modifiers(&ApiSecurity)
)]
pub struct ApiDoc;

struct ApiSecurity;

impl Modify for ApiSecurity {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        let components = openapi.components.get_or_insert_default();
        components.add_security_scheme(
            "bearerAuth",
            SecurityScheme::Http(
                HttpBuilder::new()
                    .scheme(HttpAuthScheme::Bearer)
                    .bearer_format("JWT")
                    .build(),
            ),
        );
    }
}
