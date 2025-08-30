-- Change default of users.is_active to FALSE for future inserts
ALTER TABLE users
    ALTER COLUMN is_active SET DEFAULT FALSE;
