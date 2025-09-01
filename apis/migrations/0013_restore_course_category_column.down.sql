-- Remove restored category column if present
ALTER TABLE courses
    DROP COLUMN IF EXISTS category;


