CREATE TABLE IF NOT EXISTS training_attempts (
    attempt_id UUID PRIMARY KEY,
    employee_code VARCHAR(64) NOT NULL,
    lab_id VARCHAR(128) NOT NULL,
    device_model VARCHAR(128) NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'in_progress',
    started_at TIMESTAMPTZ NOT NULL,
    finished_at TIMESTAMPTZ,
    start_event_id UUID NOT NULL UNIQUE,
    finish_event_id UUID UNIQUE,
    schema_version VARCHAR(16) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT training_attempts_status_check
        CHECK (status IN ('in_progress', 'completed', 'failed', 'abandoned')),
    CONSTRAINT training_attempts_employee_code_check
        CHECK (employee_code ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$'),
    CONSTRAINT training_attempts_schema_version_check
        CHECK (schema_version = '1.0'),
    CONSTRAINT training_attempts_lifecycle_check
        CHECK (
            (status = 'in_progress' AND finished_at IS NULL AND finish_event_id IS NULL)
            OR
            (status <> 'in_progress' AND finished_at IS NOT NULL AND finish_event_id IS NOT NULL)
        ),
    CONSTRAINT training_attempts_time_check
        CHECK (finished_at IS NULL OR finished_at >= started_at)
);

CREATE TABLE IF NOT EXISTS training_events (
    event_id UUID PRIMARY KEY,
    attempt_id UUID NOT NULL,
    employee_code VARCHAR(64) NOT NULL,
    lab_id VARCHAR(128) NOT NULL,
    device_model VARCHAR(128) NOT NULL,
    action VARCHAR(128) NOT NULL,
    status VARCHAR(24) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    event_time TIMESTAMPTZ NOT NULL,
    schema_version VARCHAR(16) NOT NULL,
    payload_hash CHAR(64) NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT training_events_attempt_fkey
        FOREIGN KEY (attempt_id) REFERENCES training_attempts(attempt_id) ON DELETE RESTRICT,
    CONSTRAINT training_events_employee_code_check
        CHECK (employee_code ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$'),
    CONSTRAINT training_events_action_check
        CHECK (action ~ '^[a-z][a-z0-9_-]*\.[a-z][a-z0-9_-]*\.[a-z][a-z0-9_-]*$'),
    CONSTRAINT training_events_status_check
        CHECK (status IN ('started', 'in_progress', 'success', 'passed', 'failed', 'error', 'reset', 'completed', 'abandoned')),
    CONSTRAINT training_events_metadata_check
        CHECK (jsonb_typeof(metadata) = 'object'),
    CONSTRAINT training_events_schema_version_check
        CHECK (schema_version = '1.0'),
    CONSTRAINT training_events_payload_hash_check
        CHECK (payload_hash ~ '^[0-9a-f]{64}$')
);

CREATE TABLE IF NOT EXISTS training_results (
    attempt_id UUID PRIMARY KEY,
    outcome VARCHAR(24) NOT NULL,
    score NUMERIC(5, 2),
    duration_seconds INTEGER NOT NULL,
    passed_checkpoints INTEGER NOT NULL DEFAULT 0,
    failed_checkpoints INTEGER NOT NULL DEFAULT 0,
    error_count INTEGER NOT NULL DEFAULT 0,
    total_actions INTEGER NOT NULL DEFAULT 0,
    first_try BOOLEAN NOT NULL DEFAULT FALSE,
    summary JSONB NOT NULL DEFAULT '{}'::jsonb,
    completed_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT training_results_attempt_fkey
        FOREIGN KEY (attempt_id) REFERENCES training_attempts(attempt_id) ON DELETE RESTRICT,
    CONSTRAINT training_results_outcome_check
        CHECK (outcome IN ('passed', 'failed', 'abandoned')),
    CONSTRAINT training_results_score_check
        CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
    CONSTRAINT training_results_duration_check
        CHECK (duration_seconds >= 0),
    CONSTRAINT training_results_counters_check
        CHECK (
            passed_checkpoints >= 0
            AND failed_checkpoints >= 0
            AND error_count >= 0
            AND total_actions >= 0
        ),
    CONSTRAINT training_results_summary_check
        CHECK (jsonb_typeof(summary) = 'object')
);

CREATE INDEX IF NOT EXISTS idx_training_attempts_employee_started
    ON training_attempts (employee_code, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_training_attempts_lab_started
    ON training_attempts (lab_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_training_attempts_status_started
    ON training_attempts (status, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_training_events_attempt_time
    ON training_events (attempt_id, event_time, event_id);
CREATE INDEX IF NOT EXISTS idx_training_events_action_time
    ON training_events (action, event_time DESC);
CREATE INDEX IF NOT EXISTS idx_training_results_completed
    ON training_results (completed_at DESC);
