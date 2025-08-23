-- Drop lesson and module triggers and tables in reverse dependency order
DROP TRIGGER IF EXISTS lessons_set_updated_at ON lessons;
DROP FUNCTION IF EXISTS set_lessons_updated_at();
DROP TABLE IF EXISTS lessons;

DROP TRIGGER IF EXISTS course_modules_set_updated_at ON course_modules;
DROP FUNCTION IF EXISTS set_course_modules_updated_at();
DROP TABLE IF EXISTS course_modules;

