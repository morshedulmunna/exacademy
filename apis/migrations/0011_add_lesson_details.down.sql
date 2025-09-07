-- Down migration for lesson details

-- Drop triggers and functions first, then tables in reverse dependency order

-- lesson_assignments
DROP TRIGGER IF EXISTS lesson_assignments_set_updated_at ON lesson_assignments;
DROP FUNCTION IF EXISTS set_lesson_assignments_updated_at();
DROP TABLE IF EXISTS lesson_assignments;

-- question_options
DROP TRIGGER IF EXISTS question_options_set_updated_at ON question_options;
DROP FUNCTION IF EXISTS set_question_options_updated_at();
DROP TABLE IF EXISTS question_options;

-- lesson_questions
DROP TRIGGER IF EXISTS lesson_questions_set_updated_at ON lesson_questions;
DROP FUNCTION IF EXISTS set_lesson_questions_updated_at();
DROP TABLE IF EXISTS lesson_questions;

-- lesson_contents
DROP TRIGGER IF EXISTS lesson_contents_set_updated_at ON lesson_contents;
DROP FUNCTION IF EXISTS set_lesson_contents_updated_at();
DROP TABLE IF EXISTS lesson_contents;


