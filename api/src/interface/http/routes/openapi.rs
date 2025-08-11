use crate::interface::http::routes;
use utoipa::OpenApi;

#[derive(OpenApi)]
#[openapi(
    paths(
        routes::root::handler,
        routes::root::error_handler,
        routes::health::handler,
        routes::auth::register,
        routes::auth::login,
        routes::auth::logout,
        routes::auth::me,
        routes::social::start,
        routes::social::callback,
    ),
    servers(
        (url = "/api/v1", description = "execute_academy API v1")
    ),
    components(schemas(
        crate::interface::http::routes::auth::RegisterRequest,
        crate::interface::http::routes::auth::LoginRequest,
        crate::interface::http::routes::auth::MeResponse,
        crate::pkg::response::ApiErrorResponse,
    )),
    tags(
        (name = "api", description = "execute_academy API")
    )
)]
pub struct ApiDoc;

// Swagger UI mounting moved into routes::configure_routes to ensure scope and ordering
