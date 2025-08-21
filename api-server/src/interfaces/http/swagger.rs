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
        crate::interfaces::http::handlers::auth::register,
        crate::interfaces::http::handlers::auth::login,
        crate::interfaces::http::handlers::auth::refresh,
        crate::interfaces::http::handlers::auth::logout,
        crate::interfaces::http::handlers::users::get_user,
        crate::interfaces::http::handlers::users::update_user,
    ),
    components(schemas(
        crate::pkg::response::ApiErrorResponse,
        crate::types::user_types::RegisterRequest,
        crate::types::user_types::LoginRequest,
        crate::types::user_types::RefreshRequest,
        crate::types::user_types::RegisterResponse,
        crate::types::user_types::LoginResponse,
        crate::types::user_types::TokenResponse,
        crate::types::user_types::OkResponse,
        crate::types::user_types::UserResponse,
        crate::types::user_types::UserProfile,
        crate::types::user_types::UpdateUserRequest
    ))
)]
pub struct ApiDoc;
