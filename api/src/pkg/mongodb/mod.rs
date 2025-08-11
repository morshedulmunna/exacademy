use anyhow::{Context, Result};
use mongodb::{Client, Database, options::ClientOptions};
use tokio::sync::OnceCell;

use crate::configs::{AppConfig, MongoDbDatabase};
use crate::log_info;

// Global async-initialized MongoDB client and database name
static MONGO_CLIENT: OnceCell<Client> = OnceCell::const_new();
static MONGO_DB_NAME: OnceCell<String> = OnceCell::const_new();

/// Initialize the global MongoDB client using values from `AppConfig`.
/// Call this once during application startup.
pub async fn init_mongodb(app_config: &AppConfig) -> Result<()> {
    let cfg = app_config.mongodb.clone();

    // Persist DB name for later retrieval
    let _ = MONGO_DB_NAME.set(cfg.database.clone());

    // Prepare values for logging before moving cfg into the init closure
    let db_for_log = cfg.database.clone();
    let host_for_log = cfg.host.clone();
    let port_for_log = cfg.port;

    // Initialize the client once (subsequent calls are no-ops)
    MONGO_CLIENT
        .get_or_try_init({
            let cfg_for_conn = cfg.clone();
            || async move { connect(&cfg_for_conn).await }
        })
        .await
        .expect("Database Not Connceted!");

    log_info!(
        "MongoDB connected (db: {}, host: {}, port: {})",
        db_for_log,
        host_for_log,
        port_for_log
    );

    Ok(())
}

/// Get a reference to the global MongoDB client.
/// Ensure `init_mongodb` has been called before using this.
pub async fn get_mongodb_client() -> Result<&'static Client> {
    MONGO_CLIENT
        .get()
        .context("MongoDB client not initialized. Call init_mongodb(...) during startup.")
}

/// Get a handle to the configured MongoDB database.
/// Ensure `init_mongodb` has been called before using this.
pub async fn get_mongodb_database() -> Result<Database> {
    let client = get_mongodb_client().await?;
    let db_name = MONGO_DB_NAME
        .get()
        .context("MongoDB database name not initialized. Call init_mongodb(...) during startup.")?;
    Ok(client.database(db_name))
}

// Establish a connection to MongoDB and return the client.
async fn connect(cfg: &MongoDbDatabase) -> Result<Client> {
    let uri = if !cfg.uri.trim().is_empty() {
        cfg.uri.clone()
    } else {
        build_uri_from_parts(cfg)
    };

    // Parse options and create client
    let client_options = ClientOptions::parse(&uri)
        .await
        .with_context(|| format!("Failed to parse MongoDB connection string: {}", uri))?;

    let client = Client::with_options(client_options).context("Failed to create MongoDB client")?;

    // Verify connectivity with a ping
    client
        .database("admin")
        .run_command(mongodb::bson::doc! { "ping": 1 })
        .await
        .context("MongoDB ping failed")?;

    Ok(client)
}

// Build a MongoDB URI string from granular config fields as a fallback when `uri` is empty.
fn build_uri_from_parts(cfg: &MongoDbDatabase) -> String {
    // mongodb://[user[:password]@]host:port/database?options
    let mut auth = String::new();
    match (&cfg.user, &cfg.password) {
        (Some(user), Some(password)) if !user.is_empty() => {
            auth.push_str(user);
            if !password.is_empty() {
                auth.push(':');
                auth.push_str(password);
            }
            auth.push('@');
        }
        (Some(user), None) if !user.is_empty() => {
            auth.push_str(user);
            auth.push('@');
        }
        _ => {}
    }

    let mut query_params: Vec<String> = Vec::new();
    if let Some(replica) = &cfg.replica_set {
        if !replica.is_empty() {
            query_params.push(format!("replicaSet={}", replica));
        }
    }
    query_params.push(format!("ssl={}", cfg.ssl));

    let query = if query_params.is_empty() {
        String::new()
    } else {
        format!("?{}", query_params.join("&"))
    };

    format!(
        "mongodb://{}{}:{}/{}{}",
        auth, cfg.host, cfg.port, cfg.database, query
    )
}
