use crate::{
    configs::{
        AppConfig, Mode, MongoDbDatabase, OAuthProviders, PostgresDatabase, ProviderConfig,
        RedisConfig,
    },
    log_error,
};
use anyhow::{Context, Result};
use config::{Config, Environment, File};
use dotenv::dotenv;
use std::env;

/// Load application configuration from environment variables and .env file
pub fn load_config() -> Result<AppConfig> {
    load_config_with_dotenv(true)
}

/// Load application configuration with optional .env file loading
pub fn load_config_with_dotenv(load_dotenv: bool) -> Result<AppConfig> {
    // Load .env file if requested and it exists
    if load_dotenv {
        if let Err(e) = dotenv() {
            log_error!("Warning: Could not load .env file: {}", e);
        }
    }

    // Create config builder with proper environment variable handling
    let config = Config::builder()
        // Load from environment variables with proper prefix and separator
        .add_source(Environment::default().separator("_").try_parsing(true))
        // Load from .env file (lower priority)
        .add_source(File::with_name(".env").required(false))
        .build()
        .context("Failed to build configuration from environment variables and .env file")?;

    // Parse mode with better error handling
    let mode_str: String = config
        .get("mode")
        .context("MODE environment variable is required")?;

    let mode = match mode_str.to_lowercase().as_str() {
        "production" => Mode::Production,
        "testing" => Mode::Testing,
        "development" => Mode::Development,
        _ => {
            return Err(anyhow::anyhow!(
                "Invalid MODE value: {}. Must be one of: development, production, testing",
                mode_str
            ));
        }
    };

    // Build database config with better error handling
    let database = PostgresDatabase {
        host: config
            .get("database.host")
            .context("DATABASE_HOST environment variable is required")?,
        database: config
            .get("database.database")
            .context("DATABASE_DATABASE environment variable is required")?,
        user: config
            .get("database.user")
            .context("DATABASE_USER environment variable is required")?,
        password: config
            .get("database.password")
            .context("DATABASE_PASSWORD environment variable is required")?,
        port: config
            .get("database.port")
            .context("DATABASE_PORT environment variable is required")?,
        // With separator("_"), underscores split into nested keys
        // e.g., DATABASE_REPLICA_SET => database.replica.set
        replica_set: config.get("database.replica.set").ok(),
        ssl: config
            .get("database.ssl")
            .context("DATABASE_SSL environment variable is required")?,
        max_pool_size: config
            .get("database.max.pool.size")
            .context("DATABASE_MAX_POOL_SIZE environment variable is required")?,
        min_pool_size: config
            .get("database.min.pool.size")
            .context("DATABASE_MIN_POOL_SIZE environment variable is required")?,
        max_conn_idle_time_ms: config
            .get("database.max.conn.idle.time.ms")
            .context("DATABASE_MAX_CONN_IDLE_TIME_MS environment variable is required")?,
    };

    let mongodb = MongoDbDatabase {
        uri: config
            .get("mongodb.uri")
            .context("MONGODB_URI environment variable is required")?,
        host: config
            .get("mongodb.host")
            .context("MONGODB_HOST environment variable is required")?,
        port: config
            .get("mongodb.port")
            .context("MONGODB_PORT environment variable is required")?,
        database: config
            .get("mongodb.database")
            .context("MONGODB_DATABASE environment variable is required")?,
        user: config.get("mongodb.user").ok(),
        password: config.get("mongodb.password").ok(),
        replica_set: config.get("mongodb.replica.set").ok(),
        ssl: config
            .get("mongodb.ssl")
            .context("MONGODB_SSL environment variable is required")?,
    };

    // Build Redis config with better error handling
    let redis = RedisConfig {
        host: config
            .get("redis.host")
            .context("REDIS_HOST environment variable is required")?,
        port: config
            .get("redis.port")
            .context("REDIS_PORT environment variable is required")?,
        password: config.get("redis.password").ok(),
        db: config
            .get("redis.db")
            .context("REDIS_DB environment variable is required")?,
        pool_size: config
            .get("redis.pool.size")
            .context("REDIS_POOL_SIZE environment variable is required")?,
        min_idle: config
            .get("redis.min.idle")
            .context("REDIS_MIN_IDLE environment variable is required")?,
    };

    // Get JWT secret from environment (required)
    let jwt_secret =
        env::var("JWT_SECRET").context("JWT_SECRET environment variable is required")?;

    // Build final config with better error handling
    let app_config = AppConfig {
        version: config
            .get("version")
            .unwrap_or_else(|_| "1.0.0".to_string()),
        mode,
        service_name: config
            .get("service.name")
            .context("SERVICE_NAME environment variable is required")?,
        http_port: config
            .get("http.port")
            .context("HTTP_PORT environment variable is required")?,
        grpc_port: config
            .get("grpc.port")
            .context("GRPC_PORT environment variable is required")?,
        health_check_route: config
            .get("health.check.route")
            .context("HEALTH_CHECK_ROUTE environment variable is required")?,
        api_version: config
            .get("api.version")
            .context("API_VERSION environment variable is required")?,
        jwt_secret,
        service_base_path: config
            .get("service.base.path")
            .context("SERVICE_BASE_PATH environment variable is required")?,
        database,
        mongodb,
        redis,
        oauth: OAuthProviders {
            google: config.get::<ProviderConfig>("oauth.google").ok(),
            github: config.get::<ProviderConfig>("oauth.github").ok(),
            facebook: config.get::<ProviderConfig>("oauth.facebook").ok(),
        },
    };

    Ok(app_config)
}
