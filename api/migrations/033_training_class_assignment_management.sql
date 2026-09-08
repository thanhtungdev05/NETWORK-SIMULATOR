-- 033: Restore an operational class/assignment model after migration 025
-- removed the obsolete LMS tables, then enable multi-class membership.

CREATE TABLE IF NOT EXISTS curricula (
    curriculum_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculum_code VARCHAR(80) NOT NULL,
    version VARCHAR(30) NOT NULL,
    curriculum_name TEXT NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    effective_from DATE,
    effective_to DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT curricula_code_version_unique UNIQUE (curriculum_code, version),
    CONSTRAINT curricula_status_check CHECK (status IN ('draft', 'active', 'retired', 'archived')),
    CONSTRAINT curricula_dates_check CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_curricula_one_active_default
    ON curricula (is_default)
    WHERE is_default = TRUE AND status = 'active';

INSERT INTO curricula (
    curriculum_code, version, curriculum_name, description, status,
    is_default, effective_from, created_at, updated_at
) VALUES (
    'FTC-PORTAL-LABS', '1', 'Danh mục bài thực hành FTC',
    'Danh mục vận hành được đồng bộ từ lab_catalog.',
    'active', FALSE, CURRENT_DATE, NOW(), NOW()
)
ON CONFLICT (curriculum_code, version) DO UPDATE SET
    curriculum_name = EXCLUDED.curriculum_name,
    description = EXCLUDED.description,
    status = 'active',
    updated_at = NOW();

UPDATE curricula target
   SET is_default = TRUE,
       updated_at = NOW()
 WHERE target.curriculum_code = 'FTC-PORTAL-LABS'
   AND target.version = '1'
   AND NOT EXISTS (
       SELECT 1 FROM curricula current_default
        WHERE current_default.is_default = TRUE
          AND current_default.status = 'active'
   );

CREATE TABLE IF NOT EXISTS curriculum_labs (
    curriculum_lab_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculum_id UUID NOT NULL REFERENCES curricula(curriculum_id) ON DELETE RESTRICT,
    lab_id VARCHAR(50) NOT NULL REFERENCES lab_catalog(lab_id) ON DELETE RESTRICT,
    required_mode VARCHAR(20) NOT NULL DEFAULT 'practice',
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    available_offset_days INTEGER NOT NULL DEFAULT 0,
    due_offset_days INTEGER,
    passing_score NUMERIC(5, 2),
    max_attempts INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT curriculum_labs_unique UNIQUE (curriculum_id, lab_id, required_mode),
    CONSTRAINT curriculum_labs_mode_check CHECK (required_mode IN ('practice', 'guide', 'both')),
    CONSTRAINT curriculum_labs_offsets_check CHECK (available_offset_days >= 0 AND (due_offset_days IS NULL OR due_offset_days >= available_offset_days)),
    CONSTRAINT curriculum_labs_passing_score_check CHECK (passing_score IS NULL OR (passing_score >= 0 AND passing_score <= 100)),
    CONSTRAINT curriculum_labs_max_attempts_check CHECK (max_attempts IS NULL OR max_attempts >= 1)
);

INSERT INTO curriculum_labs (
    curriculum_id, lab_id, required_mode, is_required, sort_order,
    created_at, updated_at
)
SELECT curriculum.curriculum_id, lab.lab_id, 'practice', TRUE, lab.sort_order,
       NOW(), NOW()
  FROM curricula curriculum
 CROSS JOIN lab_catalog lab
 WHERE curriculum.curriculum_code = 'FTC-PORTAL-LABS'
   AND curriculum.version = '1'
   AND lab.is_active = TRUE
ON CONFLICT (curriculum_id, lab_id, required_mode) DO UPDATE SET
    is_required = TRUE,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();

CREATE TABLE IF NOT EXISTS training_classes (
    class_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_code VARCHAR(50) NOT NULL UNIQUE,
    class_name TEXT NOT NULL,
    region_name VARCHAR(50) NOT NULL DEFAULT 'Toàn quốc',
    region_id UUID REFERENCES regions(region_id) ON DELETE RESTRICT,
    curriculum_id UUID REFERENCES curricula(curriculum_id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE,
    capacity INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'planned',
    instructor_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    description TEXT,
    is_mock BOOLEAN NOT NULL DEFAULT FALSE,
    seed_batch VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT training_classes_status_check CHECK (status IN ('planned', 'active', 'completed', 'archived')),
    CONSTRAINT training_classes_capacity_check CHECK (capacity IS NULL OR capacity >= 1),
    CONSTRAINT training_classes_dates_check CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Compatibility for databases where an earlier baseline retained these tables.
ALTER TABLE training_classes
    ADD COLUMN IF NOT EXISTS region_id UUID,
    ADD COLUMN IF NOT EXISTS curriculum_id UUID,
    ADD COLUMN IF NOT EXISTS created_by UUID,
    ADD COLUMN IF NOT EXISTS description TEXT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
         WHERE conname = 'training_classes_region_fkey'
           AND conrelid = 'training_classes'::regclass
    ) THEN
        ALTER TABLE training_classes ADD CONSTRAINT training_classes_region_fkey
            FOREIGN KEY (region_id) REFERENCES regions(region_id) ON DELETE RESTRICT;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
         WHERE conname = 'training_classes_curriculum_fkey'
           AND conrelid = 'training_classes'::regclass
    ) THEN
        ALTER TABLE training_classes ADD CONSTRAINT training_classes_curriculum_fkey
            FOREIGN KEY (curriculum_id) REFERENCES curricula(curriculum_id) ON DELETE RESTRICT;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
         WHERE conname = 'training_classes_created_by_fkey'
           AND conrelid = 'training_classes'::regclass
    ) THEN
        ALTER TABLE training_classes ADD CONSTRAINT training_classes_created_by_fkey
            FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL;
    END IF;
