use anyhow::Result;
use mongodb::bson::Document;
use mongodb::options::{ValidationAction, ValidationLevel};
use mongodb::{Collection, Database, IndexModel};

/// Ensure a collection exists and apply a validator if provided.
pub(super) async fn ensure_collection(
    db: &Database,
    name: &str,
    validator: Option<Document>,
) -> Result<Collection<Document>> {
    let existing = db.list_collection_names().await?;
    if !existing.contains(&name.to_string()) {
        let mut builder = db.create_collection(name);
        if let Some(validator_doc) = validator {
            builder = builder
                .validation_level(ValidationLevel::Strict)
                .validation_action(ValidationAction::Error)
                .validator(validator_doc);
        }
        let _ = builder.await;
    }
    Ok(db.collection::<Document>(name))
}

/// Create a set of indexes if provided. No-op when empty.
pub(super) async fn create_indexes(
    coll: &Collection<Document>,
    indexes: Vec<IndexModel>,
) -> Result<()> {
    if indexes.is_empty() {
        return Ok(());
    }
    coll.create_indexes(indexes).await?;
    Ok(())
}
