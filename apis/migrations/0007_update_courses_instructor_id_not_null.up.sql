-- Ensure no rows violate the NOT NULL constraint before altering
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM courses WHERE instructor_id IS NULL) THEN
        RAISE EXCEPTION 'Cannot set courses.instructor_id to NOT NULL: found rows with NULL instructor_id';
    END IF;
END$$;

-- Drop existing foreign key (may be auto-named by Postgres)
ALTER TABLE courses
    DROP CONSTRAINT IF EXISTS courses_instructor_id_fkey;

-- Enforce NOT NULL on instructor_id
ALTER TABLE courses
    ALTER COLUMN instructor_id SET NOT NULL;

-- Recreate foreign key with restrictive delete to avoid NULL assignment
ALTER TABLE courses
    ADD CONSTRAINT courses_instructor_id_fkey
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE RESTRICT;


