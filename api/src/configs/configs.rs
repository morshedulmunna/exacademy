use serde::{Deserialize, Serialize};

/// Mode represents the application mode
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Mode {
    Development,
    Production,
    Testing,
}

impl Default for Mode {
    fn default() -> Self {
        Mode::Development
    }
}

/// PostgresDatabase represents PostgreSQL database configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PostgresDatabase {
    pub host: String,
    pub database: String,
    pub user: String,
    pub password: String,
    pub port: u16,
    pub replica_set: Option<String>,
    pub ssl: bool,
    pub max_pool_size: u64,
    pub min_pool_size: u64,
    pub max_conn_idle_time_ms: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MongoDbDatabase {
    pub uri: String,
    pub host: String,
    pub port: u16,
    pub database: String,
    pub user: Option<String>,
    pub password: Option<String>,
    pub replica_set: Option<String>,
    pub ssl: bool,
}

/// RedisConfig represents Redis cache configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RedisConfig {
    pub host: String,
    pub port: u16,
    pub password: Option<String>,
    pub db: i32,
    pub pool_size: i32,
    pub min_idle: i32,
}

/// Config represents the application configuration
#[derive(Debug, Clone, Serialize)]
pub struct AppConfig {
    pub version: String,
    pub mode: Mode,
    pub service_name: String,
    pub http_port: u16,
    pub grpc_port: u16,
    pub health_check_route: String,
    pub api_version: String,
    pub jwt_secret: String,
    pub service_base_path: String,
    pub database: PostgresDatabase,
    pub mongodb: MongoDbDatabase,
    pub redis: RedisConfig,
    pub oauth: OAuthProviders,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ProviderConfig {
    pub client_id: String,
    pub client_secret: String,
    pub redirect_uri: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct OAuthProviders {
    pub google: Option<ProviderConfig>,
    pub github: Option<ProviderConfig>,
    pub facebook: Option<ProviderConfig>,
}
