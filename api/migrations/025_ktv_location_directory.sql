-- 025: Provide one canonical, flat read model for KTV location.
--
-- Current employee location belongs to users.region_id -> regions.region_id.
-- training_classes.region_id describes where a class is organized and must not
-- be used to infer the employee's current branch/region.

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
 WHERE u.role = 'user';

COMMENT ON VIEW v_ktv_directory IS
    'Canonical KTV directory. Employee location is users.region_id -> regions; class region is not employee location.';
