//! GraphQL authentication module
//!
//! This module provides GraphQL resolvers for authentication operations.
//! The structure mirrors the REST API auth handlers for consistency.

pub mod inputs;
pub mod outputs;
pub mod resolvers;

pub use inputs::*;
pub use outputs::*;
pub use resolvers::*;
