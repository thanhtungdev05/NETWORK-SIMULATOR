-- 013: Model training cohorts independently from the employee source roster.
--
-- users.class_code remains the class code imported from the source workbook.
-- The current operational/demo class is resolved through class_enrollments so
-- class history can be preserved without overwriting source data.

CREATE TABLE IF NOT EXISTS training_classes (
    class_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_code VARCHAR(50) NOT NULL UNIQUE,
    class_name TEXT NOT NULL,
    region_name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    capacity INTEGER NOT NULL DEFAULT 10,
    status VARCHAR(20) NOT NULL DEFAULT 'planned',
    instructor_user_id UUID,
    is_mock BOOLEAN NOT NULL DEFAULT FALSE,
    seed_batch VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT training_classes_instructor_fkey
        FOREIGN KEY (instructor_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    CONSTRAINT training_classes_capacity_check
        CHECK (capacity BETWEEN 1 AND 100),
    CONSTRAINT training_classes_status_check
        CHECK (status IN ('planned', 'active', 'completed', 'archived')),
    CONSTRAINT training_classes_dates_check
        CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS class_enrollments (
    enrollment_id BIGSERIAL PRIMARY KEY,
    class_id UUID NOT NULL,
    user_id UUID NOT NULL,
    source_class_code VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    valid_from DATE NOT NULL,
    valid_to DATE,
    is_mock BOOLEAN NOT NULL DEFAULT FALSE,
    seed_batch VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT class_enrollments_class_fkey
        FOREIGN KEY (class_id) REFERENCES training_classes(class_id) ON DELETE RESTRICT,
    CONSTRAINT class_enrollments_user_fkey
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    CONSTRAINT class_enrollments_status_check
        CHECK (status IN ('active', 'completed', 'withdrawn')),
    CONSTRAINT class_enrollments_dates_check
        CHECK (valid_to IS NULL OR valid_to >= valid_from),
    CONSTRAINT class_enrollments_class_user_from_unique
        UNIQUE (class_id, user_id, valid_from)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_class_enrollments_one_current_class
    ON class_enrollments (user_id)
    WHERE status = 'active' AND valid_to IS NULL;
CREATE INDEX IF NOT EXISTS idx_class_enrollments_class_status
    ON class_enrollments (class_id, status, valid_from, valid_to);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_seed_batch
    ON class_enrollments (seed_batch)
    WHERE seed_batch IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_training_classes_region_status
    ON training_classes (region_name, status, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_training_classes_seed_batch
    ON training_classes (seed_batch)
    WHERE seed_batch IS NOT NULL;

CREATE OR REPLACE VIEW v_current_training_class AS
SELECT enrollment.user_id,
       training.class_id,
       training.class_code,
       training.class_name,
       training.region_name,
       enrollment.source_class_code,
       enrollment.valid_from,
       enrollment.valid_to
  FROM class_enrollments enrollment
  JOIN training_classes training ON training.class_id = enrollment.class_id
 WHERE enrollment.status = 'active'
   AND enrollment.valid_from <= CURRENT_DATE
   AND (enrollment.valid_to IS NULL OR enrollment.valid_to >= CURRENT_DATE)
   AND training.status = 'active';

-- A timer submission without an evaluated result must not silently become a
-- first-try success. NULL explicitly means that the simulator did not provide
-- enough evidence to calculate this metric.
ALTER TABLE timer_sessions ALTER COLUMN completed_first_try DROP NOT NULL;
ALTER TABLE timer_sessions ALTER COLUMN completed_first_try DROP DEFAULT;
UPDATE timer_sessions
   SET completed_first_try = NULL
 WHERE status IS DISTINCT FROM 'completed';

ALTER TABLE timer_sessions
    ADD CONSTRAINT timer_sessions_status_check
    CHECK (status IN ('completed', 'in_progress', 'failed', 'abandoned', 'not_started')) NOT VALID;
ALTER TABLE timer_sessions
    ADD CONSTRAINT timer_sessions_mode_check
    CHECK (mode IN ('Thực hành', 'Hướng dẫn')) NOT VALID;
ALTER TABLE timer_sessions
    ADD CONSTRAINT timer_sessions_duration_check
    CHECK (duration_sec IS NULL OR duration_sec >= 0) NOT VALID;
ALTER TABLE timer_sessions
    ADD CONSTRAINT timer_sessions_first_try_check
    CHECK (status = 'completed' OR completed_first_try IS NULL) NOT VALID;
