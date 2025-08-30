use std::time::Duration;

use async_trait::async_trait;
use redis::RedisError;
use redis::aio::MultiplexedConnection;
use serde::Serialize;
use serde::de::DeserializeOwned;

/// Object-safe async Redis operations abstraction.
#[async_trait]
pub trait RedisOps: Send + Sync {
    /// Acquire a multiplexed async connection.
    async fn get_connection(&self) -> Result<MultiplexedConnection, RedisError>;

    /// Perform a simple PING to verify connectivity.
    async fn ping(&self) -> Result<(), RedisError>;

    /// Get a key and deserialize JSON into `T` if present.
    async fn get<T>(&self, key: &str) -> Result<Option<T>, RedisError>
    where
        T: DeserializeOwned + Send + 'static;

    /// Serialize `value` to JSON and store at `key`. Optional TTL in seconds.
    async fn set<T>(&self, key: &str, value: &T, ttl: Option<Duration>) -> Result<(), RedisError>
    where
        T: Serialize + Send + Sync + 'static;

    /// Atomically increment `key` by `by` and ensure a TTL is set.
    async fn incr_by_with_ttl(&self, key: &str, by: i64, ttl: Duration) -> Result<i64, RedisError>;
}
