pub mod auth;
pub mod health;
pub mod openapi;
pub mod root;
pub mod social;
use actix_web::{HttpResponse, http::header, web};
use utoipa::OpenApi; // bring trait into scope for ApiDoc::openapi()
use utoipa_swagger_ui::SwaggerUi;

pub fn configure_routes(config: &mut web::ServiceConfig) {
    // Public docs at top-level (not versioned)
    config
        // Redirect /docs -> /docs/ so the UI loads static assets correctly
        .service(
            web::scope("")
                .route(
                    "/docs",
                    web::get().to(|| async {
                        HttpResponse::Found()
                            .insert_header((header::LOCATION, "/docs/"))
                            .finish()
                    }),
                )
                .service(
                    SwaggerUi::new("/docs/{_:.*}")
                        .url("/api-docs/openapi.json", openapi::ApiDoc::openapi()),
                ),
        )
        // Versioned API: /api/v1/...
        .service(
            web::scope("/api").service(
                web::scope("/v1")
                    .route("/", web::get().to(root::handler))
                    .route("/error", web::get().to(root::error_handler))
                    .route("/health", web::get().to(health::handler))
                    .service(
                        web::scope("/auth")
                            .route("/register", web::post().to(auth::register))
                            .route("/login", web::post().to(auth::login))
                            .route("/logout", web::post().to(auth::logout))
                            .route("/me", web::get().to(auth::me)),
                    )
                    .service(
                        web::scope("/oauth")
                            .route("/{provider}/start", web::get().to(social::start))
                            .route("/{provider}/callback", web::get().to(social::callback)),
                    ),
            ),
        );
}
