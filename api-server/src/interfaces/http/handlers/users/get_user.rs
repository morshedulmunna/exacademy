use axum::{Extension, Json, http::StatusCode};

use crate::pkg::Response;
use crate::pkg::auth::AuthUser;
use crate::pkg::error::AppResult;
use crate::{applications::users as users_service, types::user_types::UserProfile};
use crate::configs::app_context::AppContext;

/// Get a user profile by id
#[utoipa::path(
    get,
    path = "/api/users",
    security(("bearerAuth" = [])),
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


