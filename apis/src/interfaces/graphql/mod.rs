//! GraphQL interface module
//!
//! This module provides GraphQL API endpoints with authentication support.
//! The structure is organized into focused modules for better maintainability:
//! - `handlers`: HTTP request handlers for GraphQL queries and playground
//! - `middleware`: Middleware configuration and router setup
//! - `queries`: GraphQL schema definitions (queries, mutations, types)
//! - `schema`: Schema building and configuration
//! - `server`: Main server implementation and startup logic
//! - `shutdown`: Graceful shutdown signal handling

pub mod actions;
pub mod handlers;
pub mod middlewares;
pub mod schema;
pub mod server;
pub mod shutdown;

pub use server::*;
