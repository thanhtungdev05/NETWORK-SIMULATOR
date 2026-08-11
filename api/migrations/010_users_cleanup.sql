-- 010: users gon + reorder; dashboard chi admin.
-- - Bo cot employee_id, iam_subject khoi users (sau 009 khong con noi dung doc/gui).
--   Luu y: nguoi dung duoc khop bang EMAIL khi login (upsert).
-- - Rebuild lai bang theo thu tu cot gon:
--   user_id, email, display_name, role, last_login_at, iam_profile, created_at, updated_at.
--   (Postgres khong co "sap xep lai" cot => tao bang moi roi copy data.)

ALTER TABLE login_logs DROP CONSTRAINT IF EXISTS login_logs_user_id_fkey;

CREATE TABLE users_rebuild (
    user_id UUID NOT NULL DEFAULT gen_random_uuid(),
    email TEXT NOT NULL PRIMARY KEY,
    display_name TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    last_login_at TIMESTAMPTZ,
    iam_profile JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT users_rebuild_role_check CHECK (role IN ('user', 'admin'))
);

INSERT INTO users_rebuild (user_id, email, display_name, role, last_login_at, iam_profile, created_at, updated_at)
SELECT user_id, email, display_name, role, last_login_at, iam_profile, created_at, updated_at
FROM users;

DROP TABLE users;

ALTER TABLE users_rebuild RENAME TO users;
ALTER TABLE users RENAME CONSTRAINT users_rebuild_pkey TO users_pkey;
ALTER TABLE users RENAME CONSTRAINT users_rebuild_role_check TO users_role_check;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_user_id ON users (user_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC, email DESC);
CREATE INDEX IF NOT EXISTS idx_users_updated_at ON users (updated_at DESC);

ALTER TABLE login_logs
    ADD CONSTRAINT login_logs_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL NOT VALID;
ALTER TABLE login_logs VALIDATE CONSTRAINT login_logs_user_id_fkey;
