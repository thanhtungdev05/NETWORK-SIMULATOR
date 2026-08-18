-- 018: Toi uu hoa schema, don dep bang/cot thua, bo sung Vigor2927 va telemetry audit
--
-- 1. Drops:
--    - class_lab_assignments (bang trung gian thua, he thong giao truc tiep cho KTV qua lab_assignments)
--    - lab_assignments.class_lab_assignment_id
--    - users.branch_code (da gop vao regions.branch_name o migration 016)
--    - device_catalog, lab_catalog, regions, curricula: catalog_version, effective_from, effective_to
--    - curriculum_labs: available_offset_days, due_offset_days, max_attempts
--
-- 2. Adds:
--    - timer_sessions: client_ip, user_agent, device_id FK, session_type
--    - lab_grading_criteria: bang cau hinh tieu chi cham diem dong cho cac bai lab
--    - Seed bo sung DEV_VIGOR2927 va cac bai lab tuong ung
--    - Indexes: idx_users_region_id, idx_timer_sessions_lab_finished, idx_timer_sessions_user_lab

-- ================================================================
-- Phase 1: Xoa rang buoc va drop bang trung gian class_lab_assignments
-- ================================================================
ALTER TABLE lab_assignments
    DROP CONSTRAINT IF EXISTS lab_assignments_class_lab_fkey,
    DROP CONSTRAINT IF EXISTS lab_assignments_class_lab_context_fkey,
    DROP COLUMN IF EXISTS class_lab_assignment_id;

DROP TABLE IF EXISTS class_lab_assignments;

-- ================================================================
-- Phase 2: Don dep cac cot thua / khong con su dung
-- ================================================================
ALTER TABLE users
    DROP COLUMN IF EXISTS branch_code;

ALTER TABLE device_catalog
    DROP COLUMN IF EXISTS catalog_version,
    DROP COLUMN IF EXISTS effective_from,
    DROP COLUMN IF EXISTS effective_to;

ALTER TABLE lab_catalog
    DROP COLUMN IF EXISTS catalog_version,
    DROP COLUMN IF EXISTS effective_from,
    DROP COLUMN IF EXISTS effective_to;

ALTER TABLE regions
    DROP COLUMN IF EXISTS effective_from,
    DROP COLUMN IF EXISTS effective_to;

ALTER TABLE curricula
    DROP COLUMN IF EXISTS effective_from,
    DROP COLUMN IF EXISTS effective_to;

ALTER TABLE curriculum_labs
    DROP COLUMN IF EXISTS available_offset_days,
    DROP COLUMN IF EXISTS due_offset_days,
    DROP COLUMN IF EXISTS max_attempts;

-- ================================================================
-- Phase 3: Bo sung cac truong Telemetry Audit vao timer_sessions
-- ================================================================
ALTER TABLE timer_sessions
    ADD COLUMN IF NOT EXISTS client_ip VARCHAR(50),
    ADD COLUMN IF NOT EXISTS user_agent TEXT,
    ADD COLUMN IF NOT EXISTS device_id VARCHAR(50),
    ADD COLUMN IF NOT EXISTS session_type VARCHAR(30) DEFAULT 'practice';

-- Rang buoc khoa ngoai device_id -> device_catalog (neu chua co)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'timer_sessions_device_id_fkey'
          AND conrelid = 'timer_sessions'::regclass
    ) THEN
        ALTER TABLE timer_sessions
            ADD CONSTRAINT timer_sessions_device_id_fkey
            FOREIGN KEY (device_id) REFERENCES device_catalog(device_id) ON DELETE SET NULL NOT VALID;
    END IF;
END $$;

-- Backfill device_id cho cac ban ghi cu dua theo lab_id
UPDATE timer_sessions ts
   SET device_id = lc.device_id
  FROM lab_catalog lc
 WHERE ts.lab_id = lc.lab_id
   AND ts.device_id IS NULL;

-- ================================================================
-- Phase 4: Tao bang tieu chi cham diem dong cho bai lab (lab_grading_criteria)
-- ================================================================
CREATE TABLE IF NOT EXISTS lab_grading_criteria (
    criterion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_id VARCHAR(50) NOT NULL REFERENCES lab_catalog(lab_id) ON DELETE CASCADE,
    step_code VARCHAR(50) NOT NULL,
    step_name TEXT NOT NULL,
    weight_score NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    is_mandatory BOOLEAN NOT NULL DEFAULT FALSE,
    expected_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT lab_grading_criteria_unique UNIQUE (lab_id, step_code)
);

CREATE INDEX IF NOT EXISTS idx_lab_grading_criteria_lab
    ON lab_grading_criteria (lab_id, is_active, sort_order);

-- ================================================================
-- Phase 5: Seed bo sung thiet bi Vigor2927 va cac bai lab con thieu
-- ================================================================
INSERT INTO device_catalog (device_id, model, device_name, sort_order, is_active)
VALUES ('DEV_VIGOR2927', 'Vigor2927', 'DrayTek Vigor2927', 8, TRUE)
ON CONFLICT (device_id) DO UPDATE
SET model = EXCLUDED.model,
    device_name = EXCLUDED.device_name,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

INSERT INTO lab_catalog (lab_id, device_id, lab_name, sort_order, is_active) VALUES
    ('LAB_VIGOR2927_01', 'DEV_VIGOR2927', 'Bài 1: Cấu hình WAN PPPoE & Load Balancing', 1, TRUE),
    ('LAB_VIGOR2927_02', 'DEV_VIGOR2927', 'Bài 2: Cấu hình VLAN & Multi-Subnet', 2, TRUE),
    ('LAB_VIGOR2927_03', 'DEV_VIGOR2927', 'Bài 3: Cấu hình VPN IPsec / SSL', 3, TRUE),
    ('LAB_VIGOR2927_04', 'DEV_VIGOR2927', 'Bài 4: Cấu hình Firewall & Filter Rules', 4, TRUE),
    ('LAB_VIGOR2927_05', 'DEV_VIGOR2927', 'Bài 5: Cấu hình Bandwidth Management (QoS)', 5, TRUE)
ON CONFLICT (lab_id) DO UPDATE
SET lab_name = EXCLUDED.lab_name,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Gan cac bai lab Vigor2927 vao chuong trinh mac dinh (neu co)
INSERT INTO curriculum_labs (
    curriculum_id,
    lab_id,
    required_mode,
    is_required,
    sort_order,
    passing_score
)
SELECT curriculum.curriculum_id,
       lab.lab_id,
       'practice',
       TRUE,
       lab.sort_order,
       80.00
  FROM curricula curriculum
 CROSS JOIN lab_catalog lab
 WHERE curriculum.curriculum_code = 'LEGACY-PORTAL-LABS'
   AND lab.device_id = 'DEV_VIGOR2927'
   AND lab.is_active = TRUE
ON CONFLICT (curriculum_id, lab_id, required_mode) DO NOTHING;

-- ================================================================
-- Phase 6: Danh cac Index toi uu hoa toc do truy van Dashboard
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_users_region_id
    ON users (region_id)
    WHERE region_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_timer_sessions_lab_finished
    ON timer_sessions (lab_id, finished_at DESC);

CREATE INDEX IF NOT EXISTS idx_timer_sessions_user_lab
    ON timer_sessions (user_id, lab_id, is_passed);

CREATE INDEX IF NOT EXISTS idx_timer_sessions_device_id
    ON timer_sessions (device_id)
    WHERE device_id IS NOT NULL;
