-- Remove outcomes column from courses
ALTER TABLE courses
    DROP COLUMN IF EXISTS outcomes;
