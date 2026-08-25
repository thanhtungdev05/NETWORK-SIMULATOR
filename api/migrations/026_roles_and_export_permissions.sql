-- 026: Normalize application roles and make report-export permission explicit.

CREATE TABLE IF NOT EXISTS roles (
    role_code TEXT PRIMARY KEY,
    role_name TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    can_export_reports BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT roles_role_code_check CHECK (role_code IN ('KTV', 'ADMIN', 'DEV'))
);

INSERT INTO roles (role_code, role_name, is_admin, can_export_reports, sort_order)
VALUES
    ('KTV', 'Kỹ thuật viên', FALSE, FALSE, 10),
    ('ADMIN', 'Quản trị viên', TRUE, FALSE, 20),
    ('DEV', 'Nhà phát triển', TRUE, TRUE, 30)
ON CONFLICT (role_code) DO UPDATE
SET role_name = EXCLUDED.role_name,
    is_admin = EXCLUDED.is_admin,
    can_export_reports = EXCLUDED.can_export_reports,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_fkey;
ALTER TABLE users ALTER COLUMN role DROP DEFAULT;

UPDATE users
   SET role = CASE UPPER(BTRIM(COALESCE(role, '')))
       WHEN 'ADMIN' THEN 'ADMIN'
       WHEN 'DEV' THEN 'DEV'
       WHEN 'KTV' THEN 'KTV'
       WHEN 'USER' THEN 'KTV'
       ELSE 'KTV'
   END,
       updated_at = NOW()
 WHERE role IS DISTINCT FROM CASE UPPER(BTRIM(COALESCE(role, '')))
       WHEN 'ADMIN' THEN 'ADMIN'
       WHEN 'DEV' THEN 'DEV'
       WHEN 'KTV' THEN 'KTV'
       WHEN 'USER' THEN 'KTV'
       ELSE 'KTV'
   END;

ALTER TABLE users ALTER COLUMN role SET DEFAULT 'KTV';
ALTER TABLE users ALTER COLUMN role SET NOT NULL;
ALTER TABLE users
    ADD CONSTRAINT users_role_fkey
    FOREIGN KEY (role) REFERENCES roles(role_code)
    ON UPDATE CASCADE ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS idx_roles_admin_export
    ON roles (is_admin, can_export_reports, sort_order);

CREATE OR REPLACE VIEW v_ktv_directory AS
SELECT u.user_id,
       u.email,
       u.display_name,
       u.role,
       u.last_login_at,
       u.iam_profile,
       u.employee_id,
       u.job_title,
       u.training_start_date,
       u.training_end_date,
       u.class_code,
       u.is_terminated,
       u.termination_date,
       u.termination_reason,
       u.unit_code,
       u.unit_name,
       u.region_id,
       COALESCE(r.region_code, NULLIF(BTRIM(u.region_code), '')) AS region_code,
       COALESCE(
           r.region_name,
           NULLIF(BTRIM(u.dashboard_region), ''),
           NULLIF(BTRIM(u.region_code), '')
       ) AS region_name,
       COALESCE(
           r.dashboard_group,
           NULLIF(BTRIM(u.dashboard_region), ''),
           r.region_name,
           NULLIF(BTRIM(u.region_code), '')
       ) AS dashboard_region,
       r.dashboard_group,
       r.branch_name,
       u.region_code AS source_region_code,
       u.dashboard_region AS source_dashboard_region,
       u.employee_source,
       u.employee_seed_batch,
       u.employee_synced_at,
       u.created_at,
       u.updated_at,
       (u.region_id IS NOT NULL AND r.region_id IS NOT NULL) AS location_assigned
  FROM users u
  LEFT JOIN regions r ON r.region_id = u.region_id
 WHERE u.role = 'KTV';

COMMENT ON TABLE roles IS
    'Application roles and capabilities. DEV has admin access and report export; ADMIN has admin access without report export.';
COMMENT ON VIEW v_ktv_directory IS
    'Canonical KTV directory. Employee location is users.region_id -> regions; class region is not employee location.';
