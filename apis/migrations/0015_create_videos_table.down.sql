-- Drop videos table and related objects
DROP TRIGGER IF EXISTS videos_set_updated_at ON videos;
DROP FUNCTION IF EXISTS set_videos_updated_at();

-- Remove video_url column from lessons table if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lessons' AND column_name = 'video_url'
    ) THEN
        ALTER TABLE lessons DROP COLUMN video_url;
    END IF;
END $$;

DROP TABLE IF EXISTS videos;
