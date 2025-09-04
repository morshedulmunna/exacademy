use async_graphql::{Context, Result};
use validator::Validate;

use crate::applications::auth as auth_service;
use crate::interfaces::graphql::context::GraphQLContextExt;
use crate::types::users::{
    request_type::{
        ForgotPasswordRequest, GithubLoginRequest, GoogleLoginRequest, LoginRequest,
        RefreshRequest, RegisterRequest, ResendOtpRequest, ResetPasswordRequest,
        VerifyOtpRequest,
    },
    response_type::{LoginResponse as RestLoginResponse, RegisterResponse as RestRegisterResponse},
};

use super::{
    inputs::*,
    outputs::*,
};

/// GraphQL authentication mutations
pub struct AuthMutation;

#[async_graphql::Object]
impl AuthMutation {
    /// Register a new user account
    async fn register(
        &self,
        ctx: &Context<'_>,
        input: RegisterInput,
    ) -> Result<RegisterResponse> {
        // Validate input
        input.validate().map_err(|e| async_graphql::Error::new(e.to_string()))?;

        let app_ctx = &ctx.ctx().app_context;

        // Convert GraphQL input to REST request type
        let register_request = RegisterRequest {
            first_name: input.first_name,
            last_name: input.last_name,
            username: input.username,
            email: input.email,
            password: input.password,
        };

        // Call the existing auth service
        let result: RestRegisterResponse = auth_service::register(app_ctx, register_request)
            .await
            .map_err(|e| async_graphql::Error::new(e.to_string()))?;

        Ok(RegisterResponse { id: result.id })
    }

    /// Log in with email and password
    async fn login(&self, ctx: &Context<'_>, input: LoginInput) -> Result<LoginResponse> {
        // Validate input
        input.validate().map_err(|e| async_graphql::Error::new(e.to_string()))?;

        let app_ctx = &ctx.ctx().app_context;

        // Convert GraphQL input to REST request type
        let login_request = LoginRequest {
            email: input.email,
            password: input.password,
        };

        // Call the existing auth service
        let result: RestLoginResponse = auth_service::login(
            app_ctx,
            app_ctx.repos.users.as_ref(),
            login_request,
        )
        .await
        .map_err(|e| async_graphql::Error::new(e.to_string()))?;

        // Convert REST response to GraphQL response
        Ok(LoginResponse {
            user: User {
                id: result.user.id,
                username: result.user.username,
                email: result.user.email,
                role: result.user.role,
                first_name: result.user.first_name,
                last_name: result.user.last_name,
                full_name: result.user.full_name,
                avatar_url: result.user.avatar_url,
                is_active: result.user.is_active,
                is_blocked: result.user.is_blocked,
            },
            access_token: result.access_token,
            refresh_token: result.refresh_token,
            token_type: result.token_type,
            expires_in: result.expires_in,
        })
    }

    /// Refresh access token using refresh token
    async fn refresh(&self, ctx: &Context<'_>, input: RefreshInput) -> Result<TokenResponse> {
        // Validate input
        input.validate().map_err(|e| async_graphql::Error::new(e.to_string()))?;

        let app_ctx = &ctx.ctx().app_context;

        // Convert GraphQL input to REST request type
        let refresh_request = RefreshRequest {
            refresh_token: input.refresh_token,
        };

        // Call the existing auth service
        let result = auth_service::refresh(app_ctx, refresh_request)
            .await
            .map_err(|e| async_graphql::Error::new(e.to_string()))?;

        Ok(TokenResponse {
            access_token: result.access_token,
            refresh_token: result.refresh_token,
            token_type: result.token_type,
            expires_in: result.expires_in,
        })
    }

    /// Log in with Google OAuth
    async fn google_login(
        &self,
        ctx: &Context<'_>,
        input: GoogleLoginInput,
    ) -> Result<LoginResponse> {
        // Validate input
        input.validate().map_err(|e| async_graphql::Error::new(e.to_string()))?;

        let app_ctx = &ctx.ctx().app_context;

        // Convert GraphQL input to REST request type
        let google_request = GoogleLoginRequest {
            id_token: input.id_token,
        };

        // Call the existing auth service
        let result: RestLoginResponse = auth_service::google_login(
            app_ctx,
            app_ctx.repos.users.as_ref(),
            google_request,
        )
        .await
        .map_err(|e| async_graphql::Error::new(e.to_string()))?;

        // Convert REST response to GraphQL response
        Ok(LoginResponse {
            user: User {
                id: result.user.id,
                username: result.user.username,
                email: result.user.email,
                role: result.user.role,
                first_name: result.user.first_name,
                last_name: result.user.last_name,
                full_name: result.user.full_name,
                avatar_url: result.user.avatar_url,
                is_active: result.user.is_active,
                is_blocked: result.user.is_blocked,
            },
            access_token: result.access_token,
            refresh_token: result.refresh_token,
            token_type: result.token_type,
            expires_in: result.expires_in,
        })
    }

