use std::sync::Arc;

use async_graphql::{EmptySubscription, Schema};
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};

use crate::configs::app_context::AppContext;
use crate::interfaces::graphql::auth::{AuthMutation, AuthQuery};

/// Create the GraphQL schema with queries, mutations, and subscriptions
pub fn create_schema(app_context: Arc<AppContext>) -> Schema<AuthQuery, AuthMutation, EmptySubscription> {
    Schema::build(AuthQuery, AuthMutation, EmptySubscription)
        .data(app_context)
        .finish()
}

/// GraphQL request handler that extracts authentication and creates context
pub async fn graphql_handler(
    schema: Schema<AuthQuery, AuthMutation, EmptySubscription>,
    req: GraphQLRequest,
) -> GraphQLResponse {
    // For now, we'll create a simple handler without auth extraction
    // This will be enhanced when we integrate with the HTTP server
    schema.execute(req.into_inner()).await.into()
}