END $$;

UPDATE training_classes training
   SET curriculum_id = curriculum.curriculum_id,
       updated_at = NOW()
  FROM curricula curriculum
 WHERE training.curriculum_id IS NULL
   AND curriculum.curriculum_code = 'FTC-PORTAL-LABS'
   AND curriculum.version = '1';

CREATE TABLE IF NOT EXISTS class_enrollments (
    enrollment_id BIGSERIAL PRIMARY KEY,
    class_id UUID NOT NULL REFERENCES training_classes(class_id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    source_class_code VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    valid_from DATE NOT NULL,
    valid_to DATE,
    is_mock BOOLEAN NOT NULL DEFAULT FALSE,
    seed_batch VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT class_enrollments_status_check CHECK (status IN ('active', 'completed', 'withdrawn')),
    CONSTRAINT class_enrollments_dates_check CHECK (valid_to IS NULL OR valid_to >= valid_from),
    CONSTRAINT class_enrollments_class_user_from_unique UNIQUE (class_id, user_id, valid_from),
    CONSTRAINT class_enrollments_id_class_unique UNIQUE (enrollment_id, class_id)
);

DROP INDEX IF EXISTS idx_class_enrollments_one_current_class;
DROP INDEX IF EXISTS idx_class_enrollments_one_current_employee_class;

CREATE UNIQUE INDEX IF NOT EXISTS idx_class_enrollments_one_open_membership
    ON class_enrollments (class_id, user_id)
    WHERE status = 'active' AND valid_to IS NULL;
CREATE INDEX IF NOT EXISTS idx_class_enrollments_user_effective
    ON class_enrollments (user_id, status, valid_from, valid_to, class_id);

CREATE TABLE IF NOT EXISTS class_lab_assignments (
    class_lab_assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES training_classes(class_id) ON DELETE RESTRICT,
    curriculum_lab_id UUID NOT NULL REFERENCES curriculum_labs(curriculum_lab_id) ON DELETE RESTRICT,
    assigned_at TIMESTAMPTZ NOT NULL,
    due_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'assigned',
    assignment_source VARCHAR(30) NOT NULL DEFAULT 'manual',
    is_inferred BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT class_lab_assignments_status_check CHECK (status IN ('assigned', 'active', 'closed', 'cancelled', 'waived')),
    CONSTRAINT class_lab_assignments_source_check CHECK (assignment_source IN ('curriculum', 'manual', 'import', 'legacy_observed', 'other')),
    CONSTRAINT class_lab_assignments_time_check CHECK (due_at IS NULL OR due_at >= assigned_at),
    CONSTRAINT class_lab_assignments_unique UNIQUE (class_id, curriculum_lab_id),
    CONSTRAINT class_lab_assignments_id_context_unique UNIQUE (class_lab_assignment_id, class_id, curriculum_lab_id)
);

CREATE TABLE IF NOT EXISTS lab_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id BIGINT NOT NULL REFERENCES class_enrollments(enrollment_id) ON DELETE RESTRICT,
    class_lab_assignment_id UUID,
    curriculum_lab_id UUID NOT NULL REFERENCES curriculum_labs(curriculum_lab_id) ON DELETE RESTRICT,
    assigned_at TIMESTAMPTZ NOT NULL,
    due_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'assigned',
    first_pass_attempt_no INTEGER,
    first_try_evidence VARCHAR(24) NOT NULL DEFAULT 'unknown',
    completed_at TIMESTAMPTZ,
    passed_at TIMESTAMPTZ,
    region_id_snapshot UUID REFERENCES regions(region_id) ON DELETE RESTRICT,
    class_id_snapshot UUID NOT NULL REFERENCES training_classes(class_id) ON DELETE RESTRICT,
    assignment_source VARCHAR(30) NOT NULL DEFAULT 'manual',
    is_inferred BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT lab_assignments_class_lab_fkey
        FOREIGN KEY (class_lab_assignment_id) REFERENCES class_lab_assignments(class_lab_assignment_id) ON DELETE RESTRICT,
    CONSTRAINT lab_assignments_enrollment_class_fkey
        FOREIGN KEY (enrollment_id, class_id_snapshot) REFERENCES class_enrollments(enrollment_id, class_id) ON DELETE RESTRICT,
    CONSTRAINT lab_assignments_class_lab_context_fkey
        FOREIGN KEY (class_lab_assignment_id, class_id_snapshot, curriculum_lab_id)
        REFERENCES class_lab_assignments(class_lab_assignment_id, class_id, curriculum_lab_id) ON DELETE RESTRICT,
    CONSTRAINT lab_assignments_status_check CHECK (status IN ('assigned', 'in_progress', 'passed', 'expired', 'waived')),
    CONSTRAINT lab_assignments_source_check CHECK (assignment_source IN ('explicit', 'class_curriculum', 'manual', 'import', 'legacy_observed', 'other')),
    CONSTRAINT lab_assignments_time_check CHECK (due_at IS NULL OR due_at >= assigned_at),
    CONSTRAINT lab_assignments_first_pass_check CHECK (first_pass_attempt_no IS NULL OR first_pass_attempt_no >= 1),
    CONSTRAINT lab_assignments_first_try_evidence_check CHECK (first_try_evidence IN ('unknown', 'derived_complete', 'legacy_reported')),
    CONSTRAINT lab_assignments_completion_check CHECK (
        (status = 'passed' AND completed_at IS NOT NULL AND first_pass_attempt_no IS NOT NULL)
        OR (status <> 'passed' AND completed_at IS NULL AND first_pass_attempt_no IS NULL)
    ),
    CONSTRAINT lab_assignments_unique UNIQUE (enrollment_id, curriculum_lab_id)
);

