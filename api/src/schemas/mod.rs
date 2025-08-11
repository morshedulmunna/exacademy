pub mod validators;
use anyhow::Result;
use mongodb::Database;

mod accounts;
mod comments;
mod common;
mod course_enrollments;
mod course_modules;
mod course_reviews;
mod course_tags;
mod courses;
mod lesson_contents;
mod lessons;
mod likes;
mod post_tags;
mod posts;
mod sessions;
mod tags;
mod users;
mod verification_tokens;

/// Run all collection creations, validators and indexes.
/// This migration is idempotent: creating a collection that exists is ignored; creating existing indexes is a no-op.
pub async fn run_all_migrations(db: &Database) -> Result<()> {
    users::create_users(db).await?;
    accounts::create_accounts(db).await?;
    sessions::create_sessions(db).await?;
    verification_tokens::create_verification_tokens(db).await?;
    posts::create_posts(db).await?;
    tags::create_tags(db).await?;
    post_tags::create_post_tags(db).await?;
    comments::create_comments(db).await?;
    likes::create_likes(db).await?;
    courses::create_courses(db).await?;
    course_tags::create_course_tags(db).await?;
    course_enrollments::create_course_enrollments(db).await?;
    course_modules::create_course_modules(db).await?;
    lessons::create_lessons(db).await?;
    lesson_contents::create_lesson_contents(db).await?;
    course_reviews::create_course_reviews(db).await?;
    Ok(())
}
