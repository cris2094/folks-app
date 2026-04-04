-- Extend user_role enum with new roles for consejo and personal
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'consejo';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'personal';
