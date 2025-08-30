-- Courses table aligned with frontend Course type
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    excerpt TEXT,
    thumbnail TEXT,
    price DOUBLE PRECISION NOT NULL CHECK (price >= 0),
    original_price DOUBLE PRECISION CHECK (original_price >= 0),
    duration TEXT NOT NULL,
    lessons INTEGER NOT NULL DEFAULT 0 CHECK (lessons >= 0),
    students INTEGER NOT NULL DEFAULT 0 CHECK (students >= 0),
    published BOOLEAN NOT NULL DEFAULT FALSE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    view_count INTEGER NOT NULL DEFAULT 0 CHECK (view_count >= 0),
    instructor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Keep courses.updated_at fresh on any row update
CREATE OR REPLACE FUNCTION set_courses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS courses_set_updated_at ON courses;
CREATE TRIGGER courses_set_updated_at
BEFORE UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION set_courses_updated_at();

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses (slug);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses (instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_published_featured ON courses (published, featured);
CREATE INDEX IF NOT EXISTS idx_courses_view_count ON courses (view_count DESC);

