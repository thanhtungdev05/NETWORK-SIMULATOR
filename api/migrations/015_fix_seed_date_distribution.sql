-- 015: Fix seed data issues found during verification.
--
-- Problem 1: All lab_assignments.due_at point to the class end_date (2026-09-30),
-- causing due_in_period cohort to report zero assignments for months 06-08.
-- Fix: Spread due_at proportionally across the training period by curriculum lab
-- sort order, so monthly KPI trends reflect when labs are actually expected.
-- Constraint: due_at >= assigned_at OR due_at IS NULL.
--
-- Problem 2: v_lab_assignment_progress.first_try_success is always NULL for
-- legacy_reported assignments because the derived sequence_complete flag is FALSE
-- when the first observed session is already completed. The view should fall back
-- to the legacy_reported_first_try_success column for these assignments.

-- ---------------------------------------------------------------------------
-- 1. Spread class_lab_assignments.due_at across the training period
-- ---------------------------------------------------------------------------

WITH class_dates AS (
    SELECT tc.class_id,
           tc.start_date,
           COALESCE(tc.end_date, tc.start_date + INTERVAL '90 days') AS end_date
      FROM training_classes tc
), labs_with_order AS (
    SELECT cla.class_lab_assignment_id,
           cla.class_id,
           cla.assigned_at,
           COALESCE(cl.sort_order, 1) AS sort_order,
           COUNT(*) OVER (PARTITION BY cla.class_id) AS total_labs
      FROM class_lab_assignments cla
      JOIN curriculum_labs cl ON cl.curriculum_lab_id = cla.curriculum_lab_id
), computed AS (
    SELECT lw.class_lab_assignment_id,
           lw.class_id,
           lw.assigned_at,
           GREATEST(
               (cd.start_date
                + ((cd.end_date - cd.start_date) * lw.sort_order / GREATEST(lw.total_labs, 1))
                + INTERVAL '1 day' - INTERVAL '1 second')
                   AT TIME ZONE 'Asia/Ho_Chi_Minh',
               lw.assigned_at
           ) AS new_due_at
      FROM labs_with_order lw
      JOIN class_dates cd ON cd.class_id = lw.class_id
)
UPDATE class_lab_assignments cla
   SET due_at = c.new_due_at,
       updated_at = NOW()
  FROM computed c
 WHERE cla.class_lab_assignment_id = c.class_lab_assignment_id;

-- ---------------------------------------------------------------------------
-- 2. Spread lab_assignments.due_at from the updated class_lab_assignments
-- ---------------------------------------------------------------------------

UPDATE lab_assignments la
   SET due_at = GREATEST(cla.due_at, la.assigned_at),
       updated_at = NOW()
  FROM class_lab_assignments cla
 WHERE la.class_lab_assignment_id = cla.class_lab_assignment_id
   AND cla.due_at IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 3. Fix v_lab_assignment_progress: first_try_success should fall back to
--    legacy_reported_first_try_success for inferred legacy assignments.
-- ---------------------------------------------------------------------------

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
       employee.employee_id,
       employee.employee_code,
       employee.full_name,
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
       assignment.unit_id_snapshot AS unit_id,
       unit.unit_code,
       unit.unit_name,
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
       assignment.is_inferred,
       assignment.data_batch_id
  FROM lab_assignments assignment
  JOIN class_enrollments enrollment ON enrollment.enrollment_id = assignment.enrollment_id
  LEFT JOIN employees employee ON employee.employee_id = enrollment.employee_id
  JOIN training_classes training ON training.class_id = assignment.class_id_snapshot
  JOIN curriculum_labs curriculum_lab ON curriculum_lab.curriculum_lab_id = assignment.curriculum_lab_id
  JOIN curricula curriculum ON curriculum.curriculum_id = curriculum_lab.curriculum_id
  JOIN lab_catalog lab ON lab.lab_id = curriculum_lab.lab_id
  JOIN device_catalog device ON device.device_id = lab.device_id
  LEFT JOIN regions region ON region.region_id = assignment.region_id_snapshot
  LEFT JOIN org_units unit ON unit.unit_id = assignment.unit_id_snapshot
  LEFT JOIN practice_attempts attempt ON attempt.assignment_id = assignment.assignment_id;
