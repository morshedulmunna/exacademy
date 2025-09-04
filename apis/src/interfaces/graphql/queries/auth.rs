//! Authentication-related GraphQL queries and mutations
//!
//! This module contains GraphQL operations for user authentication including
//! login, registration, password reset, and social authentication.
//!
//! ## Structure
//! - `AuthQueries`: Read-only operations (e.g., get current user)
//! - `AuthMutations`: Write operations (e.g., login, register, logout)
//! - GraphQL-specific types: All response types implement `SimpleObject` for GraphQL compatibility

use std::sync::Arc;

use async_graphql::{Context, Object, Result as GraphQLResult};
use uuid::Uuid;

use crate::applications::auth::{
    forgot_password, github_login, google_login, login, refresh, register, resend_otp,
    reset_password, verify_otp,
};
use crate::configs::app_context::AppContext;
use crate::pkg::error::AppError;
use crate::pkg::security::Claims;
use crate::types::users::request_type::{
    ForgotPasswordRequest, GithubLoginRequest, GoogleLoginRequest, LoginRequest, RefreshRequest,
    RegisterRequest, ResendOtpRequest, ResetPasswordRequest, VerifyOtpRequest,
};
use crate::types::users::response_type::{
    LoginResponse, OkResponse, RegisterResponse, TokenResponse, UserResponse,
};

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
            .await
            .map_err(|e| AppError::Internal(e.to_string()))?
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

/// Authentication mutations for GraphQL
pub struct AuthMutations;

#[Object]
impl AuthMutations {
    /// Register a new user account
    async fn register(
        &self,
        ctx: &Context<'_>,
        input: RegisterRequest,
    ) -> GraphQLResult<RegisterResponse> {
        let app_ctx = ctx.data::<Arc<AppContext>>()?;

        let request = RegisterRequest {
            first_name: input.first_name,
            last_name: input.last_name,
            username: input.username,
            email: input.email,
            password: input.password,
        };

        let result = register(&app_ctx, request)
            .await
            .map_err(|e| AppError::Internal(e.to_string()))?;

        Ok(result)
    }

    /// Login with email and password
    async fn login(&self, ctx: &Context<'_>, input: LoginRequest) -> GraphQLResult<LoginResponse> {
        let app_ctx = ctx.data::<Arc<AppContext>>()?;

        let request = LoginRequest {
            email: input.email,
            password: input.password,
        };

        let result = login(&app_ctx, app_ctx.repos.users.as_ref(), request)
            .await
            .map_err(|e| AppError::Internal(e.to_string()))?;

        Ok(result)
    }

    /// Refresh access token using refresh token
    async fn refresh(
        &self,
        ctx: &Context<'_>,
        input: RefreshRequest,
    ) -> GraphQLResult<TokenResponse> {
        let app_ctx = ctx.data::<Arc<AppContext>>()?;

        let request = RefreshRequest {
            refresh_token: input.refresh_token,
        };

        let result = refresh(&app_ctx, request)
            .await
            .map_err(|e| AppError::Internal(e.to_string()))?;

        Ok(result)
    }

    /// Login with Google OAuth
    async fn google_login(
        &self,
        ctx: &Context<'_>,
        input: GoogleLoginRequest,
    ) -> GraphQLResult<LoginResponse> {
        let app_ctx = ctx.data::<Arc<AppContext>>()?;

        let request = GoogleLoginRequest {
            id_token: input.id_token,
        };

        let result = google_login(&app_ctx, app_ctx.repos.users.as_ref(), request)
            .await
            .map_err(|e| AppError::Internal(e.to_string()))?;

        Ok(result)
    }

    /// Login with GitHub OAuth
    async fn github_login(
        &self,
        ctx: &Context<'_>,
        input: GithubLoginRequest,
    ) -> GraphQLResult<LoginResponse> {
        let app_ctx = ctx.data::<Arc<AppContext>>()?;

        let request = GithubLoginRequest { code: input.code };

        let result = github_login(&app_ctx, app_ctx.repos.users.as_ref(), request)
            .await
            .map_err(|e| AppError::Internal(e.to_string()))?;

        Ok(result)
    }

    /// Verify email OTP
    async fn verify_otp(
        &self,
        ctx: &Context<'_>,
        input: VerifyOtpRequest,
    ) -> GraphQLResult<OkResponse> {
        let app_ctx = ctx.data::<Arc<AppContext>>()?;

        let request = VerifyOtpRequest {
            email: input.email,
            code: input.code,
        };

        verify_otp(&app_ctx, app_ctx.repos.users.as_ref(), request)
            .await
            .map_err(|e| AppError::Internal(e.to_string()))?;

        Ok(OkResponse { ok: true })
    }

    /// Resend email OTP
    async fn resend_otp(
        &self,
        ctx: &Context<'_>,
        input: ResendOtpRequest,
    ) -> GraphQLResult<OkResponse> {
        let app_ctx = ctx.data::<Arc<AppContext>>()?;

        let request = ResendOtpRequest { email: input.email };

        resend_otp(&app_ctx, app_ctx.repos.users.as_ref(), request)
            .await
            .map_err(|e| AppError::Internal(e.to_string()))?;

        Ok(OkResponse { ok: true })
    }

    /// Request password reset
    async fn forgot_password(
        &self,
        ctx: &Context<'_>,
        input: ForgotPasswordRequest,
    ) -> GraphQLResult<OkResponse> {
        let app_ctx = ctx.data::<Arc<AppContext>>()?;

        let request = ForgotPasswordRequest { email: input.email };

        forgot_password(&app_ctx, app_ctx.repos.users.as_ref(), request)
            .await
            .map_err(|e| AppError::Internal(e.to_string()))?;

        Ok(OkResponse { ok: true })
    }

    /// Reset password with OTP
    async fn reset_password(
        &self,
        ctx: &Context<'_>,
        input: ResetPasswordRequest,
    ) -> GraphQLResult<OkResponse> {
        let app_ctx = ctx.data::<Arc<AppContext>>()?;

        let request = ResetPasswordRequest {
            email: input.email,
            code: input.code,
            new_password: input.new_password,
        };

        reset_password(&app_ctx, app_ctx.repos.users.as_ref(), request)
            .await
            .map_err(|e| AppError::Internal(e.to_string()))?;

        Ok(OkResponse { ok: true })
    }

    /// Logout user
    async fn logout(&self, _ctx: &Context<'_>) -> GraphQLResult<OkResponse> {
        // For now, logout is handled client-side by removing the token
        // In a more sophisticated implementation, you might want to:
        // 1. Add the token to a blacklist in Redis
        // 2. Invalidate the refresh token
        // 3. Log the logout event
        Ok(OkResponse { ok: true })
    }
}
