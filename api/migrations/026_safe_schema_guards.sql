-- 026: Re-apply constraints and indexes from 023/024 safely on databases
-- where LMS tables (lab_attempts, lab_assignments, class_enrollments,
-- training_classes, curriculum_labs, curricula) have already been dropped
-- by migration 025.
--
-- This migration is a no-op on databases that still have those tables
-- (they were already handled by 023/024), and a safe guard on databases
-- that started fresh after 025 was applied.

-- ----------------------------------------------------------------
-- users: case-insensitive unique email index (idempotent)
-- ----------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_lower_email_unique
    ON users (LOWER(email));

-- ----------------------------------------------------------------
-- users: flat denormalized columns (from 024_flat_user_regions_and_classes)
-- ----------------------------------------------------------------
ALTER TABLE users ADD COLUMN IF NOT EXISTS unit_code VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS unit_name VARCHAR(200);
ALTER TABLE users ADD COLUMN IF NOT EXISTS region_code VARCHAR(80);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dashboard_region VARCHAR(200);
ALTER TABLE users ADD COLUMN IF NOT EXISTS class_code VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS region_id UUID REFERENCES regions(region_id) ON DELETE SET NULL;

-- ----------------------------------------------------------------
-- Backfill users from class data (only if LMS tables still exist)
-- ----------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'class_enrollments')
    AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'training_classes') THEN

        UPDATE users u
           SET class_code = t.class_code
          FROM class_enrollments e
          JOIN training_classes t ON t.class_id = e.class_id
         WHERE e.user_id = u.user_id
           AND e.status = 'active'
           AND (u.class_code IS NULL OR TRIM(u.class_code) = '');

        UPDATE users u
           SET dashboard_region = t.region_name
          FROM class_enrollments e
          JOIN training_classes t ON t.class_id = e.class_id
         WHERE e.user_id = u.user_id
           AND e.status = 'active'
           AND (u.dashboard_region IS NULL OR TRIM(u.dashboard_region) = '')
           AND t.region_name IS NOT NULL AND TRIM(t.region_name) <> '';

    END IF;
END $$;

-- Backfill dashboard_region from class_code prefix patterns
UPDATE users
   SET dashboard_region = CASE
       WHEN class_code ILIKE 'SG%' OR class_code ILIKE 'HCM%' THEN 'HCM'
       WHEN class_code ILIKE 'HN%' OR class_code ILIKE 'HNI%' THEN 'HNI'
       WHEN class_code ILIKE 'DNB%' THEN 'DNB'
       WHEN class_code ILIKE 'TNB%' THEN 'TNB'
       WHEN class_code ILIKE 'TDDT%' THEN 'TDDT - PNC'
       WHEN class_code ILIKE 'TNMT%' THEN 'TNMT - PNC'
       WHEN class_code ILIKE 'DBB%' THEN 'DBB'
       WHEN class_code ILIKE 'TBB%' THEN 'TBB'
       ELSE dashboard_region
   END
 WHERE (dashboard_region IS NULL OR TRIM(dashboard_region) = '')
   AND class_code IS NOT NULL AND TRIM(class_code) <> '';

-- Backfill region_id, region_code, unit_name from regions catalog
UPDATE users u
   SET region_id    = r.region_id,
       region_code  = COALESCE(NULLIF(u.region_code, ''), r.region_code),
       unit_name    = COALESCE(NULLIF(u.unit_name, ''), r.branch_name, r.region_name)
  FROM regions r
 WHERE (
       r.region_name    = u.dashboard_region
    OR r.dashboard_group = u.dashboard_region
    OR r.region_code    = u.dashboard_region
    OR r.region_code    = u.region_code
 )
   AND (u.region_id IS NULL OR u.unit_name IS NULL OR TRIM(u.unit_name) = '');

UPDATE users
   SET unit_name = dashboard_region
 WHERE (unit_name IS NULL OR TRIM(unit_name) = '')
   AND dashboard_region IS NOT NULL AND TRIM(dashboard_region) <> '';

-- ----------------------------------------------------------------
-- Performance indexes (always safe with IF NOT EXISTS)
-- ----------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_dashboard_region   ON users(dashboard_region);
CREATE INDEX IF NOT EXISTS idx_users_class_code         ON users(class_code);
CREATE INDEX IF NOT EXISTS idx_users_unit_name          ON users(unit_name);
CREATE INDEX IF NOT EXISTS idx_users_role_terminated    ON users(role, is_terminated);

-- ----------------------------------------------------------------
-- Validate timer_sessions constraints (always present, guard each one)
-- ----------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
         WHERE table_name = 'device_catalog' AND constraint_name = 'device_catalog_sort_order_check'
    ) THEN
        ALTER TABLE device_catalog VALIDATE CONSTRAINT device_catalog_sort_order_check;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
         WHERE table_name = 'lab_catalog' AND constraint_name = 'lab_catalog_sort_order_check'
    ) THEN
        ALTER TABLE lab_catalog VALIDATE CONSTRAINT lab_catalog_sort_order_check;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
         WHERE table_name = 'timer_sessions' AND constraint_name = 'timer_sessions_device_id_fkey'
    ) THEN
        ALTER TABLE timer_sessions VALIDATE CONSTRAINT timer_sessions_device_id_fkey;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
         WHERE table_name = 'timer_sessions' AND constraint_name = 'timer_sessions_duration_check'
    ) THEN
        ALTER TABLE timer_sessions VALIDATE CONSTRAINT timer_sessions_duration_check;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
         WHERE table_name = 'timer_sessions' AND constraint_name = 'timer_sessions_mode_check'
    ) THEN
        ALTER TABLE timer_sessions VALIDATE CONSTRAINT timer_sessions_mode_check;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
         WHERE table_name = 'timer_sessions' AND constraint_name = 'timer_sessions_status_check'
    ) THEN
        ALTER TABLE timer_sessions VALIDATE CONSTRAINT timer_sessions_status_check;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
         WHERE table_name = 'timer_sessions' AND constraint_name = 'timer_sessions_first_try_check'
    ) THEN
        ALTER TABLE timer_sessions VALIDATE CONSTRAINT timer_sessions_first_try_check;
    END IF;
END $$;
