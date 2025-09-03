use crate::configs::app_context::AppContext;
use crate::pkg::error::{AppError, AppResult};
use crate::pkg::security::{Claims, build_access_claims};
use crate::types::users::request_type::RefreshRequest;
use crate::types::users::response_type::TokenResponse;

/// Exchange a refresh token for an access token
pub async fn refresh(ctx: &AppContext, input: RefreshRequest) -> AppResult<TokenResponse> {
    let claims: Claims = ctx
        .jwt_service
        .verify(&input.refresh_token)
        .map_err(|_| AppError::Unauthorized("Invalid refresh token".into()))?;

    let access_claims = build_access_claims(&claims.sub, &claims.role, ctx.auth.access_ttl_seconds);
    let new_access = ctx
        .jwt_service
        .sign(&access_claims)
        .map_err(|e| AppError::Internal(e.to_string()))?;

    Ok(TokenResponse {
        access_token: new_access,
        refresh_token: input.refresh_token,
        token_type: "Bearer".into(),
        expires_in: ctx.auth.access_ttl_seconds,
    })
}
