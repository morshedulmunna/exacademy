-- Revert foreign key to allow NULL assignment on user deletion
ALTER TABLE courses
    DROP CONSTRAINT IF EXISTS courses_instructor_id_fkey;

-- Allow NULLs again on instructor_id
ALTER TABLE courses
    ALTER COLUMN instructor_id DROP NOT NULL;

-- Restore original foreign key behavior
ALTER TABLE courses
    ADD CONSTRAINT courses_instructor_id_fkey
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL;


