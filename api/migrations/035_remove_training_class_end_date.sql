-- 035: Remove training_classes.end_date entirely. A class is now open-ended
-- once it starts; there is no system-side class end date.

-- Step 1: Clean up derived data before the column is dropped.
-- Active enrollments whose valid_to matched the class end date become open-ended.
UPDATE class_enrollments enrollment
   SET valid_to = NULL, updated_at = NOW()
  FROM training_classes training
 WHERE training.class_id = enrollment.class_id
   AND enrollment.status = 'active'
   AND enrollment.valid_to = training.end_date;

-- Class-level lab assignments whose due_at were derived from the class end date
-- (end_date + 1 day - 1 second) become open-ended (no due date).
UPDATE class_lab_assignments assignment
   SET due_at = NULL, updated_at = NOW()
  FROM training_classes training
 WHERE training.class_id = assignment.class_id
   AND training.end_date IS NOT NULL
   AND assignment.due_at = training.end_date::timestamp + INTERVAL '1 day' - INTERVAL '1 second';

-- Individual lab assignments with the same end-date-derived due_at become open-ended.
UPDATE lab_assignments individual
   SET due_at = NULL, updated_at = NOW()
  FROM training_classes training
 WHERE training.class_id = individual.class_id_snapshot
   AND training.end_date IS NOT NULL
   AND individual.due_at = training.end_date::timestamp + INTERVAL '1 day' - INTERVAL '1 second';

-- Step 2: Recreate the view that filters on training.end_date before dropping it.
DROP VIEW IF EXISTS v_current_training_class;

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
   AND training.start_date <= CURRENT_DATE;

-- Step 3: Drop the column (PostgreSQL also drops the dependent CHECK
-- constraint and the idx_training_classes_status_dates index).
ALTER TABLE training_classes
    DROP COLUMN IF EXISTS end_date;

-- Step 4: Recreate the lookup index (now without end_date) so the
-- status/start_date class queries keep their prior performance.
CREATE INDEX IF NOT EXISTS idx_training_classes_status_dates
    ON training_classes (status, start_date);