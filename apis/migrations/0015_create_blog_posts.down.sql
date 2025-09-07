-- Drop functions first
DROP FUNCTION IF EXISTS get_blog_post_with_aggregates(TEXT);
DROP FUNCTION IF EXISTS set_blog_post_read_time();
DROP FUNCTION IF EXISTS calculate_read_time(TEXT);
DROP FUNCTION IF EXISTS set_blog_comments_updated_at();
DROP FUNCTION IF EXISTS set_blog_posts_updated_at();

-- Drop triggers
DROP TRIGGER IF EXISTS blog_posts_set_read_time ON blog_posts;
DROP TRIGGER IF EXISTS blog_posts_set_updated_at ON blog_posts;
DROP TRIGGER IF EXISTS blog_comments_set_updated_at ON blog_comments;

-- Drop indexes
DROP INDEX IF EXISTS idx_blog_comments_created_at;
DROP INDEX IF EXISTS idx_blog_comments_approved;
DROP INDEX IF EXISTS idx_blog_comments_parent_id;
DROP INDEX IF EXISTS idx_blog_comments_user_id;
DROP INDEX IF EXISTS idx_blog_comments_post_id;
DROP INDEX IF EXISTS idx_blog_likes_user_id;
DROP INDEX IF EXISTS idx_blog_likes_post_id;
DROP INDEX IF EXISTS idx_blog_post_tags_tag_id;
DROP INDEX IF EXISTS idx_blog_post_tags_post_id;
DROP INDEX IF EXISTS idx_blog_posts_created_at;
DROP INDEX IF EXISTS idx_blog_posts_view_count;
DROP INDEX IF EXISTS idx_blog_posts_published_at;
DROP INDEX IF EXISTS idx_blog_posts_published_featured;
DROP INDEX IF EXISTS idx_blog_posts_author;
DROP INDEX IF EXISTS idx_blog_posts_slug;

-- Drop tables in reverse order (due to foreign key constraints)
DROP TABLE IF EXISTS blog_comments;
DROP TABLE IF EXISTS blog_likes;
DROP TABLE IF EXISTS blog_post_tags;
DROP TABLE IF EXISTS blog_tags;
DROP TABLE IF EXISTS blog_posts;
