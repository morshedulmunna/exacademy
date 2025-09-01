//! Centralized API error types and conversions for Axum
//!
//! This module defines a single `AppError` enum that represents all
//! application-level errors the HTTP layer can produce. It implements
//! `IntoResponse` so handlers can return `Result<T, AppError>` and get
//! consistent JSON error responses.

use axum::extract::rejection::JsonRejection;
use axum::{Json, http::StatusCode, response::IntoResponse};
use serde::Serialize;

use crate::pkg::logger::error_with_details;
use crate::pkg::response::ApiErrorResponse;

/// Standard application error type.
#[derive(Debug)]
pub enum AppError {
    /// Request is invalid (missing/invalid params, parse errors)
    BadRequest(String),
    /// Authentication failed or missing
    Unauthorized(String),
    /// Authenticated but not allowed
    Forbidden(String),
    /// Resource not found
    NotFound(String),
    /// Conflict with current resource state
    Conflict(String),

    // Rate limit conflict
    RateLimitConflict(String),

    /// Validation failed with field-level details
    Validation {
        message: String,
        details: serde_json::Value,
    },
    /// Upstream dependency/service failure
    ServiceUnavailable(String),
    /// Request timed out
    Timeout(String),
    /// Internal, unexpected error
    Internal(String),
}

impl AppError {
    /// Short stable machine code for each error variant
    fn code(&self) -> &'static str {
        match self {
            AppError::BadRequest(_) => "BAD_REQUEST",
            AppError::Unauthorized(_) => "UNAUTHORIZED",
            AppError::Forbidden(_) => "FORBIDDEN",
            AppError::NotFound(_) => "NOT_FOUND",
            AppError::Conflict(_) => "CONFLICT",
            AppError::RateLimitConflict(_) => "RATE_LIMIT_CONFLICT",
            AppError::Validation { .. } => "VALIDATION_ERROR",
            AppError::ServiceUnavailable(_) => "SERVICE_UNAVAILABLE",
            AppError::Timeout(_) => "TIMEOUT",
            AppError::Internal(_) => "INTERNAL_ERROR",
        }
    }

    /// Human message associated with the error
    fn message(&self) -> &str {
        match self {
            AppError::BadRequest(m)
            | AppError::Unauthorized(m)
            | AppError::Forbidden(m)
            | AppError::NotFound(m)
            | AppError::Conflict(m)
            | AppError::ServiceUnavailable(m)
            | AppError::Timeout(m)
            | AppError::RateLimitConflict(m) => m,
            AppError::Internal(_) => "Internal server error",
            AppError::Validation { message, .. } => message,
        }
    }

    /// HTTP status code mapping for each error variant
    fn status_code(&self) -> StatusCode {
        match self {
            AppError::BadRequest(_)
            | AppError::Validation { .. }
            | AppError::RateLimitConflict(_) => StatusCode::BAD_REQUEST,
            AppError::Unauthorized(_) => StatusCode::UNAUTHORIZED,
            AppError::Forbidden(_) => StatusCode::FORBIDDEN,
            AppError::NotFound(_) => StatusCode::NOT_FOUND,
            AppError::Conflict(_) => StatusCode::CONFLICT,
            AppError::ServiceUnavailable(_) => StatusCode::SERVICE_UNAVAILABLE,
            AppError::Timeout(_) => StatusCode::GATEWAY_TIMEOUT,
            AppError::Internal(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    /// Build the JSON body for this error
    fn to_body(&self) -> ApiErrorResponse {
        match self {
            AppError::RateLimitConflict(message) => {
                ApiErrorResponse::new(self.code(), message).with_details(serde_json::json!({}))
            }
            AppError::Validation { message, details } => {
                ApiErrorResponse::new(self.code(), message).with_details(details.clone())
            }
            _ => ApiErrorResponse::new(self.code(), self.message()),
        }
    }
}

impl std::fmt::Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message())
    }
}

impl std::error::Error for AppError {}

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        error_with_details(
            format!("{}: {}", self.code(), self.message()),
            format!("{:?}", self),
        );
        let status = self.status_code();
        let body = self.to_body();
        (status, Json(body)).into_response()
    }
}

