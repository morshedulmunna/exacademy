//! GraphQL queries module
//!
//! This module organizes GraphQL queries by domain for better maintainability
//! and scalability.

pub mod auth;
pub mod courses;
pub mod system;
pub mod users;

use async_graphql::Object;

/// Root query type that combines all domain-specific queries
pub struct QueryRoot;

/// Root mutation type that combines all domain-specific mutations
pub struct MutationRoot;

#[Object]
impl QueryRoot {
    /// System-related queries (welcome, health, etc.)
    async fn system(&self) -> system::SystemQueries {
        system::SystemQueries
    }

    /// Authentication-related queries
    async fn auth(&self) -> auth::AuthQueries {
        auth::AuthQueries
    }

    /// User-related queries
    async fn users(&self) -> users::UserQueries {
        users::UserQueries
    }

    /// Course-related queries
    async fn courses(&self) -> courses::CourseQueries {
        courses::CourseQueries
    }
}

#[Object]
impl MutationRoot {
    /// Authentication-related mutations
    async fn auth(&self) -> auth::AuthMutations {
        auth::AuthMutations
    }
}
