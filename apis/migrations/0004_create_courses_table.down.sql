-- Drop trigger and function, then table
DROP TRIGGER IF EXISTS courses_set_updated_at ON courses;
DROP FUNCTION IF EXISTS set_courses_updated_at();
DROP TABLE IF EXISTS courses;

