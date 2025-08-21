use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use validator::Validate;

/// Common HTTP request/response types for the Auth and Users routes.
///
/// These are intentionally separated from the route handlers to reduce
/// duplication and keep a single source of truth for our API schemas.

// ========================
// Auth route types
// ========================

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct RegisterRequest {
    #[validate(length(min = 1, max = 50))]
    pub first_name: String,
    #[validate(length(min = 1, max = 50))]
    pub last_name: String,
    #[validate(length(min = 3, max = 30))]
    pub username: String,
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 8))]
    pub password: String,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct LoginRequest {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 8))]
    pub password: String,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct RefreshRequest {
    #[validate(length(min = 1))]
    pub refresh_token: String,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct RegisterResponse {
    pub id: uuid::Uuid,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct UserResponse {
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
}

#[derive(Debug, Serialize, ToSchema)]
pub struct TokenResponse {
    pub access_token: String,
    pub refresh_token: String,
    pub token_type: String,
    pub expires_in: i64,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct LoginResponse {
    pub user: UserResponse,
    pub access_token: String,
    pub refresh_token: String,
    pub token_type: String,
    pub expires_in: i64,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct OkResponse {
    pub ok: bool,
}

// ========================
// Users route types
// ========================

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct UserProfile {
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

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct UpdateUserRequest {
    #[validate(length(min = 3, max = 30))]
    pub username: Option<String>,
    #[validate(length(min = 1, max = 50))]
    pub first_name: Option<String>,
    #[validate(length(min = 1, max = 50))]
    pub last_name: Option<String>,
    #[validate(url)]
    pub avatar_url: Option<String>,
    #[validate(length(max = 280))]
    pub bio: Option<String>,
    pub date_of_birth: Option<chrono::NaiveDate>,
    pub gender: Option<String>,
    #[validate(length(min = 7, max = 20))]
    pub phone: Option<String>,
    #[validate(email)]
    pub secondary_email: Option<String>,
    #[validate(url)]
    pub website_url: Option<String>,
    #[validate(url)]
    pub github_url: Option<String>,
    #[validate(url)]
    pub twitter_url: Option<String>,
    #[validate(url)]
    pub linkedin_url: Option<String>,
    #[validate(url)]
    pub facebook_url: Option<String>,
    #[validate(url)]
    pub instagram_url: Option<String>,
    #[validate(url)]
    pub youtube_url: Option<String>,
    #[validate(length(max = 120))]
    pub address_line1: Option<String>,
    #[validate(length(max = 120))]
    pub address_line2: Option<String>,
    #[validate(length(max = 80))]
    pub city: Option<String>,
    #[validate(length(max = 80))]
    pub state: Option<String>,
    #[validate(length(max = 20))]
    pub postal_code: Option<String>,
    #[validate(length(max = 80))]
    pub country: Option<String>,
    #[validate(length(max = 10))]
    pub locale: Option<String>,
    #[validate(length(max = 50))]
    pub timezone: Option<String>,
    pub marketing_opt_in: Option<bool>,
}
