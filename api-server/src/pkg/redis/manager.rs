use std::time::Duration;

use async_trait::async_trait;
use redis::aio::MultiplexedConnection;
use redis::{AsyncCommands, RedisError};
use serde::Serialize;
use serde::de::DeserializeOwned;

use crate::configs::redis_config::RedisConfig;

use super::traits::RedisOps;

/// Thin, cloneable wrapper to manage a Redis client and provide common helpers.
#[derive(Clone)]
pub struct RedisManager {
    pub(crate) client: redis::Client,
}

impl RedisManager {
    /// Create a new manager from a connection URL.
    pub fn new(redis_url: String) -> Result<Self, RedisError> {
        let client = redis::Client::open(redis_url)?;
        Ok(Self { client })
    }

    /// Create a new manager from `RedisConfig`.
    pub fn from_config(config: &RedisConfig) -> Result<Self, RedisError> {
        Self::new(config.redis_url.clone())
    }

    /// Internal helper to get conn (non-trait for internal reuse)
    async fn connection(&self) -> Result<MultiplexedConnection, RedisError> {
        self.client.get_multiplexed_tokio_connection().await
    }
}

#[async_trait]
impl RedisOps for RedisManager {
    async fn get_connection(&self) -> Result<MultiplexedConnection, RedisError> {
        self.connection().await
    }

    async fn ping(&self) -> Result<(), RedisError> {
        let mut conn = self.get_connection().await?;
        let _: String = redis::cmd("PING").query_async(&mut conn).await?;
        Ok(())
    }

    async fn get<T>(&self, key: &str) -> Result<Option<T>, RedisError>
    where
        T: DeserializeOwned + Send + 'static,
    {
        let mut conn = self.get_connection().await?;
        let bytes: Option<Vec<u8>> = conn.get(key).await?;
        if let Some(b) = bytes {
            let val = serde_json::from_slice::<T>(&b).map_err(|e| {
                RedisError::from((redis::ErrorKind::TypeError, "json decode", e.to_string()))
            })?;
            Ok(Some(val))
        } else {
            Ok(None)
        }
    }

    async fn set<T>(&self, key: &str, value: &T, ttl: Option<Duration>) -> Result<(), RedisError>
    where
        T: Serialize + Send + Sync + 'static,
    {
        let mut conn = self.get_connection().await?;
        let payload = serde_json::to_vec(value).map_err(|e| {
            RedisError::from((redis::ErrorKind::TypeError, "json encode", e.to_string()))
        })?;

        match ttl {
            Some(t) => {
                // SET key value EX ttl_seconds
                let _: () = redis::cmd("SET")
                    .arg(key)
                    .arg(payload)
                    .arg("EX")
                    .arg(t.as_secs() as usize)
                    .query_async(&mut conn)
                    .await?;
            }
            None => {
                let _: () = conn.set(key, payload).await?;
            }
        }
        Ok(())
    }

    async fn incr_by_with_ttl(&self, key: &str, by: i64, ttl: Duration) -> Result<i64, RedisError> {
        let mut conn = self.get_connection().await?;
        let mut p = redis::pipe();
        p.cmd("INCRBY").arg(key).arg(by).ignore();
        p.cmd("EXPIRE")
            .arg(key)
            .arg(ttl.as_secs() as usize)
            .ignore();

        // To return the new value, run GET at the end
        p.cmd("GET").arg(key);

        let result: ((), (), Option<i64>) = p.query_async(&mut conn).await?;
        match result.2 {
            Some(val) => Ok(val),
            None => Ok(0),
        }
    }
}
