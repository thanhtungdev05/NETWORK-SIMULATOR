-- 023: Preserve legacy completion facts without manufacturing grading results.
--
-- Firestore activity_logs record that a lab activity was completed, but do not
-- contain a score or an explicit pass/fail result.  Completion and grading are
-- therefore modeled as two independent facts.
--
-- NOTE: All operations on lab_assignments, lab_attempts, and training_classes
-- are guarded with existence checks, because migration 025 drops these tables
-- and a fresh database may reach this migration without them.

DO $$
BEGIN
    -- ----------------------------------------------------------------
    -- lab_assignments: add passed_at column and update constraints
    -- ----------------------------------------------------------------
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lab_assignments') THEN

        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
             WHERE table_name = 'lab_assignments' AND column_name = 'passed_at'
        ) THEN
            ALTER TABLE lab_assignments ADD COLUMN passed_at TIMESTAMPTZ;
        END IF;

        UPDATE lab_assignments
           SET passed_at = completed_at
         WHERE status = 'passed' AND passed_at IS NULL;

        ALTER TABLE lab_assignments
            DROP CONSTRAINT IF EXISTS lab_assignments_status_check;
        ALTER TABLE lab_assignments
            ADD CONSTRAINT lab_assignments_status_check
            CHECK (status IN ('assigned', 'in_progress', 'completed', 'passed', 'expired', 'waived'));

        ALTER TABLE lab_assignments
            DROP CONSTRAINT IF EXISTS lab_assignments_completion_check;
        ALTER TABLE lab_assignments
            ADD CONSTRAINT lab_assignments_completion_check
            CHECK (
                (status = 'passed'
                    AND completed_at IS NOT NULL
                    AND passed_at IS NOT NULL
                    AND first_pass_attempt_no IS NOT NULL)
                OR
                (status = 'completed'
                    AND completed_at IS NOT NULL
                    AND passed_at IS NULL
                    AND first_pass_attempt_no IS NULL)
                OR
                (status NOT IN ('completed', 'passed')
                    AND completed_at IS NULL
                    AND passed_at IS NULL
                    AND first_pass_attempt_no IS NULL)
            );

        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints
             WHERE table_name = 'lab_assignments'
               AND constraint_name = 'lab_assignments_passed_time_check'
        ) THEN
            ALTER TABLE lab_assignments
                ADD CONSTRAINT lab_assignments_passed_time_check
                CHECK (passed_at IS NULL OR (completed_at IS NOT NULL AND passed_at >= completed_at));
        END IF;

    END IF; -- end lab_assignments block

    -- ----------------------------------------------------------------
    -- lab_attempts: update lifecycle constraint
    -- ----------------------------------------------------------------
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lab_attempts') THEN

        ALTER TABLE lab_attempts
            DROP CONSTRAINT IF EXISTS lab_attempts_lifecycle_check;
        ALTER TABLE lab_attempts
            ADD CONSTRAINT lab_attempts_lifecycle_check
            CHECK (
                (status = 'in_progress' AND finished_at IS NULL AND outcome IS NULL)
                OR (status = 'completed' AND finished_at IS NOT NULL AND (outcome IS NULL OR outcome = 'passed'))
                OR (status = 'failed' AND finished_at IS NOT NULL AND outcome = 'failed')
                OR (status = 'abandoned' AND finished_at IS NOT NULL AND outcome IS NULL)
            );

    END IF; -- end lab_attempts block

    -- ----------------------------------------------------------------
    -- training_classes: make capacity optional
    -- ----------------------------------------------------------------
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'training_classes') THEN

        ALTER TABLE training_classes
            DROP CONSTRAINT IF EXISTS training_classes_capacity_check;
        ALTER TABLE training_classes
            ALTER COLUMN capacity DROP NOT NULL,
            ALTER COLUMN capacity DROP DEFAULT;
        ALTER TABLE training_classes
            ADD CONSTRAINT training_classes_capacity_check
            CHECK (capacity IS NULL OR capacity >= 1);

    END IF; -- end training_classes block

END $$;

-- ----------------------------------------------------------------
-- users: case-insensitive unique email index (always safe)
-- ----------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_lower_email_unique
    ON users (LOWER(email));

-- ----------------------------------------------------------------
-- lab_assignments indexes (only if table exists)
-- ----------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lab_assignments') THEN

        CREATE INDEX IF NOT EXISTS idx_lab_assignments_completed_at
            ON lab_assignments (completed_at DESC)
            WHERE completed_at IS NOT NULL;

        CREATE INDEX IF NOT EXISTS idx_lab_assignments_passed_at
            ON lab_assignments (passed_at DESC)
            WHERE passed_at IS NOT NULL;

    END IF;
END $$;

-- ----------------------------------------------------------------
-- v_lab_assignment_progress: only create/replace if both tables exist
-- ----------------------------------------------------------------
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
          LEFT JOIN regions region ON region.region_id = assignment.region_id_snapshot
          LEFT JOIN practice_attempts attempt ON attempt.assignment_id = assignment.assignment_id;
        $view$;

    END IF;
END $$;

-- ----------------------------------------------------------------
-- Validate constraints — guard each one individually
-- ----------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
         WHERE table_name = 'device_catalog'
           AND constraint_name = 'device_catalog_sort_order_check'
    ) THEN
        ALTER TABLE device_catalog VALIDATE CONSTRAINT device_catalog_sort_order_check;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
         WHERE table_name = 'lab_catalog'
           AND constraint_name = 'lab_catalog_sort_order_check'
    ) THEN
        ALTER TABLE lab_catalog VALIDATE CONSTRAINT lab_catalog_sort_order_check;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
         WHERE table_name = 'timer_sessions'
           AND constraint_name = 'timer_sessions_device_id_fkey'
    ) THEN
        ALTER TABLE timer_sessions VALIDATE CONSTRAINT timer_sessions_device_id_fkey;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
         WHERE table_name = 'timer_sessions'
           AND constraint_name = 'timer_sessions_duration_check'
    ) THEN
        ALTER TABLE timer_sessions VALIDATE CONSTRAINT timer_sessions_duration_check;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
         WHERE table_name = 'timer_sessions'
           AND constraint_name = 'timer_sessions_mode_check'
    ) THEN
        ALTER TABLE timer_sessions VALIDATE CONSTRAINT timer_sessions_mode_check;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
         WHERE table_name = 'timer_sessions'
           AND constraint_name = 'timer_sessions_status_check'
    ) THEN
        ALTER TABLE timer_sessions VALIDATE CONSTRAINT timer_sessions_status_check;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
         WHERE table_name = 'timer_sessions'
           AND constraint_name = 'timer_sessions_first_try_check'
    ) THEN
        ALTER TABLE timer_sessions VALIDATE CONSTRAINT timer_sessions_first_try_check;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
         WHERE table_name = 'training_classes'
           AND constraint_name = 'training_classes_curriculum_fkey'
    ) THEN
        ALTER TABLE training_classes VALIDATE CONSTRAINT training_classes_curriculum_fkey;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
         WHERE table_name = 'training_classes'
           AND constraint_name = 'training_classes_region_fkey'
    ) THEN
        ALTER TABLE training_classes VALIDATE CONSTRAINT training_classes_region_fkey;
    END IF;
END $$;
