//! Axum request logging middleware
//!
//! Logs method, path, status, latency, client ip and user agent using the
//! application's structured logger. Dynamically determines request type
//! (GraphQL, REST API, health check, etc.) for more accurate logging.

use std::time::Instant;

use axum::{
    body::Body,
    http::{HeaderMap, Request},
    middleware::Next,
    response::Response,
};

use crate::pkg::logger::{LogLevel, get_logger};

/// Middleware that logs each HTTP request/response with basic metadata.
///
/// Dynamically determines the request type (GraphQL, REST API, health check, etc.)
/// based on the request path and headers for more accurate logging categorization.
pub async fn request_logger(req: Request<Body>, next: Next) -> Response {
    let start = Instant::now();

    let method = req.method().to_string();
    let path = req.uri().path().to_string();
    let headers: &HeaderMap = req.headers();

    // Determine request type based on path and content type
    let request_type = determine_request_type(&path, headers);

    // Prefer X-Forwarded-For, then X-Real-IP, otherwise unknown.
    let ip = headers
        .get("x-forwarded-for")
        .and_then(|h| h.to_str().ok())
        .or_else(|| headers.get("x-real-ip").and_then(|h| h.to_str().ok()))
        .unwrap_or("unknown")
        .to_string();

    let user_agent = headers
        .get(axum::http::header::USER_AGENT)
        .and_then(|h| h.to_str().ok())
        .unwrap_or("")
        .to_string();

    let response = next.run(req).await;

    let status = response.status().as_u16() as i64;
    let latency_ms = start.elapsed().as_millis() as i64;

    let mut fields: std::collections::HashMap<String, serde_json::Value> =
        std::collections::HashMap::new();
    fields.insert("method".to_string(), method.into());
    fields.insert("path".to_string(), path.into());
    fields.insert("status".to_string(), status.into());
    fields.insert("latency_ms".to_string(), latency_ms.into());
    fields.insert("ip".to_string(), ip.into());
    if !user_agent.is_empty() {
        fields.insert("user_agent".to_string(), user_agent.into());
    }

    // Log only successful (<400) requests here to avoid double logging
    // for errors, which are already logged by the centralized error handler.
    if status < 400 {
        let logger = get_logger();
        logger.log_with_fields(LogLevel::Info, &request_type, None, fields);
    }

    response
}

/// Determine the request type based on path and headers
///
/// Analyzes the request path and content type to determine if it's a GraphQL request,
/// REST API request, or other type of HTTP request for more accurate logging.
fn determine_request_type(path: &str, headers: &HeaderMap) -> String {
    // Check for GraphQL requests
    if path.starts_with("/graphql") {
        // Check if it's a GraphQL query/mutation (POST with JSON content type)
        let content_type = headers
            .get("content-type")
            .and_then(|ct| ct.to_str().ok())
            .unwrap_or("");

        if content_type.contains("application/json") {
            return "graphql_request".to_string();
        } else {
            // GET request to /graphql is likely the playground
            return "graphql_playground".to_string();
        }
    }

    // Check for other API patterns
    if path.starts_with("/api/") {
        return "rest_api_request".to_string();
    }

    // Check for health check endpoints
    if path == "/health" || path == "/healthz" || path == "/ping" {
        return "health_check".to_string();
    }

    // Default to generic HTTP request
    "http_request".to_string()
}
