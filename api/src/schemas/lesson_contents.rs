use anyhow::Result;
use mongodb::bson::doc;
use mongodb::{Database, IndexModel};

use crate::schemas::validators::validators::*;
use super::common::{create_indexes, ensure_collection};

pub(super) async fn create_lesson_contents(db: &Database) -> Result<()> {
    let coll = ensure_collection(db, "lesson_contents", Some(lesson_contents_validator())).await?;
    create_indexes(
        &coll,
        vec![
            IndexModel::builder().keys(doc! {"lessonId":1}).build(),
            IndexModel::builder().keys(doc! {"type":1}).build(),
        ],
    )
    .await
}


