use anyhow::Result;
use mongodb::bson::doc;
use mongodb::options::IndexOptions;
use mongodb::{Database, IndexModel};

use crate::schemas::validators::validators::*;
use super::common::{create_indexes, ensure_collection};

pub(super) async fn create_courses(db: &Database) -> Result<()> {
    let coll = ensure_collection(db, "courses", Some(courses_validator())).await?;
    let mut unique = IndexOptions::default();
    unique.unique = Some(true);
    create_indexes(
        &coll,
        vec![
            IndexModel::builder()
                .keys(doc! {"slug":1})
                .options(unique)
                .build(),
            IndexModel::builder().keys(doc! {"instructorId":1}).build(),
            IndexModel::builder()
                .keys(doc! {"published":1, "publishedAt":1})
                .build(),
        ],
    )
    .await
}


