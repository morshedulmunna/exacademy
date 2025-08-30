use crate::configs::app_context::AppContext;
use crate::pkg::error::{AppError, AppResult};
use crate::pkg::redis::RedisOps;
use crate::repositories::users::{UpdateUserRecord, UsersRepository};
use crate::types::user_types::{UpdateUserRequest, UserProfile};
use std::time::Duration;

/// Fetch a user by id
pub async fn get_user_by_id(
    ctx: &AppContext,
    repo: &dyn UsersRepository,
    id: uuid::Uuid,
) -> AppResult<UserProfile> {
    // Try Redis cache first
    let cache_key = format!("user:profile:{}", id);
    if let Some(cached) = ctx
        .redis
        .get::<UserProfile>(&cache_key)
        .await
        .ok()
        .flatten()
    {
        return Ok(cached);
    }

    let user = match repo.find_by_id(id).await? {
        Some(u) => u,
        None => return Err(AppError::NotFound("User not found".into())),
    };

    let profile = UserProfile {
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
    };

    // Cache for 15 minutes (900 seconds). Ignore cache errors.
    let _ = ctx
        .redis
        .set(&cache_key, &profile, Some(Duration::from_secs(15 * 60)))
        .await;

    Ok(profile)
}

/// Update a user by id with only provided fields; returns the updated profile
pub async fn update_user_by_id(
    ctx: &AppContext,
    repo: &dyn UsersRepository,
    id: uuid::Uuid,
    input: UpdateUserRequest,
) -> AppResult<UserProfile> {
    let updated = repo
        .update_partial(
            id,
            UpdateUserRecord {
                username: input.username,
                first_name: input.first_name,
                last_name: input.last_name,
                avatar_url: input.avatar_url,
                bio: input.bio,
                date_of_birth: input.date_of_birth,
                gender: input.gender,
                phone: input.phone,
                secondary_email: input.secondary_email,
                website_url: input.website_url,
                github_url: input.github_url,
                twitter_url: input.twitter_url,
                linkedin_url: input.linkedin_url,
                facebook_url: input.facebook_url,
                instagram_url: input.instagram_url,
                youtube_url: input.youtube_url,
                address_line1: input.address_line1,
                address_line2: input.address_line2,
                city: input.city,
                state: input.state,
                postal_code: input.postal_code,
                country: input.country,
                locale: input.locale,
                timezone: input.timezone,
                marketing_opt_in: input.marketing_opt_in,
                is_active: None,
            },
        )
        .await?;

    let user = match updated {
        Some(u) => u,
        None => return Err(AppError::NotFound("User not found".into())),
    };

    let profile = UserProfile {
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
    };

    // Update cache with fresh profile; ignore cache errors
    let cache_key = format!("user:profile:{}", id);
    let _ = ctx
        .redis
        .set(&cache_key, &profile, Some(Duration::from_secs(15 * 60)))
        .await;

    Ok(profile)
}
