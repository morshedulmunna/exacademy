-- Drop full_name first (it depends on first_name/last_name), then drop the others
-- Drop trigger and function for updated_at
DROP TRIGGER IF EXISTS users_set_updated_at ON users;
DROP FUNCTION IF EXISTS set_users_updated_at();

ALTER TABLE users
    -- Reverse order: drop dependents first
    DROP COLUMN IF EXISTS full_name,

    -- Audit
    DROP COLUMN IF EXISTS updated_at,

    -- Status and security
    DROP COLUMN IF EXISTS mfa_method,
    DROP COLUMN IF EXISTS mfa_enabled,
    DROP COLUMN IF EXISTS password_updated_at,
    DROP COLUMN IF EXISTS last_failed_login_at,
    DROP COLUMN IF EXISTS failed_login_attempts,
    DROP COLUMN IF EXISTS last_login_ip,
    DROP COLUMN IF EXISTS last_login_at,
    DROP COLUMN IF EXISTS blocked_reason,
    DROP COLUMN IF EXISTS is_blocked,
    DROP COLUMN IF EXISTS is_active,

    -- Preferences
    DROP COLUMN IF EXISTS marketing_opt_in,
    DROP COLUMN IF EXISTS timezone,
    DROP COLUMN IF EXISTS locale,

    -- Address
    DROP COLUMN IF EXISTS country,
    DROP COLUMN IF EXISTS postal_code,
    DROP COLUMN IF EXISTS state,
    DROP COLUMN IF EXISTS city,
    DROP COLUMN IF EXISTS address_line2,
    DROP COLUMN IF EXISTS address_line1,

    -- Social / external links
    DROP COLUMN IF EXISTS youtube_url,
    DROP COLUMN IF EXISTS instagram_url,
    DROP COLUMN IF EXISTS facebook_url,
    DROP COLUMN IF EXISTS linkedin_url,
    DROP COLUMN IF EXISTS twitter_url,
    DROP COLUMN IF EXISTS github_url,
    DROP COLUMN IF EXISTS website_url,

    -- Contact and verification
    DROP COLUMN IF EXISTS phone_verified_at,
    DROP COLUMN IF EXISTS email_verified_at,
    DROP COLUMN IF EXISTS secondary_email,
    DROP COLUMN IF EXISTS phone,

    -- Profile
    DROP COLUMN IF EXISTS gender,
    DROP COLUMN IF EXISTS date_of_birth,
    DROP COLUMN IF EXISTS bio,
    DROP COLUMN IF EXISTS cover_image_url,
    DROP COLUMN IF EXISTS avatar_url,

    -- Name parts
    DROP COLUMN IF EXISTS last_name,
    DROP COLUMN IF EXISTS first_name;
