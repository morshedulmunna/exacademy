-- Migration: Add trigger function to auto-update course lessons count
-- This trigger automatically updates the courses.lessons field when lessons are modified
-- or when modules (and their lessons) are deleted

-- Function to update course lessons count
CREATE OR REPLACE FUNCTION update_course_lessons_count()
RETURNS TRIGGER AS $$
DECLARE
    target_course_id UUID;
BEGIN
    -- Get the course_id from the module_id
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        SELECT cm.course_id INTO target_course_id
        FROM course_modules cm
        WHERE cm.id = NEW.module_id;
    ELSIF TG_OP = 'DELETE' THEN
        SELECT cm.course_id INTO target_course_id
        FROM course_modules cm
        WHERE cm.id = OLD.module_id;
    END IF;

    -- Update the course lessons count
    IF target_course_id IS NOT NULL THEN
        UPDATE courses 
        SET lessons = (
            SELECT COUNT(l.id)
            FROM lessons l
            JOIN course_modules cm ON l.module_id = cm.id
            WHERE cm.course_id = target_course_id
        )
        WHERE id = target_course_id;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to handle module deletions and update course lessons count
CREATE OR REPLACE FUNCTION update_course_lessons_count_on_module_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- When a module is deleted, update the course lessons count
    IF TG_OP = 'DELETE' THEN
        UPDATE courses 
        SET lessons = (
            SELECT COUNT(l.id)
            FROM lessons l
            JOIN course_modules cm ON l.module_id = cm.id
            WHERE cm.course_id = OLD.course_id
        )
        WHERE id = OLD.course_id;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for lessons table
DROP TRIGGER IF EXISTS lessons_update_course_count ON lessons;
CREATE TRIGGER lessons_update_course_count
    AFTER INSERT OR UPDATE OR DELETE ON lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_course_lessons_count();

-- Create trigger for course_modules table to handle module deletions
DROP TRIGGER IF EXISTS modules_update_course_count ON course_modules;
CREATE TRIGGER modules_update_course_count
    AFTER DELETE ON course_modules
    FOR EACH ROW
    EXECUTE FUNCTION update_course_lessons_count_on_module_delete();

-- Update existing courses with current lesson counts
UPDATE courses c
SET lessons = (
    SELECT COUNT(l.id)
    FROM lessons l
    JOIN course_modules cm ON l.module_id = cm.id
    WHERE cm.course_id = c.id
);
