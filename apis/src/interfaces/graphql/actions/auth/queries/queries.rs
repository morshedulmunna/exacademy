//! Authentication queries for GraphQL
//!
//! This module contains read-only GraphQL operations for user authentication,
//! such as getting current user information.

use std::sync::Arc;

use async_graphql::{Context, Object, Result as GraphQLResult};
use uuid::Uuid;

use crate::configs::app_context::AppContext;
use crate::pkg::error::AppError;
use crate::pkg::security::Claims;
use crate::types::users::response_type::UserResponse;

/// Authentication queries for GraphQL
pub struct AuthQueries;

#[Object]
impl AuthQueries {
    /// Get current user information
    async fn me(&self, ctx: &Context<'_>) -> GraphQLResult<UserResponse> {
        let app_ctx = ctx.data::<Arc<AppContext>>()?;

        // Extract JWT token from context headers
        let token = ctx
            .data_opt::<String>()
            .ok_or_else(|| AppError::Unauthorized("No token provided".into()))?;

        // Verify and decode the token
        let claims: Claims = app_ctx
            .jwt_service
            .verify(token)
            .map_err(|_| AppError::Unauthorized("Invalid token".into()))?;

        // Get user from database
        let user = app_ctx
            .repos
            .users
            .find_by_id(
                claims
                    .sub
                    .parse::<Uuid>()
                    .map_err(|_| AppError::Unauthorized("Invalid user ID in token".into()))?,
            )
            .await?
            .ok_or_else(|| AppError::NotFound("User not found".into()))?;

        let user_response = UserResponse {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            full_name: user.full_name,
            avatar_url: user.avatar_url,
            is_active: user.is_active,
            is_blocked: user.is_blocked,
        };

        Ok(user_response)
    }
}