// Conversions from common error types into AppError

impl From<anyhow::Error> for AppError {
    fn from(err: anyhow::Error) -> Self {
        AppError::Internal(err.to_string())
    }
}

impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> Self {
        match err.kind() {
            std::io::ErrorKind::NotFound => AppError::NotFound("Resource not found".into()),
            std::io::ErrorKind::PermissionDenied => AppError::Forbidden("Permission denied".into()),
            std::io::ErrorKind::ConnectionRefused => {
                AppError::ServiceUnavailable("Connection refused".into())
            }
            std::io::ErrorKind::ConnectionReset => {
                AppError::ServiceUnavailable("Connection reset".into())
            }
            std::io::ErrorKind::ConnectionAborted => {
                AppError::ServiceUnavailable("Connection aborted".into())
            }
            std::io::ErrorKind::NotConnected => {
                AppError::ServiceUnavailable("Not connected".into())
            }
            std::io::ErrorKind::AddrInUse => {
                AppError::ServiceUnavailable("Address already in use".into())
            }
            std::io::ErrorKind::AddrNotAvailable => {
                AppError::ServiceUnavailable("Address not available".into())
            }
            std::io::ErrorKind::BrokenPipe => AppError::ServiceUnavailable("Broken pipe".into()),
            std::io::ErrorKind::AlreadyExists => {
                AppError::Conflict("Resource already exists".into())
            }
            std::io::ErrorKind::WouldBlock => {
                AppError::ServiceUnavailable("Operation would block".into())
            }
            std::io::ErrorKind::InvalidInput => AppError::BadRequest("Invalid input".into()),
            std::io::ErrorKind::InvalidData => AppError::BadRequest("Invalid data".into()),
            std::io::ErrorKind::TimedOut => AppError::Timeout("Operation timed out".into()),
            std::io::ErrorKind::WriteZero => AppError::Internal("Write zero error".into()),
            std::io::ErrorKind::Interrupted => {
                AppError::ServiceUnavailable("Operation interrupted".into())
            }
            std::io::ErrorKind::UnexpectedEof => {
                AppError::Internal("Unexpected end of file".into())
            }
            _ => AppError::Internal(format!("I/O error: {}", err)),
        }
    }
}

impl From<serde_json::Error> for AppError {
    fn from(err: serde_json::Error) -> Self {
        AppError::BadRequest(format!("JSON error: {}", err))
    }
}

impl From<uuid::Error> for AppError {
    fn from(err: uuid::Error) -> Self {
        AppError::BadRequest(format!("Invalid UUID: {}", err))
    }
}

impl From<chrono::ParseError> for AppError {
    fn from(err: chrono::ParseError) -> Self {
        AppError::BadRequest(format!("Date/time parsing error: {}", err))
    }
}

impl From<tokio::time::error::Elapsed> for AppError {
    fn from(_err: tokio::time::error::Elapsed) -> Self {
        AppError::Timeout("Operation timed out".into())
    }
}

impl From<axum::extract::rejection::PathRejection> for AppError {
    fn from(err: axum::extract::rejection::PathRejection) -> Self {
        AppError::BadRequest(format!("Invalid path parameter: {}", err))
    }
}

impl From<axum::extract::rejection::QueryRejection> for AppError {
    fn from(err: axum::extract::rejection::QueryRejection) -> Self {
        AppError::BadRequest(format!("Invalid query parameter: {}", err))
    }
}

impl From<axum::extract::rejection::FormRejection> for AppError {
    fn from(err: axum::extract::rejection::FormRejection) -> Self {
        AppError::BadRequest(format!("Invalid form data: {}", err))
    }
}

impl From<JsonRejection> for AppError {
    fn from(err: JsonRejection) -> Self {
        // Map Axum's JSON extractor errors into a clean BadRequest, without leaking internals
        // Return as a validation-style error with details for clients if needed.
        let details = serde_json::json!({
            "issues": [
                { "field": "body", "message": err.body_text() }
            ]
        });
        AppError::Validation {
            message: "Invalid JSON body".into(),
            details,
        }
    }
}

