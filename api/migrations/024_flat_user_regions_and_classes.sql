-- 024_flat_user_regions_and_classes.sql
-- Backfill and ensure direct denormalized storage of class, region, and branch on the users table.

-- 1. Ensure columns exist on users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS unit_code VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS unit_name VARCHAR(200);
ALTER TABLE users ADD COLUMN IF NOT EXISTS region_code VARCHAR(80);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dashboard_region VARCHAR(200);
ALTER TABLE users ADD COLUMN IF NOT EXISTS class_code VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS region_id UUID REFERENCES regions(region_id);

-- 2. Backfill class_code from class_enrollments & training_classes
UPDATE users u
   SET class_code = t.class_code
  FROM class_enrollments e
  JOIN training_classes t ON t.class_id = e.class_id
 WHERE e.user_id = u.user_id
   AND e.status = 'active'
   AND (u.class_code IS NULL OR TRIM(u.class_code) = '');

-- 3. Backfill dashboard_region from training_classes
UPDATE users u
   SET dashboard_region = t.region_name
  FROM class_enrollments e
  JOIN training_classes t ON t.class_id = e.class_id
 WHERE e.user_id = u.user_id
   AND e.status = 'active'
   AND (u.dashboard_region IS NULL OR TRIM(u.dashboard_region) = '')
   AND t.region_name IS NOT NULL AND TRIM(t.region_name) <> '';

-- 4. Backfill dashboard_region from class_code prefix patterns
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

-- 5. Backfill region_id, region_code, and unit_name from regions catalog
UPDATE users u
   SET region_id = r.region_id,
       region_code = COALESCE(NULLIF(u.region_code, ''), r.region_code),
       unit_name = COALESCE(NULLIF(u.unit_name, ''), r.branch_name, r.region_name)
  FROM regions r
 WHERE (
       r.region_name = u.dashboard_region
    OR r.dashboard_group = u.dashboard_region
    OR r.region_code = u.dashboard_region
    OR r.region_code = u.region_code
 )
   AND (u.region_id IS NULL OR u.unit_name IS NULL OR TRIM(u.unit_name) = '');

-- 6. Ensure fallback for unit_name if still NULL
UPDATE users
   SET unit_name = dashboard_region
 WHERE (unit_name IS NULL OR TRIM(unit_name) = '')
   AND dashboard_region IS NOT NULL AND TRIM(dashboard_region) <> '';

-- 7. Performance indexes for direct zero-join queries
CREATE INDEX IF NOT EXISTS idx_users_dashboard_region ON users(dashboard_region);
CREATE INDEX IF NOT EXISTS idx_users_class_code ON users(class_code);
CREATE INDEX IF NOT EXISTS idx_users_unit_name ON users(unit_name);
CREATE INDEX IF NOT EXISTS idx_users_role_terminated ON users(role, is_terminated);
