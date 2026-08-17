-- 017: Bo sung cac truong luu ket qua cham diem vao bang timer_sessions
ALTER TABLE timer_sessions
ADD COLUMN IF NOT EXISTS is_passed BOOLEAN DEFAULT NULL,
ADD COLUMN IF NOT EXISTS score NUMERIC(5, 2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS grading_details JSONB DEFAULT NULL;
