use std::future::{Ready, ready};

use actix_web::{FromRequest, HttpMessage, HttpRequest};

use crate::domain::users::User;
use crate::pkg::error::AppError;

/// Extractor that provides the authenticated `User` from request extensions.
/// Use this in handlers as a parameter to enforce authentication.
pub struct CurrentUser(pub User);

impl FromRequest for CurrentUser {
    type Error = actix_web::Error;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &HttpRequest, _payload: &mut actix_web::dev::Payload) -> Self::Future {
        if let Some(user) = req.extensions().get::<User>().cloned() {
            return ready(Ok(CurrentUser(user)));
        }
        ready(Err(
            AppError::Unauthorized("Not authenticated".into()).into()
        ))
    }
}
