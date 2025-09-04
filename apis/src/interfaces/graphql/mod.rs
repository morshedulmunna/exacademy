//! GraphQL interface module
//!
//! This module provides GraphQL API endpoints with authentication support.
//! The structure mirrors the REST API organization for consistency.

pub mod middlewares;
pub mod queries;
pub mod server;

pub use server::*;
