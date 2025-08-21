use axum::{
    Extension, Json, Router,
    extract::Path,
    routing::{get, patch},
};

use crate::pkg::error::AppResult;
use crate::{applications::users as users_service, types::user_types::UserProfile};
use crate::{configs::app_context::AppContext, types::user_types::UpdateUserRequest};

pub fn router() -> Router {
    Router::new()
        .route("/api/users/:id", get(get_user))
        .route("/api/users/:id", patch(update_user))
}

/// Get a user profile by id
#[utoipa::path(
    get,
    path = "/api/users/{id}",
    params(("id" = String, Path, description = "User id (UUID)")),
    responses(
        (status = 200, description = "User profile", body = UserProfile),
        (status = 404, description = "Not found", body = crate::pkg::response::ApiErrorResponse)
    ),
    tag = "Users"
)]
async fn get_user(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<uuid::Uuid>,
) -> AppResult<Json<UserProfile>> {
    let user = users_service::get_user_by_id(&ctx, ctx.repos.users.as_ref(), id).await?;
    Ok(Json(user))
}

#[utoipa::path(
    patch,
    path = "/api/users/{id}",
    request_body = UpdateUserRequest,
    params(("id" = String, Path, description = "User id (UUID)")),
    responses((status = 200, description = "Updated user", body = UserProfile)),
    tag = "Users"
)]
async fn update_user(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<uuid::Uuid>,
    Json(req): Json<UpdateUserRequest>,
) -> AppResult<Json<UserProfile>> {
    let updated = users_service::update_user_by_id(&ctx, ctx.repos.users.as_ref(), id, req).await?;
    Ok(Json(updated))
}
