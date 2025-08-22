use std::sync::Arc;

use anyhow::Result;
use execute_academy::pkg::email::{EmailContent, EmailMessage};
use execute_academy::pkg::security::{Claims, build_access_claims};
use execute_academy::pkg::security_services::{JwtService, PasswordHasher};

/// In-memory mailer for tests; collects sent messages for assertions.
#[derive(Default, Clone)]
pub struct InMemoryMailer {
    pub sent: Arc<std::sync::Mutex<Vec<EmailMessage>>>,
}

impl InMemoryMailer {
    pub fn new() -> Self {
        Self::default()
    }
    pub async fn send_email(&self, msg: &EmailMessage) -> Result<()> {
        self.sent.lock().unwrap().push(msg.clone());
        Ok(())
    }
    pub fn last_html(&self) -> Option<String> {
        self.sent
            .lock()
            .unwrap()
            .last()
            .and_then(|m| match &m.content {
                EmailContent::Raw { html_body, .. } => Some(html_body.clone()),
                _ => None,
            })
    }
}

/// Trivial password hasher for tests. DO NOT USE IN PRODUCTION.
pub struct PlaintextHasher;
impl PasswordHasher for PlaintextHasher {
    fn hash(&self, plain: &str) -> Result<String> {
        Ok(format!("plain:{}", plain))
    }
    fn verify(&self, plain: &str, hashed: &str) -> Result<bool> {
        Ok(hashed == format!("plain:{}", plain))
    }
}

/// Deterministic JWT service for tests; encodes claims as JSON string.
pub struct DeterministicJwt;
impl JwtService for DeterministicJwt {
    fn sign(&self, claims: &Claims) -> Result<String> {
        Ok(serde_json::to_string(claims)?)
    }
    fn verify(&self, token: &str) -> Result<Claims> {
        Ok(serde_json::from_str(token)?)
    }
}

/// Helper to build claims identical to production helper but without secrets.
pub fn test_access_claims(user_id: &str, role: &str, ttl: i64) -> Claims {
    build_access_claims(user_id, role, ttl)
}
