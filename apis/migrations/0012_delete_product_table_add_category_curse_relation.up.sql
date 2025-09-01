-- Drop legacy products table and move courses to many-to-many categories via join table

-- 1) Drop products and its indexes if they exist
DROP INDEX IF EXISTS idx_products_name;
DROP INDEX IF EXISTS idx_products_category;
DROP TABLE IF EXISTS products;

-- 2) Ensure categories table exists (created in 0001); do not recreate here

-- 3) Create join table course_categories for many-to-many between courses and categories
--    We use ON DELETE CASCADE so removing a course or a category cleans up relations.
CREATE TABLE IF NOT EXISTS course_categories (
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (course_id, category_id)
);

-- Helpful indexes for lookups by either side
CREATE INDEX IF NOT EXISTS idx_course_categories_course ON course_categories (course_id);
CREATE INDEX IF NOT EXISTS idx_course_categories_category ON course_categories (category_id);

-- 4) Remove deprecated single-value category column on courses if still present
ALTER TABLE courses
    DROP COLUMN IF EXISTS category;
