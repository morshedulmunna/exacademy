use crate::interfaces::graphql;

/// Start the GraphQL server.
///
/// Loads configuration, establishes core connections, and serves until
/// a shutdown signal is received.
pub async fn graphql_command() -> Result<(), Box<dyn std::error::Error>> {
    graphql::server::run().await?;

    Ok(())
}
