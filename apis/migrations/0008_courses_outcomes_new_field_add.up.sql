-- Add outcomes array of TEXT to courses with default empty array
ALTER TABLE courses
    ADD COLUMN IF NOT EXISTS outcomes TEXT[] NOT NULL DEFAULT '{}'::TEXT[];
