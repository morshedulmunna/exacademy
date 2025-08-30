-- Course Modules table: one Course -> many Modules
CREATE TABLE IF NOT EXISTS course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    position INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Keep course_modules.updated_at fresh on any row update
CREATE OR REPLACE FUNCTION set_course_modules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS course_modules_set_updated_at ON course_modules;
CREATE TRIGGER course_modules_set_updated_at
BEFORE UPDATE ON course_modules
FOR EACH ROW
EXECUTE FUNCTION set_course_modules_updated_at();

-- Helpful indexes and uniqueness inside a course
CREATE INDEX IF NOT EXISTS idx_course_modules_course ON course_modules (course_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_course_modules_course_position ON course_modules (course_id, position);

-- Lessons table: one Module -> many Lessons
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    video_url TEXT,
    duration TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
    is_free BOOLEAN NOT NULL DEFAULT FALSE,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Keep lessons.updated_at fresh on any row update
CREATE OR REPLACE FUNCTION set_lessons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS lessons_set_updated_at ON lessons;
CREATE TRIGGER lessons_set_updated_at
BEFORE UPDATE ON lessons
FOR EACH ROW
EXECUTE FUNCTION set_lessons_updated_at();

-- Indexes for lessons
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons (module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON lessons (published);
CREATE UNIQUE INDEX IF NOT EXISTS uq_lessons_module_position ON lessons (module_id, position);

