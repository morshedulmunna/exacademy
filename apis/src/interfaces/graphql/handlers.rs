//! GraphQL request handlers
//!
//! This module contains the HTTP handlers for GraphQL requests and the GraphQL playground.

use async_graphql::{Schema, http::GraphQLPlaygroundConfig, http::playground_source};
use axum::{
    Json,
    body::Bytes,
    extract::State,
    http::{HeaderMap, StatusCode},
    response::{Html, IntoResponse},
};
use serde_json::{Value, json};

use super::queries::{MutationRoot, QueryRoot};
use async_graphql::EmptySubscription;

/// GraphQL query handler for POST requests
///
/// Handles GraphQL queries and mutations sent via POST with JSON content type.
/// Validates the request format and executes the GraphQL query against the schema.
pub async fn graphql_handler(
    State(schema): State<Schema<QueryRoot, MutationRoot, EmptySubscription>>,
    headers: HeaderMap,
    body: Bytes,
) -> impl IntoResponse {
    let content_type = headers
        .get("content-type")
        .and_then(|ct| ct.to_str().ok())
        .unwrap_or("");

    if !content_type.contains("application/json") {
        return (
            StatusCode::UNSUPPORTED_MEDIA_TYPE,
            Json(json!({
                "error": "Content-Type must be application/json"
            })),
        );
    }

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
            Json(json!({
                "error": "Invalid JSON"
            })),
        ),
    }
}

/// GraphQL playground handler for GET requests
///
/// Serves the GraphQL playground interface for interactive query testing.
/// Configured with disabled hover tooltips and suggestions for better performance.
pub async fn graphql_playground() -> impl IntoResponse {
    Html(playground_source(
        GraphQLPlaygroundConfig::new("/graphql")
            .with_setting("editor.hover.enabled", false)
            .with_setting("editor.quickSuggestions", false)
            .with_setting("editor.suggestOnTriggerCharacters", false),
    ))
}
