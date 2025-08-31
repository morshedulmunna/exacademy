-- Re-add courses.published column and index (best-effort rollback)
ALTER TABLE courses
    ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT FALSE;

DROP INDEX IF EXISTS idx_courses_status_featured;
CREATE INDEX IF NOT EXISTS idx_courses_published_featured ON courses (published, featured);


