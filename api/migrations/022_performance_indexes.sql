-- 022: Performance indexes for dashboard queries.
-- Addresses slow LATERAL JOIN and missing ORDER BY indexes.

-- timer_sessions: ORDER BY COALESCE(started_at, finished_at) DESC
CREATE INDEX IF NOT EXISTS idx_timer_sessions_coalesce_started
    ON timer_sessions (COALESCE(started_at, finished_at) DESC);

-- timer_sessions: WHERE user_id / technician_id / email lookups
CREATE INDEX IF NOT EXISTS idx_timer_sessions_user_id
    ON timer_sessions (user_id) WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_timer_sessions_technician_id
    ON timer_sessions (technician_id);

CREATE INDEX IF NOT EXISTS idx_timer_sessions_email_trimmed
    ON timer_sessions (LOWER(NULLIF(BTRIM(email), ''))) WHERE email IS NOT NULL AND email <> '';

-- users: LATERAL JOIN lookups (employee_id exact + email ILIKE)
CREATE INDEX IF NOT EXISTS idx_users_employee_id_lookup
    ON users (employee_id) WHERE employee_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_lower_email
    ON users (LOWER(email)) WHERE email IS NOT NULL AND email <> '';

-- users: roster list query
CREATE INDEX IF NOT EXISTS idx_users_roster_list
    ON users (is_terminated, employee_id)
    WHERE employee_id IS NOT NULL
      AND (job_title = 'CB Kỹ thuật TKBT' OR employee_source IS NOT NULL);