// Convert sqlx errors into sanitized AppError variants
impl From<sqlx::Error> for AppError {
    fn from(err: sqlx::Error) -> Self {
        match err {
            sqlx::Error::RowNotFound => AppError::NotFound("Resource not found".into()),
            sqlx::Error::Database(db_err) => {
                let code = db_err.code().map(|c| c.to_string());
                if let Some(code_str) = code.as_deref() {
                    let message = get_database_error_message(code_str, &db_err);
                    get_error_type_for_code(code_str, message)
                } else {
                    AppError::Internal(format!("Database error: {}", db_err))
                }
            }
            sqlx::Error::PoolTimedOut => {
                AppError::ServiceUnavailable("Database connection pool timeout".into())
            }
            sqlx::Error::PoolClosed => {
                AppError::ServiceUnavailable("Database connection pool is closed".into())
            }
            sqlx::Error::Io(io_err) => {
                AppError::ServiceUnavailable(format!("Database I/O error: {}", io_err))
            }
            sqlx::Error::Tls(tls_err) => {
                AppError::ServiceUnavailable(format!("Database TLS error: {}", tls_err))
            }
            sqlx::Error::Protocol(protocol_err) => {
                AppError::ServiceUnavailable(format!("Database protocol error: {}", protocol_err))
            }
            sqlx::Error::Configuration(config_err) => {
                AppError::Internal(format!("Database configuration error: {}", config_err))
            }
            sqlx::Error::WorkerCrashed => {
                AppError::ServiceUnavailable("Database worker crashed".into())
            }
            sqlx::Error::Migrate(migrate_err) => {
                AppError::Internal(format!("Database migration error: {}", migrate_err))
            }
            _ => AppError::Internal(format!("Database error: {}", err)),
        }
    }
}

/// Convenient result alias for handlers and services
pub type AppResult<T> = Result<T, AppError>;

/// Helper to create a validation error with structured details
#[derive(Debug, Serialize)]
pub struct ValidationIssue {
    pub field: String,
    pub message: String,
}

impl ValidationIssue {
    pub fn new(field: impl Into<String>, message: impl Into<String>) -> Self {
        Self {
            field: field.into(),
            message: message.into(),
        }
    }
}

/// Build a validation error from a list of issues
pub fn validation_error(message: impl Into<String>, issues: Vec<ValidationIssue>) -> AppError {
    let details = serde_json::json!({
        "issues": issues,
    });
    AppError::Validation {
        message: message.into(),
        details,
    }
}

/// Comprehensive database error message generator
fn get_database_error_message(code: &str, db_err: &Box<dyn sqlx::error::DatabaseError>) -> String {
    match code {
        // Unique constraint violations
        "23505" => {
            if let Some(constraint) = db_err.constraint() {
                format!("Constraint violation: {}", constraint)
            } else {
                "Duplicate value violates unique constraint".to_string()
            }
        }
        // Foreign key violations
        "23503" => {
            if let Some(constraint) = db_err.constraint() {
                format!("Foreign key violation: {}", constraint)
            } else {
                "Operation violates foreign key constraints".to_string()
            }
        }
        // Check constraint violations
        "23514" => {
            if let Some(constraint) = db_err.constraint() {
                format!("Check constraint violation: {}", constraint)
            } else {
                "Data violates check constraints".to_string()
            }
        }
        // Not null violations
        "23502" => "Required field cannot be null".to_string(),
        // Restrict violation
        "23001" => "Operation violates restrict constraint".to_string(),
        // Set null violation
        "23002" => "Operation violates set null constraint".to_string(),
        // Set default violation
        "23003" => "Operation violates set default constraint".to_string(),
        // Invalid text representation
        "22P02" => "Invalid text representation for data type".to_string(),
        // Undefined function
        "42883" => "Function does not exist".to_string(),
        // Undefined table
        "42P01" => "Table does not exist".to_string(),
        // Undefined column
        "42703" => "Column does not exist".to_string(),
        // Duplicate column
        "42701" => "Column already exists".to_string(),
        // Duplicate table
        "42P07" => "Table already exists".to_string(),
        // Duplicate schema
        "42P06" => "Schema already exists".to_string(),
        // Duplicate index
        "42P11" => "Index already exists".to_string(),
        // Duplicate constraint
        "42P16" => "Constraint already exists".to_string(),
        // Invalid password
        "28P01" => "Authentication failed".to_string(),
        // Insufficient privilege
        "42501" => "Insufficient privileges".to_string(),
        // Object not in prerequisite state
        "55006" => "Object not in prerequisite state".to_string(),
        // Deadlock detected
        "40P01" => "Deadlock detected".to_string(),
        // Query canceled
        "57014" => "Query was canceled".to_string(),
        // Connection exception
        "08000" => "Connection exception".to_string(),
        // Connection does not exist
        "08003" => "Connection does not exist".to_string(),
        // Connection failure
        "08006" => "Connection failure".to_string(),
        // SQL client unable to establish SQL connection
        "08001" => "Unable to establish database connection".to_string(),
        // SQL server rejected establishment of SQL connection
        "08004" => "Database server rejected connection".to_string(),
        // Transaction resolution unknown
        "08007" => "Transaction resolution unknown".to_string(),
        // Protocol violation
        "08P01" => "Protocol violation".to_string(),
        // Default error for unknown codes
        _ => format!("Database error code {}: {}", code, db_err),
    }
}

