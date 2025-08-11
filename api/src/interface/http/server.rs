use std::sync::Arc;

use crate::configs::{configs::AppConfig, load::load_config};
use crate::interface::http::{
    middlewares::{error_handler, rate_limit, request_logger, session_auth},
    routes,
};
use crate::pkg::logger::info;
use crate::pkg::mongodb::init_mongodb;
use actix_web::{App, HttpServer, web};

/// Start the HTTP server
pub async fn start_server(host: &str, config: &AppConfig) -> std::io::Result<()> {
    let cfg = Arc::new(config.clone());

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(cfg.clone()))
            .wrap(error_handler::ErrorHandler::new())
            .wrap(request_logger::RequestLogger::new())
            .wrap(session_auth::SessionAuth::new())
            .wrap(rate_limit::RateLimit::new(
                rate_limit::RateLimitConfigMiddleware::default(),
            ))
            .configure(routes::configure_routes)
    })
    .bind(format!("{}:{}", host, config.http_port))?
    .run()
    .await
}

/// Start the server with default configuration
pub async fn start_default_server() -> std::io::Result<()> {
    let config = load_config().unwrap();

    // Initialize MongoDB client before starting the server, fail fast on error
    init_mongodb(&config)
        .await
        .expect("Failed to initialize MongoDB");

    info(format!(
        "Server will be available at http://127.0.0.1:{}",
        config.http_port
    ));

    start_server("127.0.0.1", &config).await
}
