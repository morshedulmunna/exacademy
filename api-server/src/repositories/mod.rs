use sqlx::{Pool, Postgres};
use std::sync::Arc;
pub mod postgresql;
pub mod users;
pub mod courses;
pub mod modules;
pub mod lessons;

use users::UsersRepository;
use courses::CoursesRepository;
use modules::ModulesRepository;
use lessons::LessonsRepository;

/// Central registry for all repositories.
///
/// This provides a single managed place to construct and access data repositories
/// throughout the application, avoiding per-route wiring.
#[derive(Clone)]
pub struct Repositories {
    pub users: Arc<dyn UsersRepository>,
    pub courses: Arc<dyn CoursesRepository>,
    pub modules: Arc<dyn ModulesRepository>,
    pub lessons: Arc<dyn LessonsRepository>,
}

impl Repositories {
    /// Build repository implementations backed by Postgres using the shared pool.
    pub fn new(pool: Pool<Postgres>) -> Self {
        let users: Arc<dyn UsersRepository> = Arc::new(
            crate::repositories::postgresql::users::PostgresUsersRepository { pool: pool.clone() },
        );
        let courses: Arc<dyn CoursesRepository> = Arc::new(
            crate::repositories::postgresql::courses::PostgresCoursesRepository { pool: pool.clone() },
        );
        let modules: Arc<dyn ModulesRepository> = Arc::new(
            crate::repositories::postgresql::modules::PostgresModulesRepository { pool: pool.clone() },
        );
        let lessons: Arc<dyn LessonsRepository> = Arc::new(
            crate::repositories::postgresql::lessons::PostgresLessonsRepository { pool },
        );

        Self { users, courses, modules, lessons }
    }
}
