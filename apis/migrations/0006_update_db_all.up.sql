-- Add up migration script here

-- Change default of users.is_active to FALSE for future inserts
ALTER TABLE users
    ALTER COLUMN is_active SET DEFAULT FALSE;

-- Courses table adjustments: remove deprecated students column and add status
ALTER TABLE courses
    DROP COLUMN IF EXISTS students,
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived'));
