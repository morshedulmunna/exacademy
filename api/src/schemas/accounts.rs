use anyhow::Result;
use mongodb::bson::doc;
use mongodb::{Database, IndexModel};
use mongodb::options::IndexOptions;

use crate::schemas::validators::validators::*;
use super::common::{create_indexes, ensure_collection};

pub(super) async fn create_accounts(db: &Database) -> Result<()> {
    let coll = ensure_collection(db, "accounts", Some(accounts_validator())).await?;
    let combo_idx = IndexModel::builder()
        .keys(doc! {"provider":1, "providerAccountId":1})
        .options(IndexOptions::builder().unique(true).build())
        .build();
    create_indexes(&coll, vec![combo_idx]).await
}


