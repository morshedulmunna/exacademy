use std::error::Error;
use std::sync::Arc;

use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};

use crate::configs::auth_config::AuthConfig;
use crate::configs::db_config::DatabaseConfig;
// Kafka is not used
use crate::configs::email_config::EmailConfig;
use crate::configs::redis_config::RedisConfig;
use crate::configs::system_config::SystemConfig;
use crate::configs::vimeo_config::VimeoConfig;
// Email is sent directly where needed; no producer required
use crate::pkg::security_services::{
    Argon2PasswordHasher, Hs256JwtService, JwtService, PasswordHasher,
};
use crate::repositories::Repositories;

use crate::pkg::redis::RedisManager;
use crate::pkg::redis::RedisOps;
use crate::pkg::vimeo::VimeoClient;
use tokio::sync::OnceCell;

/// Application context containing runtime configuration and core connections.
#[derive(Clone)]
pub struct AppContext {
    pub system: SystemConfig,
    pub db_pool: Pool<Postgres>,
    pub redis_config: RedisConfig,
    pub redis: Arc<RedisManager>,
    pub auth: AuthConfig,
    pub repos: Repositories,
    pub password_hasher: Arc<dyn PasswordHasher>,
    pub jwt_service: Arc<dyn JwtService>,
    pub email: EmailConfig,
    pub email_sender: Arc<dyn crate::pkg::email::EmailSender>,
    pub vimeo: VimeoConfig,
    pub vimeo_client: Arc<VimeoClient>,
}

impl AppContext {
    /// Initialize the application context from environment variables and
    /// establish the database connection pool.
    pub async fn initialize() -> Result<Self, Box<dyn Error>> {
        // Load email configuration
        let system = SystemConfig::load_from_env()?;
        let database = DatabaseConfig::load_from_env()?;
        let redis_cfg = RedisConfig::load_from_env()?;
        let auth = AuthConfig::load_from_env()?;
        let email_cfg = EmailConfig::load_from_env()?;
        let vimeo_cfg = VimeoConfig::load_from_env()?;

        let db_pool = PgPoolOptions::new()
            .max_connections(10)
            .connect(&database.database_url)
            .await?;

        println!("Connected to Postgres");

        let repos = Repositories::new(db_pool.clone());

        // Initialize Redis manager and verify connectivity once
        let redis_manager = Arc::new(RedisManager::from_config(&redis_cfg)?);
        redis_manager.ping().await?;
        println!("Redis server conncet!!");

        // Build security services (concrete implementations) and box behind traits
        let password_hasher: Arc<dyn PasswordHasher> = Arc::new(Argon2PasswordHasher);
        let jwt_service: Arc<dyn JwtService> = Arc::new(Hs256JwtService {
            secret: auth.jwt_secret.clone(),
        });

        // Initialize SMTP sender
        let email_sender_impl =
            crate::pkg::email::smtp_sender::SmtpEmailSender::try_new(&email_cfg)?;
        let email_sender: Arc<dyn crate::pkg::email::EmailSender> = Arc::new(email_sender_impl);

        // Vimeo client
        let vimeo_client: Arc<VimeoClient> = Arc::new(VimeoClient::new(&vimeo_cfg.token));

        Ok(Self {
            system,
            db_pool: db_pool.clone(),
            redis_config: redis_cfg,
            redis: redis_manager,
            auth,
            repos,
            password_hasher,
            jwt_service,
            email: email_cfg,
            email_sender,
            vimeo: vimeo_cfg,
            vimeo_client,
        })
    }

    /// Global singleton accessor. Ensures the context is initialized only once.
    pub async fn get() -> Result<&'static Arc<AppContext>, Box<dyn Error>> {
        static APP_CTX: OnceCell<Arc<AppContext>> = OnceCell::const_new();
        let ctx = APP_CTX
            .get_or_try_init(|| async {
                let ctx = AppContext::initialize().await?;
                Ok::<Arc<AppContext>, Box<dyn Error>>(Arc::new(ctx))
            })
            .await?;
        Ok(ctx)
    }
}
