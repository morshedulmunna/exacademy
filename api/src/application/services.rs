use anyhow::Result;
use async_trait::async_trait;
use chrono::{Duration, Utc};
use rand::{distributions::Alphanumeric, Rng};

use crate::domain::sessions::Session;
use crate::domain::users::User;

/// Abstractions for repositories to adhere to DDD
#[async_trait]
pub trait UserRepository: Send + Sync {
    async fn find_by_email(&self, email: &str) -> Result<Option<User>>;
    async fn find_by_id(&self, id: &str) -> Result<Option<User>>;
}

#[async_trait]
pub trait SessionRepository: Send + Sync {
    async fn create(&self, session: &Session) -> Result<Session>;
    async fn find_by_token(&self, token: &str) -> Result<Option<Session>>;
    async fn delete_by_token(&self, token: &str) -> Result<()>;
}

/// Authentication service use-cases
pub struct AuthService<U: UserRepository, S: SessionRepository> {
    users: U,
    sessions: S,
    default_ttl_hours: i64,
}

impl<U: UserRepository, S: SessionRepository> AuthService<U, S> {
    pub fn new(users: U, sessions: S, default_ttl_hours: i64) -> Self {
        Self {
            users,
            sessions,
            default_ttl_hours,
        }
    }

    /// Create a new session for a given user id
    pub async fn create_session(&self, user_id: &str) -> Result<Session> {
        let token: String = rand::thread_rng()
            .sample_iter(&Alphanumeric)
            .take(64)
            .map(char::from)
            .collect();
        let expires = Utc::now() + Duration::hours(self.default_ttl_hours);
        let session = Session {
            id: None,
            session_token: token,
            user_id: user_id.to_string(),
            expires,
        };
        self.sessions.create(&session).await
    }

    /// Validate a session token and return associated user when valid
    pub async fn validate_session(&self, token: &str) -> Result<Option<User>> {
        if let Some(session) = self.sessions.find_by_token(token).await? {
            if session.is_expired() {
                let _ = self.sessions.delete_by_token(token).await;
                return Ok(None);
            }
            return self.users.find_by_id(&session.user_id).await;
        }
        Ok(None)
    }

    /// Destroy a session by token
    pub async fn destroy_session(&self, token: &str) -> Result<()> {
        self.sessions.delete_by_token(token).await
    }
}


