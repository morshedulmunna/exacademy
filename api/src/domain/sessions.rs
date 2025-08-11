use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

/// Session token aggregate
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
    pub id: Option<String>,
    pub session_token: String,
    pub user_id: String,
    pub expires: DateTime<Utc>,
}

impl Session {
    pub fn is_expired(&self) -> bool {
        self.expires <= Utc::now()
    }
}


