use std::sync::Arc;

use axum::{async_trait, extract::FromRequestParts, http::request::Parts};

use crate::configs::app_context::AppContext;
use crate::pkg::error::AppError;

#[derive(Debug, Clone)]
pub struct AuthUser {
    pub user_id: uuid::Uuid,
    pub role: String,
}

#[async_trait]
impl<S> FromRequestParts<S> for AuthUser
where
    S: Send + Sync,
{
    type Rejection = AppError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        // Try to get AppContext from request extensions (set by Extension layer)
        let ctx = parts
            .extensions
            .get::<Arc<AppContext>>()
            .cloned()
            .ok_or_else(|| AppError::Internal("Missing application context".into()))?;

        // First try to get token from cookies (access_token)
        let token = parts
            .headers
            .get(axum::http::header::COOKIE)
            .and_then(|cookie_header| {
                cookie_header.to_str().ok().and_then(|cookies| {
                    cookies.split(';').find_map(|cookie| {
                        let cookie = cookie.trim();
                        if cookie.starts_with("access_token=") {
                            Some(cookie[13..].to_string())
                        } else {
                            None
                        }
                    })
                })
            })
            // If no token in cookies, try Authorization header
            .or_else(|| {
                parts
                    .headers
                    .get(axum::http::header::AUTHORIZATION)
                    .and_then(|v| v.to_str().ok())
                    .and_then(|auth_header| {
                        auth_header.strip_prefix("Bearer ").map(|s| s.to_string())
                    })
            })
            .ok_or_else(|| AppError::Unauthorized("Missing authentication token".into()))?;

        let claims: crate::pkg::security::Claims = ctx
            .jwt_service
            .verify(&token)
            .map_err(|_| AppError::Unauthorized("Invalid token".into()))?;

        Ok(AuthUser {
            user_id: uuid::Uuid::parse_str(&claims.sub)
                .map_err(|_| AppError::BadRequest("Invalid user id in token".into()))?,
            role: claims.role,
        })
    }
}

impl AuthUser {
    pub fn require_admin(&self) -> Result<(), AppError> {
        if self.role != "admin" {
            return Err(AppError::Forbidden("Admin access required".into()));
        }
        Ok(())
    }
}
