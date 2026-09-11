-- 038_custom_lab_definitions.sql
-- Hỗ trợ Giảng viên và Quản trị viên soạn thảo, lưu trữ và quản lý các bài thực hành mới trên các dòng thiết bị hiện có.

CREATE TABLE IF NOT EXISTS custom_lab_definitions (
    lab_id VARCHAR(50) PRIMARY KEY REFERENCES lab_catalog(lab_id) ON DELETE CASCADE,
    device_id VARCHAR(50) NOT NULL REFERENCES device_catalog(device_id),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
    practice_url TEXT NOT NULL,
    clear_fields JSONB DEFAULT '[]'::jsonb,
    grading_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_custom_labs_device ON custom_lab_definitions (device_id);
