-- Lesson Contents: supports uploaded files or external media linked to a lesson
CREATE TABLE IF NOT EXISTS lesson_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL,
    url TEXT NOT NULL,
    file_size BIGINT,
    filename TEXT,
    position INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE OR REPLACE FUNCTION set_lesson_contents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS lesson_contents_set_updated_at ON lesson_contents;
CREATE TRIGGER lesson_contents_set_updated_at
BEFORE UPDATE ON lesson_contents
FOR EACH ROW
EXECUTE FUNCTION set_lesson_contents_updated_at();

CREATE INDEX IF NOT EXISTS idx_lesson_contents_lesson ON lesson_contents (lesson_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_lesson_contents_lesson_position ON lesson_contents (lesson_id, position);

-- Lesson Questions: quiz questions associated with a lesson
CREATE TABLE IF NOT EXISTS lesson_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE OR REPLACE FUNCTION set_lesson_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS lesson_questions_set_updated_at ON lesson_questions;
CREATE TRIGGER lesson_questions_set_updated_at
BEFORE UPDATE ON lesson_questions
FOR EACH ROW
EXECUTE FUNCTION set_lesson_questions_updated_at();

CREATE INDEX IF NOT EXISTS idx_lesson_questions_lesson ON lesson_questions (lesson_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_lesson_questions_lesson_position ON lesson_questions (lesson_id, position);

-- Question Options: options for each question, one or more can be correct
CREATE TABLE IF NOT EXISTS question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES lesson_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    position INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE OR REPLACE FUNCTION set_question_options_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS question_options_set_updated_at ON question_options;
CREATE TRIGGER question_options_set_updated_at
BEFORE UPDATE ON question_options
FOR EACH ROW
EXECUTE FUNCTION set_question_options_updated_at();

CREATE INDEX IF NOT EXISTS idx_question_options_question ON question_options (question_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_question_options_question_position ON question_options (question_id, position);

-- Lesson Assignments: single assignment per lesson
CREATE TABLE IF NOT EXISTS lesson_assignments (
    lesson_id UUID PRIMARY KEY REFERENCES lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE OR REPLACE FUNCTION set_lesson_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS lesson_assignments_set_updated_at ON lesson_assignments;
CREATE TRIGGER lesson_assignments_set_updated_at
BEFORE UPDATE ON lesson_assignments
FOR EACH ROW
EXECUTE FUNCTION set_lesson_assignments_updated_at();


