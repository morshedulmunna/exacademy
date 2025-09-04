use std::net::SocketAddr;
use std::sync::Arc;

use async_graphql::{EmptyMutation, EmptySubscription, Schema, SchemaBuilder};
use axum::{
    Json, Router,
    body::Bytes,
    extract::{Extension, State},
    http::{HeaderMap, StatusCode},
    response::{Html, IntoResponse},
    routing::{get, post},
};
use serde_json::Value;
use tokio::signal;
use tower::ServiceBuilder;
use tower_http::{compression::CompressionLayer, cors::CorsLayer, trace::TraceLayer};

use crate::configs::app_context::AppContext;
use crate::interfaces::middlewares::axum_error_handler::error_handler as error_handler_mw;
use crate::interfaces::middlewares::axum_rate_limit::{
    RateLimitState, rate_limit as rate_limit_mw,
};
use crate::interfaces::middlewares::axum_request_logger::request_logger as request_logger_mw;
use crate::pkg::logger::info;

use super::queries::{MutationRoot, QueryRoot};

/// Build the GraphQL schema with queries and mutations
fn build_schema(ctx: Arc<AppContext>) -> SchemaBuilder<QueryRoot, MutationRoot, EmptySubscription> {
    Schema::build(QueryRoot, MutationRoot, EmptySubscription).data(ctx)
}

/// Build the Axum application router with middlewares and GraphQL endpoint
fn build_app(ctx: Arc<AppContext>) -> Router {
    let cors = CorsLayer::permissive();
    let trace = TraceLayer::new_for_http();
    let compression = CompressionLayer::new();

    let schema = build_schema(ctx.clone()).finish();
    let rate_limit_state = RateLimitState::new(100, 60);

    let app = Router::new()
        .route("/graphql", post(graphql_handler))
        .route("/graphql", get(graphql_playground))
        .with_state(schema)
        .layer(Extension(ctx));

    app
}

/// GraphQL query handler
async fn graphql_handler(
    State(schema): State<Schema<QueryRoot, MutationRoot, EmptySubscription>>,
    headers: HeaderMap,
    body: Bytes,
) -> impl IntoResponse {
    let content_type = headers
        .get("content-type")
        .and_then(|ct| ct.to_str().ok())
        .unwrap_or("");

    if content_type.contains("application/json") {
        match serde_json::from_slice::<Value>(&body) {
            Ok(json) => {
                let query = json.get("query").and_then(|q| q.as_str()).unwrap_or("");

                let request = async_graphql::Request::new(query);
                let response = schema.execute(request).await;
                let json_response = serde_json::to_value(response).unwrap_or_default();
                (StatusCode::OK, Json(json_response))
            }
            Err(_) => (
                StatusCode::BAD_REQUEST,
                Json(serde_json::json!({
                    "error": "Invalid JSON"
                })),
            ),
        }
    } else {
        (
            StatusCode::UNSUPPORTED_MEDIA_TYPE,
            Json(serde_json::json!({
                "error": "Content-Type must be application/json"
            })),
        )
    }
}

use async_graphql::http::{GraphQLPlaygroundConfig, playground_source};

async fn graphql_playground() -> impl IntoResponse {
    Html(playground_source(
        GraphQLPlaygroundConfig::new("/graphql")
            .with_setting("editor.hover.enabled", false) // disable hover tooltip
            .with_setting("editor.quickSuggestions", false)
            .with_setting("editor.suggestOnTriggerCharacters", false),
    ))
}

/// Start the GraphQL server using Axum with graceful shutdown
pub async fn start_server(
    host: &str,
    config: &AppContext,
) -> Result<(), Box<dyn std::error::Error>> {
    let ctx = Arc::new(config.clone());
    let app = build_app(ctx);

    let addr: SocketAddr = format!("{}:{}", host, config.system.api_port).parse()?;
    let listener = tokio::net::TcpListener::bind(addr).await?;

    // Start the server with graceful shutdown
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await?;

    info("GraphQL server shutdown complete".to_string());
    Ok(())
}

/// Start the GraphQL server with default configuration
pub async fn start_default_server() -> Result<(), Box<dyn std::error::Error>> {
    let ctx = AppContext::get()
        .await
        .expect("Failed to initialize AppContext");

    info(format!(
        "GraphQL server will be available at http://{}:{}/graphql",
        ctx.system.api_host, ctx.system.api_port
    ));

    return start_server(&ctx.system.api_host, ctx.as_ref()).await;
}

/// Graceful shutdown signal handler
async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {
            info("Received Ctrl+C, shutting down GraphQL server gracefully...".to_string());
        },
        _ = terminate => {
            info("Received SIGTERM, shutting down GraphQL server gracefully...".to_string());
        },
    }
}

/// Entry called by `graphql_command` to run the GraphQL server.
pub async fn run() -> Result<(), Box<dyn std::error::Error>> {
    start_default_server().await?;
    Ok(())
}
