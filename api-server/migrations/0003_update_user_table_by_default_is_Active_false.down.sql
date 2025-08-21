-- Revert default of users.is_active back to TRUE
ALTER TABLE users
    ALTER COLUMN is_active SET DEFAULT TRUE;
