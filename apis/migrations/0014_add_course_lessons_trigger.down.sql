-- Migration: Remove trigger function for auto-updating course lessons count

-- Drop the trigger
DROP TRIGGER IF EXISTS lessons_update_course_count ON lessons;

-- Drop the function
DROP FUNCTION IF EXISTS update_course_lessons_count();

-- Reset all course lesson counts to 0 (since we can't easily restore previous values)
UPDATE courses SET lessons = 0;
