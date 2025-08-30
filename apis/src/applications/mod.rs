//! Application layer services encapsulating business logic.
//!
//! These modules provide reusable operations that are independent from the
//! transport layer (HTTP, gRPC, CLI). HTTP route handlers should delegate to
//! these services for core behavior.

pub mod auth;
pub mod courses;
pub mod modules;
pub mod lessons;
pub mod users;
