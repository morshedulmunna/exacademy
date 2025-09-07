use sqlx::{Pool, Postgres};
use std::sync::Arc;
pub mod categories;
pub mod course_categories;
pub mod courses;
pub mod lesson_assignments;
pub mod lesson_contents;
pub mod lesson_questions;
pub mod lessons;
pub mod modules;
pub mod postgresql;
pub mod users;
pub mod blog_posts;
pub mod blog_tags;
pub mod blog_likes;
pub mod blog_comments;

use categories::CategoriesRepository;
use course_categories::CourseCategoriesRepository;
use courses::CoursesRepository;
use lesson_assignments::LessonAssignmentsRepository;
use lesson_contents::LessonContentsRepository;
use lesson_questions::LessonQuestionsRepository;
use lessons::LessonsRepository;
use modules::ModulesRepository;
use users::UsersRepository;
use blog_posts::BlogPostsRepository;
use blog_tags::BlogTagsRepository;
use blog_likes::BlogLikesRepository;
use blog_comments::BlogCommentsRepository;

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
    pub lesson_contents: Arc<dyn LessonContentsRepository>,
    pub lesson_questions: Arc<dyn LessonQuestionsRepository>,
    pub lesson_assignments: Arc<dyn LessonAssignmentsRepository>,
    pub categories: Arc<dyn CategoriesRepository>,
    pub course_categories: Arc<dyn CourseCategoriesRepository>,
    pub blog_posts: Arc<dyn BlogPostsRepository>,
    pub blog_tags: Arc<dyn BlogTagsRepository>,
    pub blog_likes: Arc<dyn BlogLikesRepository>,
    pub blog_comments: Arc<dyn BlogCommentsRepository>,
}

impl Repositories {
    /// Build repository implementations backed by Postgres using the shared pool.
    pub fn new(pool: Pool<Postgres>) -> Self {
        let users: Arc<dyn UsersRepository> = Arc::new(
            crate::repositories::postgresql::users::PostgresUsersRepository { pool: pool.clone() },
        );
        let courses: Arc<dyn CoursesRepository> = Arc::new(
            crate::repositories::postgresql::courses::PostgresCoursesRepository {
                pool: pool.clone(),
            },
        );
        let modules: Arc<dyn ModulesRepository> = Arc::new(
            crate::repositories::postgresql::modules::PostgresModulesRepository {
                pool: pool.clone(),
            },
        );
        let lessons: Arc<dyn LessonsRepository> = Arc::new(
            crate::repositories::postgresql::lessons::PostgresLessonsRepository {
                pool: pool.clone(),
            },
        );
        let lesson_contents: Arc<dyn LessonContentsRepository> = Arc::new(
            crate::repositories::postgresql::lesson_contents::PostgresLessonContentsRepository {
                pool: pool.clone(),
            },
        );
        let lesson_questions: Arc<dyn LessonQuestionsRepository> = Arc::new(
            crate::repositories::postgresql::lesson_questions::PostgresLessonQuestionsRepository {
                pool: pool.clone(),
            },
        );
        let lesson_assignments: Arc<dyn LessonAssignmentsRepository> = Arc::new(
            crate::repositories::postgresql::lesson_assignments::PostgresLessonAssignmentsRepository {
                pool: pool.clone(),
            },
        );
        let categories: Arc<dyn CategoriesRepository> = Arc::new(
            crate::repositories::postgresql::categories::PostgresCategoriesRepository {
                pool: pool.clone(),
            },
        );
        let course_categories: Arc<dyn CourseCategoriesRepository> = Arc::new(
            crate::repositories::postgresql::course_categories::PostgresCourseCategoriesRepository {
                pool: pool.clone(),
            },
        );
        let blog_posts: Arc<dyn BlogPostsRepository> = Arc::new(
            crate::repositories::postgresql::blog_posts::PostgresBlogPostsRepository {
                pool: pool.clone(),
            },
        );
        let blog_tags: Arc<dyn BlogTagsRepository> = Arc::new(
            crate::repositories::postgresql::blog_tags::PostgresBlogTagsRepository {
                pool: pool.clone(),
            },
        );
        let blog_likes: Arc<dyn BlogLikesRepository> = Arc::new(
            crate::repositories::postgresql::blog_likes::PostgresBlogLikesRepository {
                pool: pool.clone(),
            },
        );
        let blog_comments: Arc<dyn BlogCommentsRepository> = Arc::new(
            crate::repositories::postgresql::blog_comments::PostgresBlogCommentsRepository {
                pool,
            },
        );

        Self {
            users,
            courses,
            modules,
            lessons,
            lesson_contents,
            lesson_questions,
            lesson_assignments,
            categories,
            course_categories,
            blog_posts,
            blog_tags,
            blog_likes,
            blog_comments,
        }
    }
}
