use utoipa::OpenApi;

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
        (url = "http://localhost:8080", description = "Local dev")
    ),
    paths(
        crate::interfaces::http::routes::auth::register,
        crate::interfaces::http::routes::auth::login,
        crate::interfaces::http::routes::auth::refresh,
        crate::interfaces::http::routes::auth::logout,
        crate::interfaces::http::routes::users::get_user,
    ),
    components(schemas(
        crate::pkg::response::ApiErrorResponse,
        crate::interfaces::http::routes::users::UserProfile,
        crate::interfaces::http::routes::auth::RegisterRequest,
        crate::interfaces::http::routes::auth::RegisterResponse,
        crate::interfaces::http::routes::auth::LoginRequest,
        crate::interfaces::http::routes::auth::UserResponse,
        crate::interfaces::http::routes::auth::LoginResponse,
        crate::interfaces::http::routes::auth::TokenResponse,
        crate::interfaces::http::routes::auth::RefreshRequest,
        crate::interfaces::http::routes::auth::OkResponse,
    ))
)]
pub struct ApiDoc;
