//! Redis utilities
//!
//! Production-ready, minimal wrapper around the `redis` crate providing
//! a trait-based API and a concrete manager.

pub mod manager;
pub mod traits;

pub use self::manager::RedisManager;
pub use self::traits::RedisOps;
