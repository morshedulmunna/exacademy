use anyhow::Result;
use mongodb::bson::doc;
use mongodb::{Database, IndexModel};

use super::common::{create_indexes, ensure_collection};
use crate::schemas::validators::validators::*;

pub(super) async fn create_course_reviews(db: &Database) -> Result<()> {
    let coll = ensure_collection(db, "course_reviews", Some(course_reviews_validator())).await?;
    create_indexes(
        &coll,
        vec![
            IndexModel::builder().keys(doc! {"courseId":1}).build(),
            IndexModel::builder().keys(doc! {"userId":1}).build(),
            IndexModel::builder().keys(doc! {"createdAt":-1}).build(),
        ],
    )
    .await
}
