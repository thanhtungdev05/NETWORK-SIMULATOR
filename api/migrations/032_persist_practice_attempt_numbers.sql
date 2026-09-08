-- 032: Persist the authoritative practice-attempt sequence on timer_sessions.
-- Guide sessions never consume a practice attempt number.

ALTER TABLE timer_sessions
    ADD COLUMN IF NOT EXISTS practice_attempt_no INTEGER;

-- Canonicalize legacy rows before numbering so email/employee-id history and
-- authenticated user-id history share one continuous sequence.
UPDATE timer_sessions timer
   SET user_id = roster.user_id
  FROM users roster
 WHERE timer.user_id IS NULL
   AND (
       (NULLIF(timer.email, '') IS NOT NULL AND LOWER(timer.email) = LOWER(roster.email))
       OR
       (NULLIF(timer.technician_id, '') IS NOT NULL AND timer.technician_id = roster.employee_id)
   );

WITH numbered AS (
    SELECT id,
           ROW_NUMBER() OVER (
               PARTITION BY COALESCE(
                                user_id::text,
                                NULLIF(LOWER(email), ''),
                                NULLIF(technician_id, '')
                            ),
                            lab_id
               ORDER BY COALESCE(started_at, finished_at, created_at), id
           ) AS attempt_no
      FROM timer_sessions
     WHERE mode IN ('Thực hành', 'practice')
)
UPDATE timer_sessions timer
   SET practice_attempt_no = numbered.attempt_no
  FROM numbered
 WHERE numbered.id = timer.id
   AND timer.practice_attempt_no IS NULL;

UPDATE timer_sessions
   SET practice_attempt_no = NULL
 WHERE mode IN ('Hướng dẫn', 'guide')
   AND practice_attempt_no IS NOT NULL;

UPDATE timer_sessions
   SET completed_first_try = CASE
       WHEN mode IN ('Thực hành', 'practice') AND is_passed IS TRUE
           THEN practice_attempt_no = 1
       ELSE NULL
   END;

ALTER TABLE timer_sessions
    DROP CONSTRAINT IF EXISTS timer_sessions_practice_attempt_no_check;
ALTER TABLE timer_sessions
    ADD CONSTRAINT timer_sessions_practice_attempt_no_check
    CHECK (
        (mode IN ('Thực hành', 'practice') AND practice_attempt_no >= 1)
        OR
        (mode IN ('Hướng dẫn', 'guide') AND practice_attempt_no IS NULL)
    ) NOT VALID;

ALTER TABLE timer_sessions
    VALIDATE CONSTRAINT timer_sessions_practice_attempt_no_check;

CREATE UNIQUE INDEX IF NOT EXISTS idx_timer_sessions_identity_lab_attempt
    ON timer_sessions (
        COALESCE(user_id::text, NULLIF(LOWER(email), ''), NULLIF(technician_id, '')),
        lab_id,
        practice_attempt_no
    )
    WHERE mode IN ('Thực hành', 'practice')
      AND practice_attempt_no IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_timer_sessions_lab_pass_attempt
    ON timer_sessions (lab_id, is_passed, practice_attempt_no)
    WHERE mode IN ('Thực hành', 'practice');

COMMENT ON COLUMN timer_sessions.practice_attempt_no IS
    'Server-assigned immutable sequence for a technician and lab; guide sessions are NULL.';
