UPDATE activity_logs AS logs
SET user_id = users.user_id
FROM users
WHERE logs.user_id IS NULL
  AND LOWER(COALESCE(logs.technician_email, logs.email, logs.user_email, '')) = LOWER(users.email);

UPDATE login_logs AS logs
SET user_id = users.user_id
FROM users
WHERE logs.user_id IS NULL
  AND LOWER(COALESCE(logs.email, '')) = LOWER(users.email);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'activity_logs_user_id_fkey' AND conrelid = 'activity_logs'::regclass) THEN
        ALTER TABLE activity_logs
            ADD CONSTRAINT activity_logs_user_id_fkey
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL NOT VALID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'login_logs_user_id_fkey' AND conrelid = 'login_logs'::regclass) THEN
        ALTER TABLE login_logs
            ADD CONSTRAINT login_logs_user_id_fkey
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL NOT VALID;
    END IF;
END $$;

ALTER TABLE activity_logs VALIDATE CONSTRAINT activity_logs_user_id_fkey;
ALTER TABLE login_logs VALIDATE CONSTRAINT login_logs_user_id_fkey;

CREATE TABLE IF NOT EXISTS user_role_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    target_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    old_role TEXT NOT NULL,
    new_role TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT user_role_audit_old_role_check CHECK (old_role IN ('user', 'admin')),
    CONSTRAINT user_role_audit_new_role_check CHECK (new_role IN ('user', 'admin'))
);

CREATE INDEX IF NOT EXISTS idx_user_role_audit_target_created
    ON user_role_audit_logs (target_user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS app_sessions (
    session_id_hash CHAR(64) PRIMARY KEY,
    data TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_sessions_expires_at ON app_sessions (expires_at);
