use async_graphql::SimpleObject;
use uuid::Uuid;

/// User information response
#[derive(Debug, SimpleObject)]
pub struct User {
    pub id: Uuid,
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

/// Login response containing user info and tokens
#[derive(Debug, SimpleObject)]
pub struct LoginResponse {
    pub user: User,
    pub access_token: String,
    pub refresh_token: String,
    pub token_type: String,
    pub expires_in: i64,
}

/// Registration response
#[derive(Debug, SimpleObject)]
pub struct RegisterResponse {
    pub id: Uuid,
}

/// Token response for refresh operations
#[derive(Debug, SimpleObject)]
pub struct TokenResponse {
    pub access_token: String,
    pub refresh_token: String,
    pub token_type: String,
    pub expires_in: i64,
}

/// Simple success response
#[derive(Debug, SimpleObject)]
pub struct SuccessResponse {
    pub success: bool,
    pub message: String,
}

impl SuccessResponse {
    pub fn new(message: &str) -> Self {
        Self {
            success: true,
            message: message.to_string(),
        }
    }
}
