use anyhow::Result;
use mongodb::bson::doc;
use mongodb::{Database, IndexModel};
use mongodb::options::IndexOptions;

use crate::schemas::validators::validators::*;
use super::common::{create_indexes, ensure_collection};

pub(super) async fn create_likes(db: &Database) -> Result<()> {
    let coll = ensure_collection(db, "likes", Some(likes_validator())).await?;
    let unique_opts = IndexOptions::builder().unique(true).build();
    create_indexes(
        &coll,
        vec![
            IndexModel::builder()
                .keys(doc! {"userId":1, "postId":1})
                .options(unique_opts)
                .build(),
            IndexModel::builder().keys(doc! {"postId":1}).build(),
        ],
    )
    .await
}


