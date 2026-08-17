-- 012: Extend the IAM user table with the employee roster fields used by the
-- KTV dashboard, and make timer sessions traceable to a DB user.
--
-- Employee data itself is intentionally NOT embedded in this migration.
-- Use api/seed_dashboard_ktv.php with an approved workbook when test data is
-- needed. The source workbook can contain personal data and must stay outside
-- the repository.

ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_id VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS training_start_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS training_end_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS class_code VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_terminated BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS termination_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS termination_reason TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS unit_code VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS unit_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS region_code VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS branch_code VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS dashboard_region VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_source TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_seed_batch VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_synced_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_employee_id
    ON users (employee_id)
    WHERE employee_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_class_code
    ON users (class_code)
    WHERE class_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_dashboard_region
    ON users (dashboard_region)
    WHERE dashboard_region IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_employment_status
    ON users (is_terminated, dashboard_region, class_code);
CREATE INDEX IF NOT EXISTS idx_users_employee_seed_batch
    ON users (employee_seed_batch)
    WHERE employee_seed_batch IS NOT NULL;

ALTER TABLE timer_sessions ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE timer_sessions ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'completed';
ALTER TABLE timer_sessions ADD COLUMN IF NOT EXISTS completed_first_try BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE timer_sessions ADD COLUMN IF NOT EXISTS last_action TEXT;
ALTER TABLE timer_sessions ADD COLUMN IF NOT EXISTS is_mock BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE timer_sessions ADD COLUMN IF NOT EXISTS seed_batch VARCHAR(100);
ALTER TABLE timer_sessions ADD COLUMN IF NOT EXISTS seed_key VARCHAR(200);

UPDATE timer_sessions AS timer
   SET user_id = COALESCE(
       (
           SELECT roster.user_id
             FROM users AS roster
            WHERE roster.employee_id = NULLIF(BTRIM(timer.technician_id), '')
            LIMIT 1
       ),
       (
           SELECT roster.user_id
             FROM users AS roster
            WHERE LOWER(roster.email) = LOWER(NULLIF(BTRIM(timer.email), ''))
            LIMIT 1
       )
   )
 WHERE timer.user_id IS NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
          FROM pg_constraint
         WHERE conname = 'timer_sessions_user_id_fkey'
           AND conrelid = 'timer_sessions'::regclass
    ) THEN
        ALTER TABLE timer_sessions
            ADD CONSTRAINT timer_sessions_user_id_fkey
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL NOT VALID;
    END IF;
END $$;

ALTER TABLE timer_sessions VALIDATE CONSTRAINT timer_sessions_user_id_fkey;

CREATE INDEX IF NOT EXISTS idx_timer_sessions_user_started
    ON timer_sessions (user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_timer_sessions_seed_batch
    ON timer_sessions (seed_batch)
    WHERE seed_batch IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_timer_sessions_seed_key
    ON timer_sessions (seed_key)
    WHERE seed_key IS NOT NULL;
