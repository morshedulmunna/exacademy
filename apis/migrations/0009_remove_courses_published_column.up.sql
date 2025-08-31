-- Remove courses.published column and its index; add status-based index
DROP INDEX IF EXISTS idx_courses_published_featured;

ALTER TABLE courses
    DROP COLUMN IF EXISTS published;

CREATE INDEX IF NOT EXISTS idx_courses_status_featured ON courses (status, featured);


