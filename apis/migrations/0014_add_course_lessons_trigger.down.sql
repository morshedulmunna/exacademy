-- Migration: Remove trigger function for auto-updating course lessons count

-- Drop the triggers
DROP TRIGGER IF EXISTS lessons_update_course_count ON lessons;
DROP TRIGGER IF EXISTS modules_update_course_count ON course_modules;

-- Drop the functions
DROP FUNCTION IF EXISTS update_course_lessons_count();
DROP FUNCTION IF EXISTS update_course_lessons_count_on_module_delete();

-- Reset all course lesson counts to 0 (since we can't easily restore previous values)
UPDATE courses SET lessons = 0;
