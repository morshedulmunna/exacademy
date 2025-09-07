use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

// ========================
// Users route types
// ========================

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct UserProfile {
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
    pub created_at: chrono::DateTime<chrono::Utc>,
}
