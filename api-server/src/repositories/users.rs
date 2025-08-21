use crate::pkg::error::AppResult;

/// Domain model for a user as persisted in the database layer
#[derive(Debug, Clone)]
pub struct UserRecord {
    pub id: uuid::Uuid,
    pub username: String,
    pub email: String,
    pub password_hash: Option<String>,
    pub role: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub full_name: Option<String>,
    pub avatar_url: Option<String>,
    pub is_active: bool,
    pub is_blocked: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

/// Input for creating a user in the repository
#[derive(Debug, Clone)]
pub struct CreateUserRecord {
    pub username: String,
    pub email: String,
    pub password_hash: String,
    pub role: String,
}

/// Input for updating user fields; mirrors application-level but repository-facing
#[derive(Debug, Default, Clone)]
pub struct UpdateUserRecord {
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

#[async_trait::async_trait]
pub trait UsersRepository: Send + Sync {
    async fn find_by_email(&self, email: &str) -> AppResult<Option<UserRecord>>;
    async fn find_by_id(&self, id: uuid::Uuid) -> AppResult<Option<UserRecord>>;
    async fn create(&self, input: CreateUserRecord) -> AppResult<uuid::Uuid>;
    async fn update_partial(
        &self,
        id: uuid::Uuid,
        input: UpdateUserRecord,
    ) -> AppResult<Option<UserRecord>>;
}
