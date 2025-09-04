//! GraphQL schema configuration
//!
//! This module handles the creation and configuration of the GraphQL schema
//! with queries, mutations, and context data.

use async_graphql::{EmptySubscription, Schema, SchemaBuilder};
use std::sync::Arc;

use super::actions::{MutationRoot, QueryRoot};
use crate::configs::app_context::AppContext;

/// Build the GraphQL schema with queries, mutations, and application context
///
/// Creates a new GraphQL schema builder with the provided application context
/// and returns it for further configuration before finishing.
pub fn build_schema(
    ctx: Arc<AppContext>,
) -> SchemaBuilder<QueryRoot, MutationRoot, EmptySubscription> {
    Schema::build(QueryRoot, MutationRoot, EmptySubscription).data(ctx)
}

/// Create a finished GraphQL schema with the provided context
///
/// Builds and finalizes the GraphQL schema with all necessary components.
pub fn create_schema(ctx: Arc<AppContext>) -> Schema<QueryRoot, MutationRoot, EmptySubscription> {
    build_schema(ctx).finish()
}
