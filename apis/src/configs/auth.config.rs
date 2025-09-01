use std::env;

/// Authentication/JWT configuration
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AuthConfig {
    pub jwt_secret: String,
    pub jwt_issuer: String,
    pub access_ttl_seconds: i64,
    pub refresh_ttl_seconds: i64,
    /// Google OAuth client id to validate Google ID tokens (audience check)
    pub google_client_id: String,
    /// GitHub OAuth application client id
    pub github_client_id: String,
    /// GitHub OAuth application client secret
    pub github_client_secret: String,
}

impl AuthConfig {
    pub fn load_from_env() -> Result<Self, Box<dyn std::error::Error>> {
        let _ = dotenv::dotenv().ok();

        let jwt_secret =
            env::var("JWT_SECRET").unwrap_or_else(|_| "dev_secret_change_me".to_string());
        let jwt_issuer = env::var("JWT_ISSUER").unwrap_or_else(|_| "execute_academy".to_string());
        let access_ttl_seconds = env::var("JWT_ACCESS_TTL_SECONDS")
            .ok()
            .and_then(|v| v.parse::<i64>().ok())
            .unwrap_or(2000);
        let refresh_ttl_seconds = env::var("JWT_REFRESH_TTL_SECONDS")
            .ok()
            .and_then(|v| v.parse::<i64>().ok())
            .unwrap_or(60 * 60 * 24 * 30);

        // Social auth config (optional, but required for those flows)
        let google_client_id = env::var("GOOGLE_OAUTH_CLIENT_ID").unwrap_or_default();
        let github_client_id = env::var("GITHUB_OAUTH_CLIENT_ID").unwrap_or_default();
        let github_client_secret = env::var("GITHUB_OAUTH_CLIENT_SECRET").unwrap_or_default();

        Ok(Self {
            jwt_secret,
            jwt_issuer,
            access_ttl_seconds,
            refresh_ttl_seconds,
            google_client_id,
            github_client_id,
            github_client_secret,
        })
    }
}