    /// Log in with GitHub OAuth
    async fn github_login(
        &self,
        ctx: &Context<'_>,
        input: GithubLoginInput,
    ) -> Result<LoginResponse> {
        // Validate input
        input.validate().map_err(|e| async_graphql::Error::new(e.to_string()))?;

        let app_ctx = &ctx.ctx().app_context;

        // Convert GraphQL input to REST request type
        let github_request = GithubLoginRequest {
            code: input.code,
        };

        // Call the existing auth service
        let result: RestLoginResponse = auth_service::github_login(
            app_ctx,
            app_ctx.repos.users.as_ref(),
            github_request,
        )
        .await
        .map_err(|e| async_graphql::Error::new(e.to_string()))?;

        // Convert REST response to GraphQL response
        Ok(LoginResponse {
            user: User {
                id: result.user.id,
                username: result.user.username,
                email: result.user.email,
                role: result.user.role,
                first_name: result.user.first_name,
                last_name: result.user.last_name,
                full_name: result.user.full_name,
                avatar_url: result.user.avatar_url,
                is_active: result.user.is_active,
                is_blocked: result.user.is_blocked,
            },
            access_token: result.access_token,
            refresh_token: result.refresh_token,
            token_type: result.token_type,
            expires_in: result.expires_in,
        })
    }

    /// Verify OTP for email verification
    async fn verify_otp(&self, ctx: &Context<'_>, input: VerifyOtpInput) -> Result<SuccessResponse> {
        // Validate input
        input.validate().map_err(|e| async_graphql::Error::new(e.to_string()))?;

        let app_ctx = &ctx.ctx().app_context;

        // Convert GraphQL input to REST request type
        let verify_request = VerifyOtpRequest {
            email: input.email,
            code: input.code,
        };

        // Call the existing auth service
        auth_service::verify_otp(
            app_ctx,
            app_ctx.repos.users.as_ref(),
            verify_request,
        )
        .await
        .map_err(|e| async_graphql::Error::new(e.to_string()))?;

        Ok(SuccessResponse::new("Email verified successfully"))
    }

    /// Resend OTP for email verification
    async fn resend_otp(
        &self,
        ctx: &Context<'_>,
        input: ResendOtpInput,
    ) -> Result<SuccessResponse> {
        // Validate input
        input.validate().map_err(|e| async_graphql::Error::new(e.to_string()))?;

        let app_ctx = &ctx.ctx().app_context;

        // Convert GraphQL input to REST request type
        let resend_request = ResendOtpRequest {
            email: input.email,
        };

        // Call the existing auth service
        auth_service::resend_otp(
            app_ctx,
            app_ctx.repos.users.as_ref(),
            resend_request,
        )
        .await
        .map_err(|e| async_graphql::Error::new(e.to_string()))?;

        Ok(SuccessResponse::new("OTP sent successfully"))
    }

    /// Request password reset
    async fn forgot_password(
        &self,
        ctx: &Context<'_>,
        input: ForgotPasswordInput,
    ) -> Result<SuccessResponse> {
        // Validate input
        input.validate().map_err(|e| async_graphql::Error::new(e.to_string()))?;

        let app_ctx = &ctx.ctx().app_context;

        // Convert GraphQL input to REST request type
        let forgot_request = ForgotPasswordRequest {
            email: input.email,
        };

        // Call the existing auth service
        auth_service::forgot_password(
            app_ctx,
            app_ctx.repos.users.as_ref(),
            forgot_request,
        )
        .await
        .map_err(|e| async_graphql::Error::new(e.to_string()))?;

        Ok(SuccessResponse::new("Password reset email sent"))
    }

    /// Reset password with OTP
    async fn reset_password(
        &self,
        ctx: &Context<'_>,
        input: ResetPasswordInput,
    ) -> Result<SuccessResponse> {
        // Validate input
        input.validate().map_err(|e| async_graphql::Error::new(e.to_string()))?;

        let app_ctx = &ctx.ctx().app_context;

        // Convert GraphQL input to REST request type
        let reset_request = ResetPasswordRequest {
            email: input.email,
            code: input.code,
            new_password: input.new_password,
        };

        // Call the existing auth service
        auth_service::reset_password(
            app_ctx,
            app_ctx.repos.users.as_ref(),
            reset_request,
        )
        .await
        .map_err(|e| async_graphql::Error::new(e.to_string()))?;

        Ok(SuccessResponse::new("Password reset successfully"))
    }

    /// Logout (invalidate refresh token)
    async fn logout(&self, _ctx: &Context<'_>) -> Result<SuccessResponse> {
        // For GraphQL, logout is typically handled client-side by removing tokens
        // But we can still provide a mutation for consistency
        Ok(SuccessResponse::new("Logged out successfully"))
    }
}

/// GraphQL authentication queries
pub struct AuthQuery;

#[async_graphql::Object]
impl AuthQuery {
    /// Get current authenticated user information
    async fn me(&self, ctx: &Context<'_>) -> Result<Option<User>> {
        let auth_user = ctx.ctx().get_auth_user().ok_or_else(|| async_graphql::Error::new("Authentication required"))?;
        let app_ctx = &ctx.ctx().app_context;

        // Get user details from database
        let user = app_ctx
            .repos
            .users
            .find_by_id(auth_user.user_id)
            .await
            .map_err(|e| async_graphql::Error::new(e.to_string()))?;

        match user {
            Some(user) => Ok(Some(User {
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
            })),
            None => Ok(None),
        }
    }
}
