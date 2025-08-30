use std::env;

/// SMTP email configuration
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct EmailConfig {
    pub smtp_host: String,
    pub smtp_port: u16,
    pub smtp_username: String,
    pub smtp_password: String,
    pub from_email: String,
    pub from_name: Option<String>,
    pub use_starttls: bool,
}

impl EmailConfig {
    pub fn load_from_env() -> Result<Self, Box<dyn std::error::Error>> {
        let _ = dotenv::dotenv().ok();

        let smtp_host = env::var("SMTP_HOST").unwrap_or_else(|_| "localhost".to_string());
        let smtp_port: u16 = env::var("SMTP_PORT")
            .ok()
            .and_then(|v| v.parse().ok())
            .unwrap_or(587);
        let smtp_username = env::var("SMTP_USERNAME").unwrap_or_default();
        let smtp_password = env::var("SMTP_PASSWORD").unwrap_or_default();
        let from_email =
            env::var("EMAIL_FROM").unwrap_or_else(|_| "no-reply@example.com".to_string());
        let from_name = env::var("EMAIL_FROM_NAME").ok();
        let use_starttls = env::var("SMTP_STARTTLS")
            .map(|v| v == "1" || v.eq_ignore_ascii_case("true"))
            .unwrap_or(true);

        Ok(Self {
            smtp_host,
            smtp_port,
            smtp_username,
            smtp_password,
            from_email,
            from_name,
            use_starttls,
        })
    }
}
