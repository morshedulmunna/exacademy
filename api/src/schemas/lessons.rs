use anyhow::Result;
use mongodb::bson::doc;
use mongodb::{Database, IndexModel};

use crate::schemas::validators::validators::*;
use super::common::{create_indexes, ensure_collection};

pub(super) async fn create_lessons(db: &Database) -> Result<()> {
    let coll = ensure_collection(db, "lessons", Some(lessons_validator())).await?;
    create_indexes(
        &coll,
        vec![
            IndexModel::builder().keys(doc! {"moduleId":1}).build(),
            IndexModel::builder().keys(doc! {"order":1}).build(),
            IndexModel::builder().keys(doc! {"published":1}).build(),
        ],
    )
    .await
}


