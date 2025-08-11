use anyhow::Result;
use mongodb::bson::doc;
use mongodb::options::IndexOptions;
use mongodb::{Database, IndexModel};

use super::common::{create_indexes, ensure_collection};
use crate::schemas::validators::validators::*;

pub(super) async fn create_verification_tokens(db: &Database) -> Result<()> {
    let coll = ensure_collection(
        db,
        "verification_tokens",
        Some(verification_tokens_validator()),
    )
    .await?;
    let mut unique = IndexOptions::default();
    unique.unique = Some(true);
    create_indexes(
        &coll,
        vec![
            IndexModel::builder()
                .keys(doc! {"token":1})
                .options(unique)
                .build(),
        ],
    )
    .await
}
