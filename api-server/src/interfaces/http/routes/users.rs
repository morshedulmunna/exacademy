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
    Ok(Json(UserProfile {
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
        created_at: user.created_at,
    }))
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
    let updated = users_service::update_user_by_id(
        &ctx,
        ctx.repos.users.as_ref(),
        id,
        users_service::UpdateUserInput {
            username: req.username,
            first_name: req.first_name,
            last_name: req.last_name,
            avatar_url: req.avatar_url,
            bio: req.bio,
            date_of_birth: req.date_of_birth,
            gender: req.gender,
            phone: req.phone,
            secondary_email: req.secondary_email,
            website_url: req.website_url,
            github_url: req.github_url,
            twitter_url: req.twitter_url,
            linkedin_url: req.linkedin_url,
            facebook_url: req.facebook_url,
            instagram_url: req.instagram_url,
            youtube_url: req.youtube_url,
            address_line1: req.address_line1,
            address_line2: req.address_line2,
            city: req.city,
            state: req.state,
            postal_code: req.postal_code,
            country: req.country,
            locale: req.locale,
            timezone: req.timezone,
            marketing_opt_in: req.marketing_opt_in,
        },
    )
    .await?;

    Ok(Json(UserProfile {
        id: updated.id,
        username: updated.username,
        email: updated.email,
        role: updated.role,
        first_name: updated.first_name,
        last_name: updated.last_name,
        full_name: updated.full_name,
        avatar_url: updated.avatar_url,
        is_active: updated.is_active,
        is_blocked: updated.is_blocked,
        created_at: updated.created_at,
    }))
}
