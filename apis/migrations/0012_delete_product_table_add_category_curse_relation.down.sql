-- Recreate legacy products table and revert many-to-many to single category on courses

-- 1) Add back category column on courses
ALTER TABLE courses
    ADD COLUMN IF NOT EXISTS category TEXT;

-- 2) Drop join table indexes and table
DROP INDEX IF EXISTS idx_course_categories_course;
DROP INDEX IF EXISTS idx_course_categories_category;
DROP TABLE IF EXISTS course_categories;

-- 3) Recreate products table with original schema and indexes from 0001
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DOUBLE PRECISION NOT NULL CHECK (price >= 0),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    image_url TEXT,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_name ON products (name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id);
