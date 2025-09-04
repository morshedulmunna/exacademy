//! GraphQL interface module
//!
//! This module provides GraphQL API endpoints with authentication support.
//! The structure mirrors the REST API organization for consistency.

pub mod auth;
pub mod context;
pub mod schema;

pub use context::GraphQLContext;
pub use schema::create_schema;
