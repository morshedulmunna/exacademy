use sqlx::{Pool, Postgres};
use std::sync::Arc;
pub mod postgresql;
pub mod users;

use users::UsersRepository;

/// Central registry for all repositories.
///
/// This provides a single managed place to construct and access data repositories
/// throughout the application, avoiding per-route wiring.
#[derive(Clone)]
pub struct Repositories {
    pub users: Arc<dyn UsersRepository>,
}

impl Repositories {
    /// Build repository implementations backed by Postgres using the shared pool.
    pub fn new(pool: Pool<Postgres>) -> Self {
        let users: Arc<dyn UsersRepository> =
            Arc::new(crate::repositories::postgresql::users::PostgresUsersRepository { pool });

        Self { users }
    }
}
