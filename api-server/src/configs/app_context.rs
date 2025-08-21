use std::error::Error;
use std::sync::Arc;

use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};

use crate::configs::auth_config::AuthConfig;
use crate::configs::db_config::DatabaseConfig;
use crate::configs::redis_config::RedisConfig;
use crate::configs::system_config::SystemConfig;
use crate::log_info;
use crate::pkg::security_services::{
    Argon2PasswordHasher, Hs256JwtService, JwtService, PasswordHasher,
};
use crate::repositories::Repositories;

use crate::pkg::redis::RedisManager;
use crate::pkg::redis::RedisOps;
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
}

impl AppContext {
    /// Initialize the application context from environment variables and
    /// establish the database connection pool.
    pub async fn initialize() -> Result<Self, Box<dyn Error>> {
        let system = SystemConfig::load_from_env()?;
        let database = DatabaseConfig::load_from_env()?;
        let redis_cfg = RedisConfig::load_from_env()?;
        let auth = AuthConfig::load_from_env()?;

        let db_pool = PgPoolOptions::new()
            .max_connections(10)
            .connect(&database.database_url)
            .await?;

        log_info!("Connected to Postgres");

        // Initialize Redis manager and verify connectivity once
        let redis_manager = Arc::new(RedisManager::from_config(&redis_cfg)?);
        redis_manager.ping().await?;
        log_info!("Connected to Redis");

        let repos = Repositories::new(db_pool.clone());

        // Build security services (concrete implementations) and box behind traits
        let password_hasher: Arc<dyn PasswordHasher> = Arc::new(Argon2PasswordHasher);
        let jwt_service: Arc<dyn JwtService> = Arc::new(Hs256JwtService {
            secret: auth.jwt_secret.clone(),
        });

        Ok(Self {
            system,
            db_pool: db_pool.clone(),
            redis_config: redis_cfg,
            redis: redis_manager,
            auth,
            repos,
            password_hasher,
            jwt_service,
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
