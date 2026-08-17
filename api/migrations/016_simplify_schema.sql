-- 016: Simplify database schema — 22 tables → 12 tables + 2 views
--
-- Drops:
--   branches (merged into regions.branch_name)
--   org_units (flattened — only lab_assignments.unit_id_snapshot referenced it)
--   employee_org_assignments (no PHP code reads it)
--   employees (merged into users)
--   data_batches + data_batch_rows (audit-only, no PHP reads)
--   lab_attempt_events (audit-only, no PHP reads)
--   v_employee_current_org, v_kpi_training_monthly, v_kpi_region_lab (unused views)
--
-- Adds:
--   users.region_id FK (denormalized for fast dashboard queries)
--   regions.branch_name (replaces branches table)
--
-- Cleans up:
--   All data_batch_id columns and FK constraints
--   lab_assignments.unit_id_snapshot column
--   class_enrollments.employee_id column
--   training_classes.instructor_employee_id column

-- ================================================================
-- Phase 1: Drop ALL views (we recreate the needed ones at the end)
-- ================================================================
DROP VIEW IF EXISTS v_employee_current_org;
DROP VIEW IF EXISTS v_kpi_training_monthly;
DROP VIEW IF EXISTS v_kpi_region_lab;
DROP VIEW IF EXISTS v_lab_assignment_progress;
DROP VIEW IF EXISTS v_current_training_class;

-- ================================================================
-- Phase 2: Merge branches into regions
-- ================================================================
ALTER TABLE regions ADD COLUMN IF NOT EXISTS branch_name TEXT;
UPDATE regions r
   SET branch_name = b.branch_name
  FROM branches b
 WHERE r.branch_id = b.branch_id
   AND r.branch_name IS NULL;

-- ================================================================
-- Phase 3: Drop data_batch_id FK constraints from every table
-- ================================================================
ALTER TABLE curricula
    DROP CONSTRAINT IF EXISTS curricula_data_batch_id_fkey,
    DROP COLUMN IF EXISTS data_batch_id;

ALTER TABLE employee_org_assignments
    DROP CONSTRAINT IF EXISTS employee_org_assignments_data_batch_id_fkey,
    DROP COLUMN IF EXISTS data_batch_id;

ALTER TABLE class_enrollments
    DROP CONSTRAINT IF EXISTS class_enrollments_data_batch_id_fkey,
    DROP COLUMN IF EXISTS data_batch_id;

ALTER TABLE training_classes
    DROP CONSTRAINT IF EXISTS training_classes_data_batch_id_fkey,
    DROP COLUMN IF EXISTS data_batch_id;

ALTER TABLE class_lab_assignments
    DROP CONSTRAINT IF EXISTS class_lab_assignments_data_batch_id_fkey,
    DROP COLUMN IF EXISTS data_batch_id;

ALTER TABLE lab_assignments
    DROP CONSTRAINT IF EXISTS lab_assignments_data_batch_id_fkey,
    DROP COLUMN IF EXISTS data_batch_id;

ALTER TABLE lab_attempts
    DROP CONSTRAINT IF EXISTS lab_attempts_data_batch_id_fkey,
    DROP COLUMN IF EXISTS data_batch_id;

ALTER TABLE employees
    DROP CONSTRAINT IF EXISTS employees_source_data_batch_id_fkey,
    DROP COLUMN IF EXISTS source_data_batch_id;

-- ================================================================
-- Phase 4: Drop FK constraints that reference tables being dropped
-- ================================================================

-- regions.branch_id -> branches
ALTER TABLE regions DROP CONSTRAINT IF EXISTS regions_branch_id_fkey;
ALTER TABLE regions DROP COLUMN IF EXISTS branch_id;

-- org_units.self-ref
ALTER TABLE org_units DROP CONSTRAINT IF EXISTS org_units_parent_unit_id_fkey;
ALTER TABLE org_units DROP CONSTRAINT IF EXISTS org_units_region_id_fkey;

-- lab_assignments.unit_id_snapshot -> org_units
ALTER TABLE lab_assignments DROP CONSTRAINT IF EXISTS lab_assignments_unit_id_snapshot_fkey;
ALTER TABLE lab_assignments DROP COLUMN IF EXISTS unit_id_snapshot;

-- class_enrollments.employee_id -> employees
ALTER TABLE class_enrollments DROP CONSTRAINT IF EXISTS class_enrollments_employee_id_fkey;

-- training_classes.instructor_employee_id -> employees
ALTER TABLE training_classes DROP CONSTRAINT IF EXISTS training_classes_instructor_employee_id_fkey;

-- ================================================================
-- Phase 5: Drop redundant tables
-- ================================================================
DROP TABLE IF EXISTS lab_attempt_events;
DROP TABLE IF EXISTS data_batch_rows;
DROP TABLE IF EXISTS data_batches;
DROP TABLE IF EXISTS employee_org_assignments;
DROP TABLE IF EXISTS org_units;
DROP TABLE IF EXISTS branches;

-- ================================================================
-- Phase 6: Drop employees table (fields merged into users)
-- ================================================================
-- First remove the CHECK constraint that references employee_id
ALTER TABLE class_enrollments
    DROP CONSTRAINT IF EXISTS class_enrollments_employee_user_check;

-- Drop employee_id column from class_enrollments
ALTER TABLE class_enrollments DROP COLUMN IF EXISTS employee_id;

