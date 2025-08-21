use crate::configs::app_context::AppContext;
use crate::pkg::error::{AppError, AppResult};
use crate::repositories::users::{UpdateUserRecord, UsersRepository};

/// Response shape for a single user profile
#[derive(Debug)]
pub struct UserProfileOutput {
    pub id: uuid::Uuid,
    pub username: String,
    pub email: String,
    pub role: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub full_name: Option<String>,
    pub avatar_url: Option<String>,
    pub is_active: bool,
    pub is_blocked: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

/// Fetch a user by id
pub async fn get_user_by_id(
    _ctx: &AppContext,
    repo: &dyn UsersRepository,
    id: uuid::Uuid,
) -> AppResult<UserProfileOutput> {
    let user = match repo.find_by_id(id).await? {
        Some(u) => u,
        None => return Err(AppError::NotFound("User not found".into())),
    };

    Ok(UserProfileOutput {
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
    })
}

/// Input shape for updating a subset of user profile fields
#[derive(Debug, Default)]
pub struct UpdateUserInput {
    pub username: Option<String>,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub avatar_url: Option<String>,
    pub bio: Option<String>,
    pub date_of_birth: Option<chrono::NaiveDate>,
    pub gender: Option<String>,
    pub phone: Option<String>,
    pub secondary_email: Option<String>,
    pub website_url: Option<String>,
    pub github_url: Option<String>,
    pub twitter_url: Option<String>,
    pub linkedin_url: Option<String>,
    pub facebook_url: Option<String>,
    pub instagram_url: Option<String>,
    pub youtube_url: Option<String>,
    pub address_line1: Option<String>,
    pub address_line2: Option<String>,
    pub city: Option<String>,
    pub state: Option<String>,
    pub postal_code: Option<String>,
    pub country: Option<String>,
    pub locale: Option<String>,
    pub timezone: Option<String>,
    pub marketing_opt_in: Option<bool>,
}

/// Update a user by id with only provided fields; returns the updated profile
pub async fn update_user_by_id(
    _ctx: &AppContext,
    repo: &dyn UsersRepository,
    id: uuid::Uuid,
    input: UpdateUserInput,
) -> AppResult<UserProfileOutput> {
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
            },
        )
        .await?;

    let user = match updated {
        Some(u) => u,
        None => return Err(AppError::NotFound("User not found".into())),
    };

    Ok(UserProfileOutput {
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
    })
}
