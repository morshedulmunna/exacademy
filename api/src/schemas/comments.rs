use anyhow::Result;
use mongodb::bson::doc;
use mongodb::{Database, IndexModel};

use crate::schemas::validators::validators::*;
use super::common::{create_indexes, ensure_collection};

pub(super) async fn create_comments(db: &Database) -> Result<()> {
    let coll = ensure_collection(db, "comments", Some(comments_validator())).await?;
    create_indexes(
        &coll,
        vec![
            IndexModel::builder().keys(doc! {"postId":1}).build(),
            IndexModel::builder().keys(doc! {"authorId":1}).build(),
            IndexModel::builder().keys(doc! {"parentId":1}).build(),
            IndexModel::builder().keys(doc! {"createdAt":-1}).build(),
        ],
    )
    .await
}


