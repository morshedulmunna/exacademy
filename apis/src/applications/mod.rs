//! Application layer services encapsulating business logic.
//!
//! These modules provide reusable operations that are independent from the
//! transport layer (HTTP, gRPC, CLI). HTTP route handlers should delegate to
//! these services for core behavior.

pub mod auth;
pub mod categories;
pub mod course_categories;
pub mod courses;
pub mod lessons;
pub mod modules;
pub mod users;
pub mod video;
