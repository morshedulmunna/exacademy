-- Add category (TEXT) and tags (TEXT[]) to courses
ALTER TABLE courses
    ADD COLUMN IF NOT EXISTS category TEXT,
    ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}'::TEXT[];


