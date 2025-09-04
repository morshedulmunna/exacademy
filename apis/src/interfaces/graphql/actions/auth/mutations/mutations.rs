//! Authentication mutations for GraphQL
//!
//! This module contains write operations for user authentication including
//! login, registration, password reset, and social authentication.

use std::sync::Arc;

use async_graphql::{Context, Object, Result as GraphQLResult};

use crate::applications::auth::{
    forgot_password, github_login, google_login, login, refresh, register, resend_otp,
    reset_password, verify_otp,
};
use crate::configs::app_context::AppContext;
use crate::types::users::request_type::{
    ForgotPasswordRequest, GithubLoginRequest, GoogleLoginRequest, LoginRequest, RefreshRequest,
    RegisterRequest, ResendOtpRequest, ResetPasswordRequest, VerifyOtpRequest,
};
use crate::types::users::response_type::{
    LoginResponse, OkResponse, RegisterResponse, TokenResponse,
};

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

        let result = register(&app_ctx, request).await.map_err(|e| e)?;

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
            .map_err(|e| e)?;

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

        let result = refresh(&app_ctx, request).await.map_err(|e| e)?;

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
            .map_err(|e| e)?;

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
            .map_err(|e| e)?;

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
            .map_err(|e| e)?;

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
            .map_err(|e| e)?;

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
            .map_err(|e| e)?;

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
            .map_err(|e| e)?;

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