/// Determine the appropriate AppError type based on database error code
fn get_error_type_for_code(code: &str, message: String) -> AppError {
    match code {
        // Client errors (4xx)
        "23502" | "22P02" | "42703" | "42701" | "42P07" | "42P06" | "42P11" | "42P16" => {
            AppError::BadRequest(message)
        }
        // Conflict errors (409)
        "23505" | "23503" | "23514" | "23001" | "23002" | "23003" => AppError::Conflict(message),
        // Authentication errors (401)
        "28P01" => AppError::Unauthorized(message),
        // Authorization errors (403)
        "42501" => AppError::Forbidden(message),
        // Not found errors (404)
        "42P01" | "42883" => AppError::NotFound(message),
        // Service unavailable errors (503)
        "08000" | "08001" | "08003" | "08004" | "08006" | "08007" | "08P01" | "40P01" | "57014" => {
            AppError::ServiceUnavailable(message)
        }
        // Internal server errors (500)
        "55006" | _ => AppError::Internal(message),
    }
}

/// Dynamic error mapping for any error type
pub fn map_error_dynamically(err: &dyn std::error::Error) -> AppError {
    let error_msg = err.to_string().to_lowercase();

    // Network and connection errors
    if error_msg.contains("connection") || error_msg.contains("network") {
        if error_msg.contains("refused") || error_msg.contains("timeout") {
            AppError::ServiceUnavailable("Service temporarily unavailable".into())
        } else if error_msg.contains("not found") {
            AppError::NotFound("Resource not found".into())
        } else {
            AppError::ServiceUnavailable("Connection error".into())
        }
    }
    // Authentication and authorization errors
    else if error_msg.contains("auth")
        || error_msg.contains("unauthorized")
        || error_msg.contains("forbidden")
    {
        if error_msg.contains("token") || error_msg.contains("jwt") {
            AppError::Unauthorized("Invalid authentication token".into())
        } else if error_msg.contains("permission") || error_msg.contains("access") {
            AppError::Forbidden("Insufficient permissions".into())
        } else {
            AppError::Unauthorized("Authentication required".into())
        }
    }
    // Validation and data errors
    else if error_msg.contains("validation")
        || error_msg.contains("invalid")
        || error_msg.contains("parse")
    {
        AppError::BadRequest("Invalid data provided".into())
    }
    // Timeout errors
    else if error_msg.contains("timeout") || error_msg.contains("timed out") {
        AppError::Timeout("Operation timed out".into())
    }
    // Conflict errors
    else if error_msg.contains("conflict")
        || error_msg.contains("duplicate")
        || error_msg.contains("exists")
    {
        AppError::Conflict("Resource conflict detected".into())
    }
    // Rate limiting
    else if error_msg.contains("rate limit") || error_msg.contains("too many") {
        AppError::RateLimitConflict("Rate limit exceeded".into())
    }
    // Default to internal error
    else {
        AppError::Internal(format!("Unexpected error: {}", err))
    }
}
