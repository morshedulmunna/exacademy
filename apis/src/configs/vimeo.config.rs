use std::env;

/// Vimeo API configuration
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct VimeoConfig {
    pub token: String,
    /// Default privacy view for uploaded videos (e.g., "unlisted", "anybody", "nobody")
    pub default_privacy_view: String,
}

impl VimeoConfig {
    pub fn load_from_env() -> Result<Self, Box<dyn std::error::Error>> {
        let _ = dotenv::dotenv().ok();
        let token = env::var("VIMEO_TOKEN")?;
        let default_privacy_view =
            env::var("VIMEO_PRIVACY_VIEW").unwrap_or_else(|_| "unlisted".to_string());
        Ok(Self {
            token,
            default_privacy_view,
        })
    }
}
