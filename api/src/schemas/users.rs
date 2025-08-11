use anyhow::Result;
use mongodb::bson::doc;
use mongodb::options::IndexOptions;
use mongodb::{Database, IndexModel};

use crate::schemas::validators::validators::*;

use super::common::{create_indexes, ensure_collection};

pub(super) async fn create_users(db: &Database) -> Result<()> {
    let coll = ensure_collection(db, "users", Some(users_validator())).await?;

    let mut email_unique = IndexOptions::default();
    email_unique.unique = Some(true);
    let mut username_unique = IndexOptions::default();
    username_unique.unique = Some(true);
    create_indexes(
        &coll,
        vec![
            IndexModel::builder()
                .keys(doc! {"email": 1})
                .options(email_unique)
                .build(),
            IndexModel::builder()
                .keys(doc! {"username": 1})
                .options(username_unique)
                .build(),
        ],
    )
    .await
}
