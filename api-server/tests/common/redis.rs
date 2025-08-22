use execute_academy::pkg::redis::RedisManager;
use std::sync::Arc;

/// Construct a Redis manager for tests using REDIS_URL or a local default.
pub fn test_redis_manager() -> Arc<RedisManager> {
    let _ = dotenv::dotenv().ok();
    let url = std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1:6379/0".to_string());
    let manager = RedisManager::new(url).expect("connect to redis for tests");
    Arc::new(manager)
}