CREATE INDEX IF NOT EXISTS idx_training_classes_status_dates
    ON training_classes (status, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_class_lab_assignments_class_status
    ON class_lab_assignments (class_id, status, assigned_at, due_at);
CREATE INDEX IF NOT EXISTS idx_lab_assignments_enrollment_status
    ON lab_assignments (enrollment_id, status, assigned_at, due_at);
CREATE INDEX IF NOT EXISTS idx_lab_assignments_class_status
    ON lab_assignments (class_id_snapshot, status, curriculum_lab_id);

CREATE SEQUENCE IF NOT EXISTS training_class_code_seq AS BIGINT START WITH 1;

DO $$
DECLARE
    next_value BIGINT;
BEGIN
    SELECT COALESCE(MAX((regexp_match(class_code, '^FTC-([0-9]+)$'))[1]::BIGINT), 0) + 1
      INTO next_value
      FROM training_classes;
    PERFORM setval('training_class_code_seq', GREATEST(next_value, 1), FALSE);
END $$;

CREATE OR REPLACE VIEW v_current_training_class AS
SELECT enrollment.user_id,
       training.class_code,
       training.class_name,
       training.region_name,
       training.class_id,
       enrollment.enrollment_id,
       enrollment.valid_from,
       enrollment.valid_to
  FROM class_enrollments enrollment
  JOIN training_classes training ON training.class_id = enrollment.class_id
 WHERE enrollment.status = 'active'
   AND enrollment.valid_from <= CURRENT_DATE
   AND (enrollment.valid_to IS NULL OR enrollment.valid_to >= CURRENT_DATE)
   AND training.status IN ('planned', 'active')
   AND training.start_date <= CURRENT_DATE
   AND (training.end_date IS NULL OR training.end_date >= CURRENT_DATE);

CREATE OR REPLACE VIEW v_lab_assignment_progress AS
SELECT assignment.assignment_id,
       enrollment.enrollment_id,
       roster.user_id,
       roster.employee_id AS employee_code,
       COALESCE(roster.display_name, '') AS full_name,
       COALESCE(roster.email, '') AS email,
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
       CASE WHEN assignment.status = 'passed' AND assignment.first_pass_attempt_no IS NOT NULL
            THEN assignment.first_pass_attempt_no = 1 ELSE NULL END AS first_try_success,
       CASE WHEN assignment.status = 'passed' AND assignment.first_try_evidence = 'legacy_reported'
            THEN assignment.first_pass_attempt_no = 1 ELSE NULL END AS legacy_reported_first_try_success,
       0::BIGINT AS practice_attempt_count,
       0::BIGINT AS failed_attempt_count,
       0::BIGINT AS abandoned_attempt_count,
       0::BIGINT AS in_progress_attempt_count,
       NULL::BOOLEAN AS attempt_sequence_complete,
       assignment.assignment_source,
       assignment.is_inferred,
       assignment.passed_at,
       0::BIGINT AS practice_completion_count,
       0::BIGINT AS practice_graded_attempt_count,
       0::BIGINT AS guide_attempt_count,
       0::BIGINT AS guide_completion_count
  FROM lab_assignments assignment
  JOIN class_enrollments enrollment ON enrollment.enrollment_id = assignment.enrollment_id
  JOIN users roster ON roster.user_id = enrollment.user_id
  JOIN training_classes training ON training.class_id = assignment.class_id_snapshot
  JOIN curriculum_labs curriculum_lab ON curriculum_lab.curriculum_lab_id = assignment.curriculum_lab_id
  JOIN curricula curriculum ON curriculum.curriculum_id = curriculum_lab.curriculum_id
  JOIN lab_catalog lab ON lab.lab_id = curriculum_lab.lab_id
  JOIN device_catalog device ON device.device_id = lab.device_id
  LEFT JOIN regions region ON region.region_id = assignment.region_id_snapshot;

CREATE TABLE IF NOT EXISTS assignment_import_log (
    id BIGSERIAL PRIMARY KEY,
    batch_id VARCHAR(100) NOT NULL UNIQUE,
    imported_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    file_name TEXT,
    class_count INTEGER NOT NULL DEFAULT 0,
    member_count INTEGER NOT NULL DEFAULT 0,
    device_count INTEGER NOT NULL DEFAULT 0,
    assignment_count INTEGER NOT NULL DEFAULT 0,
    error_count INTEGER NOT NULL DEFAULT 0,
    error_details JSONB NOT NULL DEFAULT '[]'::jsonb,
    imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assignment_import_log_imported_at
    ON assignment_import_log (imported_at DESC);
CREATE INDEX IF NOT EXISTS idx_assignment_import_log_imported_by
    ON assignment_import_log (imported_by)
    WHERE imported_by IS NOT NULL;
