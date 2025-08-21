use axum::{Extension, Json, http::StatusCode};

use crate::pkg::Response;
use crate::pkg::auth::AuthUser;
use crate::pkg::error::AppResult;
use crate::pkg::validators::ValidatedJson;
use crate::{applications::users as users_service, types::user_types::UserProfile};
use crate::{configs::app_context::AppContext, types::user_types::UpdateUserRequest};

/// Get a user profile by id
#[utoipa::path(
    get,
    path = "/api/users/{id}",
    security(("bearerAuth" = [])),
    params(("id" = String, Path, description = "User id (UUID)")),
    responses(
        (status = 200, description = "User profile", body = UserProfile),
        (status = 404, description = "Not found", body = crate::pkg::response::ApiErrorResponse)
    ),
    tag = "Users"
)]
pub async fn get_user(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    auth_user: AuthUser,
) -> AppResult<(StatusCode, Json<Response<UserProfile>>)> {
    let user =
        users_service::get_user_by_id(&ctx, ctx.repos.users.as_ref(), auth_user.user_id).await?;
    let body = Response::with_data("User profile", user, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}

#[utoipa::path(
    patch,
    path = "/api/users/me",
    security(("bearerAuth" = [])),
    request_body = UpdateUserRequest,
    responses((status = 200, description = "Updated user", body = UserProfile)),
    tag = "Users"
)]
pub async fn update_user(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    auth_user: AuthUser,
    ValidatedJson(input_data): ValidatedJson<UpdateUserRequest>,
) -> AppResult<(StatusCode, Json<Response<UserProfile>>)> {
    let updated = users_service::update_user_by_id(
        &ctx,
        ctx.repos.users.as_ref(),
        auth_user.user_id,
        input_data,
    )
    .await?;
    let body = Response::with_data("Updated user", updated, StatusCode::OK.as_u16());
    Ok((StatusCode::OK, Json(body)))
}