-- Make user_id NOT NULL now that employee_id is gone
-- (all existing rows have user_id set from seed/backfill)
UPDATE class_enrollments SET user_id = NULL WHERE user_id IS NULL;
ALTER TABLE class_enrollments
    ALTER COLUMN user_id SET NOT NULL,
    ADD CONSTRAINT class_enrollments_user_id_check CHECK (user_id IS NOT NULL);

-- Drop instructor_employee_id from training_classes
ALTER TABLE training_classes DROP COLUMN IF EXISTS instructor_employee_id;

-- Now safe to drop employees
DROP TABLE IF EXISTS employees;

-- ================================================================
-- Phase 7: Add region_id FK to users
-- ================================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS region_id UUID REFERENCES regions(region_id);
UPDATE users u
   SET region_id = r.region_id
  FROM regions r
 WHERE r.region_name = u.dashboard_region
   AND u.region_id IS NULL;

-- ================================================================
-- Phase 8: Recreate v_current_training_class (unchanged, just confirm)
-- ================================================================
CREATE OR REPLACE VIEW v_current_training_class AS
SELECT e.user_id,
       t.class_code,
       t.class_name,
       t.region_name
  FROM class_enrollments e
  JOIN training_classes t ON t.class_id = e.class_id
 WHERE e.status = 'active'
   AND e.valid_from <= CURRENT_DATE
   AND (e.valid_to IS NULL OR e.valid_to >= CURRENT_DATE)
   AND t.status = 'active';

-- ================================================================
-- Phase 9: Recreate v_lab_assignment_progress (simplified)
-- ================================================================
CREATE OR REPLACE VIEW v_lab_assignment_progress AS
WITH practice_attempts AS (
    SELECT attempt.assignment_id,
           COUNT(*) AS practice_attempt_count,
           MIN(attempt.attempt_no) FILTER (WHERE attempt.outcome = 'passed') AS derived_first_pass_attempt_no,
           BOOL_AND(attempt.sequence_complete) AS sequence_complete,
           COUNT(*) FILTER (WHERE attempt.status = 'failed') AS failed_attempt_count,
           COUNT(*) FILTER (WHERE attempt.status = 'abandoned') AS abandoned_attempt_count,
           COUNT(*) FILTER (WHERE attempt.status = 'in_progress') AS in_progress_attempt_count,
           MIN(attempt.finished_at) FILTER (WHERE attempt.outcome = 'passed') AS derived_completed_at
      FROM lab_attempts attempt
     WHERE attempt.mode = 'practice'
     GROUP BY attempt.assignment_id
)
SELECT assignment.assignment_id,
       enrollment.enrollment_id,
       u.user_id,
       u.employee_id AS employee_code,
       COALESCE(u.display_name, '') AS full_name,
       COALESCE(u.email, '') AS email,
       assignment.class_id_snapshot AS class_id,
       training.class_code,
       training.class_name,
       curriculum.curriculum_id,
       curriculum.curriculum_code,
       curriculum.version AS curriculum_version,
       curriculum_lab.curriculum_lab_id,
       lab.lab_id,
       lab.lab_name,
       device.device_id,
       device.device_name,
       assignment.region_id_snapshot AS region_id,
       region.region_code,
       region.region_name,
       region.dashboard_group,
       assignment.assigned_at,
       assignment.due_at,
       assignment.status AS assignment_status,
       assignment.completed_at,
       assignment.first_pass_attempt_no,
       assignment.first_try_evidence,
       CASE
           WHEN assignment.status <> 'passed' THEN NULL
           WHEN attempt.sequence_complete IS TRUE
            AND attempt.derived_first_pass_attempt_no IS NOT NULL
            THEN attempt.derived_first_pass_attempt_no = 1
           WHEN assignment.first_try_evidence = 'legacy_reported'
            AND assignment.first_pass_attempt_no IS NOT NULL
            THEN assignment.first_pass_attempt_no = 1
           ELSE NULL
       END AS first_try_success,
       CASE
           WHEN assignment.status = 'passed'
            AND assignment.first_try_evidence = 'legacy_reported'
            AND assignment.first_pass_attempt_no IS NOT NULL
           THEN assignment.first_pass_attempt_no = 1
           ELSE NULL
       END AS legacy_reported_first_try_success,
       COALESCE(attempt.practice_attempt_count, 0) AS practice_attempt_count,
       COALESCE(attempt.failed_attempt_count, 0) AS failed_attempt_count,
       COALESCE(attempt.abandoned_attempt_count, 0) AS abandoned_attempt_count,
       COALESCE(attempt.in_progress_attempt_count, 0) AS in_progress_attempt_count,
       attempt.sequence_complete AS attempt_sequence_complete,
       assignment.assignment_source,
       assignment.is_inferred
  FROM lab_assignments assignment
  JOIN class_enrollments enrollment ON enrollment.enrollment_id = assignment.enrollment_id
  LEFT JOIN users u ON u.user_id = enrollment.user_id
  JOIN training_classes training ON training.class_id = assignment.class_id_snapshot
  JOIN curriculum_labs curriculum_lab ON curriculum_lab.curriculum_lab_id = assignment.curriculum_lab_id
  JOIN curricula curriculum ON curriculum.curriculum_id = curriculum_lab.curriculum_id
  JOIN lab_catalog lab ON lab.lab_id = curriculum_lab.lab_id
  JOIN device_catalog device ON device.device_id = lab.device_id
  LEFT JOIN regions region ON region.region_id = assignment.region_id_snapshot
  LEFT JOIN practice_attempts attempt ON attempt.assignment_id = assignment.assignment_id;
