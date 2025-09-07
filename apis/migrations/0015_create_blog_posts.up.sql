-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    view_count INTEGER NOT NULL DEFAULT 0 CHECK (view_count >= 0),
    read_time INTEGER NOT NULL DEFAULT 0 CHECK (read_time >= 0),
    published BOOLEAN NOT NULL DEFAULT FALSE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Blog tags table
CREATE TABLE IF NOT EXISTS blog_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL DEFAULT '#888888',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Blog post tags junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS blog_post_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(post_id, tag_id)
);

-- Blog likes table
CREATE TABLE IF NOT EXISTS blog_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Blog comments table
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Keep blog_posts.updated_at fresh on any row update
CREATE OR REPLACE FUNCTION set_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_set_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_set_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION set_blog_posts_updated_at();

-- Keep blog_comments.updated_at fresh on any row update
CREATE OR REPLACE FUNCTION set_blog_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_comments_set_updated_at ON blog_comments;
CREATE TRIGGER blog_comments_set_updated_at
BEFORE UPDATE ON blog_comments
FOR EACH ROW
EXECUTE FUNCTION set_blog_comments_updated_at();

-- Indexes for common lookups and performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts (author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_featured ON blog_posts (published, featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_view_count ON blog_posts (view_count DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post_id ON blog_post_tags (post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag_id ON blog_post_tags (tag_id);

CREATE INDEX IF NOT EXISTS idx_blog_likes_post_id ON blog_likes (post_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_user_id ON blog_likes (user_id);

CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments (post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON blog_comments (user_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments (parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_approved ON blog_comments (approved);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON blog_comments (created_at DESC);

-- Function to automatically calculate read time based on content
CREATE OR REPLACE FUNCTION calculate_read_time(content TEXT)
RETURNS INTEGER AS $$
BEGIN
    -- Average reading speed: 200 words per minute
    -- Count words by splitting on whitespace and filtering out empty strings
    RETURN GREATEST(1, CEIL(
        array_length(
            string_to_array(
                regexp_replace(content, '<[^>]*>', ' ', 'g'), 
                ' '
            ), 
            1
        ) / 200.0
    ));
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set read_time when content is updated
CREATE OR REPLACE FUNCTION set_blog_post_read_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.read_time := calculate_read_time(NEW.content);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_set_read_time ON blog_posts;
CREATE TRIGGER blog_posts_set_read_time
BEFORE INSERT OR UPDATE OF content ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION set_blog_post_read_time();

-- Function to get blog post with aggregated data (likes count, tags)
CREATE OR REPLACE FUNCTION get_blog_post_with_aggregates(post_slug TEXT)
RETURNS TABLE (
    id UUID,
    slug TEXT,
    title TEXT,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    view_count INTEGER,
    read_time INTEGER,
    published BOOLEAN,
    featured BOOLEAN,
    author_id UUID,
    author_name TEXT,
    author_avatar TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    likes_count BIGINT,
    tags JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bp.id,
        bp.slug,
        bp.title,
        bp.excerpt,
        bp.content,
        bp.cover_image,
        bp.view_count,
        bp.read_time,
        bp.published,
        bp.featured,
        bp.author_id,
        u.username as author_name,
        u.avatar as author_avatar,
        bp.published_at,
        bp.created_at,
        bp.updated_at,
        COALESCE(bl.likes_count, 0) as likes_count,
        COALESCE(bt.tags, '[]'::jsonb) as tags
    FROM blog_posts bp
    LEFT JOIN users u ON bp.author_id = u.id
    LEFT JOIN (
        SELECT post_id, COUNT(*) as likes_count
        FROM blog_likes
        GROUP BY post_id
    ) bl ON bp.id = bl.post_id
    LEFT JOIN (
        SELECT 
            bpt.post_id,
            jsonb_agg(
                jsonb_build_object(
                    'id', bt.id,
                    'name', bt.name,
                    'color', bt.color
                )
            ) as tags
        FROM blog_post_tags bpt
        JOIN blog_tags bt ON bpt.tag_id = bt.id
        GROUP BY bpt.post_id
    ) bt ON bp.id = bt.post_id
    WHERE bp.slug = post_slug AND bp.published = true;
END;
$$ LANGUAGE plpgsql;
