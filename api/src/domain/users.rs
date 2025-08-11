use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

/// Role of a user in the system
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum UserRole {
    USER,
    ADMIN,
}

/// Core user aggregate root
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub email: String,
    pub name: String,
    pub username: String,
    pub password_hash: String,
    pub role: UserRole,
    pub bio: Option<String>,
    pub avatar: Option<String>,
    pub website: Option<String>,
    pub location: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl User {
    pub fn is_admin(&self) -> bool {
        self.role == UserRole::ADMIN
    }
}
