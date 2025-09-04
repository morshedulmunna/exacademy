use std::sync::Arc;

use axum::{Extension, Json, http::StatusCode};

use crate::configs::app_context::AppContext;
use crate::interfaces::health::generate_health_report;
use crate::pkg::response::Response;

/// Health check endpoint
///
/// Probes core dependencies (Postgres, Redis). Returns HTTP 200 when all
/// checks pass; otherwise returns HTTP 503 with component-level details.
pub async fn handler(
    Extension(ctx): Extension<Arc<AppContext>>,
) -> (
    StatusCode,
    Json<Response<crate::interfaces::health::HealthReport>>,
) {
    let report = generate_health_report(ctx.as_ref()).await;

    let all_ok = report.overall_status == "healthy";
    let status_code = if all_ok {
        StatusCode::OK
    } else {
        StatusCode::SERVICE_UNAVAILABLE
    };

    let message = if all_ok {
        "OK"
    } else {
        "One or more dependencies are unavailable"
    };

    let body = Response::with_data(message, report, status_code.as_u16());
    (status_code, Json(body))
}
