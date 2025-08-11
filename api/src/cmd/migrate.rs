use anyhow::Result;

use crate::configs::load::load_config;
use crate::pkg::mongodb::{get_mongodb_database, init_mongodb};
use crate::schemas::run_all_migrations;

/// Run MongoDB migrations: create collections, validators and indexes
pub async fn migrate_command() -> Result<(), Box<dyn std::error::Error>> {
    // load configs
    let config = load_config()?;
    init_mongodb(&config).await?;
    let db = get_mongodb_database().await?;
    //migration
    run_all_migrations(&db).await?;

    println!("MongoDB migrations completed");

    Ok(())
}
