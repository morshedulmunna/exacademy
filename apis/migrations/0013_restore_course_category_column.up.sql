-- Restore single-value category column on courses to keep backward compatibility
ALTER TABLE courses
    ADD COLUMN IF NOT EXISTS category TEXT;


