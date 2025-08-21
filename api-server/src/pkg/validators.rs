use std::ops::Deref;

use axum::Json;
use axum::body::Body;
use axum::extract::FromRequest;
use axum::http::Request;
use validator::Validate;

use crate::pkg::error::{AppError, ValidationIssue, validation_error};

/// ValidatedJson is an Axum extractor that deserializes JSON and runs
/// `validator` crate validations via `Validate` derive. If validation
/// fails, it returns `AppError::Validation` with field-level issues.
#[derive(Debug, Clone, Copy)]
pub struct ValidatedJson<T>(pub T);

impl<T> Deref for ValidatedJson<T> {
    type Target = T;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[axum::async_trait]
impl<S, T> FromRequest<S> for ValidatedJson<T>
where
    S: Send + Sync,
    T: Validate,
    Json<T>: FromRequest<S>,
    <Json<T> as FromRequest<S>>::Rejection: Into<AppError>,
{
    type Rejection = AppError;

    async fn from_request(req: Request<Body>, state: &S) -> Result<Self, Self::Rejection> {
        let Json(value) = Json::<T>::from_request(req, state)
            .await
            .map_err(Into::into)?;

        if let Err(e) = value.validate() {
            let mut issues: Vec<ValidationIssue> = Vec::new();
            for (field, errors) in e.field_errors() {
                for err in errors {
                    let message = err
                        .message
                        .clone()
                        .unwrap_or_else(|| std::borrow::Cow::Borrowed("is invalid"))
                        .to_string();
                    issues.push(ValidationIssue::new(field.to_string(), message));
                }
            }
            return Err(validation_error("Validation error", issues));
        }

        Ok(ValidatedJson(value))
    }
}
