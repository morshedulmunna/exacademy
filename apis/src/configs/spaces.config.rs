use std::env;

/// DigitalOcean Spaces (S3-compatible) configuration
#[derive(Debug, Clone)]
pub struct SpacesConfig {
    pub endpoint: String,
    pub region: String,
    pub access_key_id: String,
    pub secret_access_key: String,
    pub bucket_name: String,
    pub public_url: String,
}

impl SpacesConfig {
    /// Load configuration from environment variables
    pub fn load_from_env() -> Result<Self, Box<dyn std::error::Error>> {
        Ok(Self {
            endpoint: env::var("SPACES_ENDPOINT").map_err(|_| "SPACES_ENDPOINT is required")?,
            region: env::var("SPACES_REGION").map_err(|_| "SPACES_REGION is required")?,
            access_key_id: env::var("SPACES_ACCESS_KEY_ID")
                .map_err(|_| "SPACES_ACCESS_KEY_ID is required")?,
            secret_access_key: env::var("SPACES_SECRET_ACCESS_KEY")
                .map_err(|_| "SPACES_SECRET_ACCESS_KEY is required")?,
            bucket_name: env::var("SPACES_BUCKET_NAME")
                .map_err(|_| "SPACES_BUCKET_NAME is required")?,
            public_url: env::var("SPACES_PUBLIC_URL")
                .map_err(|_| "SPACES_PUBLIC_URL is required")?,
        })
    }
}
