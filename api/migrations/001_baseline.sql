CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    employee_id TEXT,
    display_name TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    iam_subject TEXT,
    last_login_at TIMESTAMPTZ,
    iam_profile JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT gen_random_uuid();
ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_status TEXT DEFAULT 'provisional';
ALTER TABLE users ADD COLUMN IF NOT EXISTS iam_subject TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS iam_profile JSONB DEFAULT '{}'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'employee_code'
    ) THEN
        UPDATE users SET employee_id = employee_code WHERE employee_id IS NULL AND employee_code IS NOT NULL;
    END IF;
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'mnv'
    ) THEN
        UPDATE users SET employee_id = mnv WHERE employee_id IS NULL AND mnv IS NOT NULL;
    END IF;
END $$;

UPDATE users SET user_id = gen_random_uuid() WHERE user_id IS NULL;
UPDATE users SET role = 'user' WHERE role IS NULL OR role NOT IN ('user', 'admin');
UPDATE users SET profile_status = 'provisional' WHERE profile_status IS NULL OR profile_status NOT IN ('provisional', 'enriched', 'unmatched', 'conflict');
UPDATE users SET iam_profile = '{}'::jsonb WHERE iam_profile IS NULL;
UPDATE users SET created_at = NOW() WHERE created_at IS NULL;
UPDATE users SET updated_at = NOW() WHERE updated_at IS NULL;

ALTER TABLE users ALTER COLUMN user_id SET DEFAULT gen_random_uuid();
ALTER TABLE users ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';
ALTER TABLE users ALTER COLUMN role SET NOT NULL;
ALTER TABLE users ALTER COLUMN profile_status SET DEFAULT 'provisional';
ALTER TABLE users ALTER COLUMN profile_status SET NOT NULL;
ALTER TABLE users ALTER COLUMN iam_profile SET DEFAULT '{}'::jsonb;
ALTER TABLE users ALTER COLUMN iam_profile SET NOT NULL;
ALTER TABLE users ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE users ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT NOW();
ALTER TABLE users ALTER COLUMN updated_at SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_role_check' AND conrelid = 'users'::regclass) THEN
        ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_profile_status_check' AND conrelid = 'users'::regclass) THEN
        ALTER TABLE users ADD CONSTRAINT users_profile_status_check CHECK (profile_status IN ('provisional', 'enriched', 'unmatched', 'conflict'));
    END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_user_id ON users (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_employee_id ON users (employee_id) WHERE employee_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_iam_subject ON users (iam_subject) WHERE iam_subject IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC, email DESC);
CREATE INDEX IF NOT EXISTS idx_users_updated_at ON users (updated_at DESC);

CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    event_type TEXT NOT NULL DEFAULT 'lab_completed',
    user_id UUID,
    technician_employee_id TEXT,
    technician_name TEXT,
    technician_email TEXT,
    email TEXT,
    user_email TEXT,
    action_title TEXT,
    title TEXT,
    lab_name TEXT,
    group_name TEXT,
    lab_url TEXT,
    device_name TEXT,
    device TEXT,
    severity TEXT DEFAULT 'LOW',
    level TEXT DEFAULT 'LOW',
    description TEXT,
    desc_text TEXT,
    client_ip TEXT,
    user_agent TEXT,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'lab_completed';
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS technician_employee_id TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS technician_name TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS technician_email TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS user_email TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS action_title TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS lab_name TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS group_name TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS lab_url TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS device_name TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS device TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS severity TEXT DEFAULT 'LOW';
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'LOW';
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS desc_text TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS client_ip TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'activity_logs' AND column_name = 'technician_employee_code'
    ) THEN
        UPDATE activity_logs
        SET technician_employee_id = technician_employee_code
        WHERE technician_employee_id IS NULL AND technician_employee_code IS NOT NULL;
    END IF;
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'activity_logs' AND column_name = 'ktv_email'
    ) THEN
        UPDATE activity_logs SET technician_email = ktv_email WHERE technician_email IS NULL AND ktv_email IS NOT NULL;
    END IF;
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'activity_logs' AND column_name = 'ktv_mnv'
    ) THEN
        UPDATE activity_logs
        SET technician_employee_id = ktv_mnv
        WHERE technician_employee_id IS NULL AND ktv_mnv IS NOT NULL;
    END IF;
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'activity_logs' AND column_name = 'ktv_name'
    ) THEN
        UPDATE activity_logs SET technician_name = ktv_name WHERE technician_name IS NULL AND ktv_name IS NOT NULL;
    END IF;
END $$;

UPDATE activity_logs SET created_at = NOW() WHERE created_at IS NULL;
UPDATE activity_logs SET event_type = 'lab_completed' WHERE event_type IS NULL;
UPDATE activity_logs SET payload = '{}'::jsonb WHERE payload IS NULL;
ALTER TABLE activity_logs ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE activity_logs ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE activity_logs ALTER COLUMN event_type SET DEFAULT 'lab_completed';
ALTER TABLE activity_logs ALTER COLUMN event_type SET NOT NULL;
ALTER TABLE activity_logs ALTER COLUMN payload SET DEFAULT '{}'::jsonb;
ALTER TABLE activity_logs ALTER COLUMN payload SET NOT NULL;

CREATE TABLE IF NOT EXISTS login_logs (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    event_type TEXT NOT NULL DEFAULT 'iam_callback_success',
    user_id UUID,
    employee_id TEXT,
    display_name TEXT,
    email TEXT,
    role TEXT,
    iam_subject TEXT,
    ip_address TEXT,
    user_agent TEXT,
    session_id_hash TEXT
);

ALTER TABLE login_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE login_logs ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'iam_callback_success';
ALTER TABLE login_logs ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE login_logs ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE login_logs ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE login_logs ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE login_logs ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE login_logs ADD COLUMN IF NOT EXISTS iam_subject TEXT;
ALTER TABLE login_logs ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE login_logs ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE login_logs ADD COLUMN IF NOT EXISTS session_id_hash TEXT;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'login_logs' AND column_name = 'employee_code'
    ) THEN
        UPDATE login_logs SET employee_id = employee_code WHERE employee_id IS NULL AND employee_code IS NOT NULL;
    END IF;
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'login_logs' AND column_name = 'mnv'
    ) THEN
        UPDATE login_logs SET employee_id = mnv WHERE employee_id IS NULL AND mnv IS NOT NULL;
    END IF;
END $$;

UPDATE login_logs SET created_at = NOW() WHERE created_at IS NULL;
UPDATE login_logs SET event_type = 'iam_callback_success' WHERE event_type IS NULL;
ALTER TABLE login_logs ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE login_logs ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE login_logs ALTER COLUMN event_type SET DEFAULT 'iam_callback_success';
ALTER TABLE login_logs ALTER COLUMN event_type SET NOT NULL;
