-- 024: Use the current user region when a historical assignment has no region
-- snapshot. The fallback is intentionally dynamic so a roster import performed
-- after this migration immediately fixes dashboard grouping without rewriting
-- historical assignment facts.
--
-- NOTE: Guarded with IF EXISTS checks because migration 025 drops lab_attempts,
-- lab_assignments, class_enrollments, training_classes, curriculum_labs,
-- curricula, and lab_grading_criteria.

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lab_attempts')
    AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lab_assignments') THEN

        EXECUTE $view$
        CREATE OR REPLACE VIEW v_lab_assignment_progress AS
        WITH practice_attempts AS (
            SELECT attempt.assignment_id,
                   COUNT(*) FILTER (WHERE attempt.mode = 'practice') AS practice_attempt_count,
                   MIN(attempt.attempt_no) FILTER (
                       WHERE attempt.mode = 'practice' AND attempt.outcome = 'passed'
                   ) AS derived_first_pass_attempt_no,
                   BOOL_AND(attempt.sequence_complete) FILTER (
                       WHERE attempt.mode = 'practice'
                   ) AS sequence_complete,
                   COUNT(*) FILTER (
                       WHERE attempt.mode = 'practice' AND attempt.status = 'failed'
                   ) AS failed_attempt_count,
                   COUNT(*) FILTER (
                       WHERE attempt.mode = 'practice' AND attempt.status = 'abandoned'
                   ) AS abandoned_attempt_count,
                   COUNT(*) FILTER (
                       WHERE attempt.mode = 'practice' AND attempt.status = 'in_progress'
                   ) AS in_progress_attempt_count,
                   MIN(attempt.finished_at) FILTER (
                       WHERE attempt.mode = 'practice' AND attempt.outcome = 'passed'
                   ) AS derived_completed_at,
                   COUNT(*) FILTER (
                       WHERE attempt.mode = 'practice' AND attempt.status = 'completed'
                   ) AS practice_completion_count,
                   COUNT(*) FILTER (
                       WHERE attempt.mode = 'practice' AND attempt.outcome IS NOT NULL
                   ) AS practice_graded_attempt_count,
                   COUNT(*) FILTER (WHERE attempt.mode = 'guide') AS guide_attempt_count,
                   COUNT(*) FILTER (
                       WHERE attempt.mode = 'guide' AND attempt.status = 'completed'
                   ) AS guide_completion_count
              FROM lab_attempts attempt
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
               COALESCE(assignment.region_id_snapshot, u.region_id) AS region_id,
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
               assignment.is_inferred,
               assignment.passed_at,
               COALESCE(attempt.practice_completion_count, 0) AS practice_completion_count,
               COALESCE(attempt.practice_graded_attempt_count, 0) AS practice_graded_attempt_count,
               COALESCE(attempt.guide_attempt_count, 0) AS guide_attempt_count,
               COALESCE(attempt.guide_completion_count, 0) AS guide_completion_count
          FROM lab_assignments assignment
          JOIN class_enrollments enrollment ON enrollment.enrollment_id = assignment.enrollment_id
          LEFT JOIN users u ON u.user_id = enrollment.user_id
          JOIN training_classes training ON training.class_id = assignment.class_id_snapshot
          JOIN curriculum_labs curriculum_lab ON curriculum_lab.curriculum_lab_id = assignment.curriculum_lab_id
          JOIN curricula curriculum ON curriculum.curriculum_id = curriculum_lab.curriculum_id
          JOIN lab_catalog lab ON lab.lab_id = curriculum_lab.lab_id
          JOIN device_catalog device ON device.device_id = lab.device_id
          LEFT JOIN regions region ON region.region_id = COALESCE(assignment.region_id_snapshot, u.region_id)
          LEFT JOIN practice_attempts attempt ON attempt.assignment_id = assignment.assignment_id;
        $view$;

    END IF;
END $$;
