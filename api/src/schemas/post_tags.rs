use anyhow::Result;
use mongodb::bson::doc;
use mongodb::{Database, IndexModel};
use mongodb::options::IndexOptions;

use crate::schemas::validators::validators::*;
use super::common::{create_indexes, ensure_collection};

pub(super) async fn create_post_tags(db: &Database) -> Result<()> {
    let coll = ensure_collection(db, "post_tags", Some(post_tags_validator())).await?;
    let unique_opts = IndexOptions::builder().unique(true).build();
    create_indexes(
        &coll,
        vec![
            IndexModel::builder().keys(doc! {"postId":1}).build(),
            IndexModel::builder().keys(doc! {"tagId":1}).build(),
            IndexModel::builder()
                .keys(doc! {"postId":1, "tagId":1})
                .options(unique_opts)
                .build(),
        ],
    )
    .await
}


