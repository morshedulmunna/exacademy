use anyhow::Result;
use mongodb::bson::doc;
use mongodb::{Database, IndexModel};

use crate::schemas::validators::validators::*;
use super::common::{create_indexes, ensure_collection};

pub(super) async fn create_course_modules(db: &Database) -> Result<()> {
    let coll = ensure_collection(db, "course_modules", Some(course_modules_validator())).await?;
    create_indexes(
        &coll,
        vec![
            IndexModel::builder().keys(doc! {"courseId":1}).build(),
            IndexModel::builder().keys(doc! {"order":1}).build(),
        ],
    )
    .await
}


