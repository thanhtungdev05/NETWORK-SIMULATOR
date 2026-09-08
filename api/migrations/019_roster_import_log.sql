-- 019: Lưu lịch sử các lần import danh sách KTV từ dashboard.

CREATE TABLE IF NOT EXISTS roster_import_log (
    id BIGSERIAL PRIMARY KEY,
    batch_id VARCHAR(100) NOT NULL UNIQUE,
    imported_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    file_name TEXT,
    total_rows INT NOT NULL DEFAULT 0,
    inserted INT NOT NULL DEFAULT 0,
    updated INT NOT NULL DEFAULT 0,
    terminated INT NOT NULL DEFAULT 0,
    reactivated INT NOT NULL DEFAULT 0,
    error_count INT NOT NULL DEFAULT 0,
    error_details JSONB NOT NULL DEFAULT '[]'::jsonb,
    imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_roster_import_log_imported_at
    ON roster_import_log (imported_at DESC);

CREATE INDEX IF NOT EXISTS idx_roster_import_log_imported_by
    ON roster_import_log (imported_by)
    WHERE imported_by IS NOT NULL;
