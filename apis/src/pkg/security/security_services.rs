use anyhow::Result;

use crate::pkg::security::{Claims, build_access_claims};

/// Abstraction for password hashing and verification.
pub trait PasswordHasher: Send + Sync {
    /// Hash a plaintext password using a secure algorithm.
    fn hash(&self, plain: &str) -> Result<String>;

    /// Verify a plaintext password against a previously hashed value.
    fn verify(&self, plain: &str, hashed: &str) -> Result<bool>;
}

/// Abstraction for JWT signing and verification.
pub trait JwtService: Send + Sync {
    /// Sign the provided claims and return a compact JWT.
    fn sign(&self, claims: &Claims) -> Result<String>;

    /// Verify a compact JWT string and return the decoded Claims.
    fn verify(&self, token: &str) -> Result<Claims>;
}

/// Argon2-based password hasher implementation.
pub struct Argon2PasswordHasher;

impl PasswordHasher for Argon2PasswordHasher {
    fn hash(&self, plain: &str) -> Result<String> {
        crate::pkg::security::hash_password(plain)
    }

    fn verify(&self, plain: &str, hashed: &str) -> Result<bool> {
        crate::pkg::security::verify_password(plain, hashed)
    }
}

/// HMAC-SHA based JWT service implementation with a shared secret.
pub struct Hs256JwtService {
    pub secret: String,
}

impl Hs256JwtService {
    /// Build access token claims helper using configured TTL.
    pub fn build_access_claims(&self, user_id: &str, role: &str, ttl_seconds: i64) -> Claims {
        build_access_claims(user_id, role, ttl_seconds)
    }
}

impl JwtService for Hs256JwtService {
    fn sign(&self, claims: &Claims) -> Result<String> {
        crate::pkg::security::sign_jwt(claims, &self.secret)
    }

    fn verify(&self, token: &str) -> Result<Claims> {
        crate::pkg::security::verify_jwt(token, &self.secret)
    }
}
