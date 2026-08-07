-- 007: Gộp tracking timer vào 1 bảng duy nhất.
-- Bỏ các bảng tracking cũ (theo yêu cầu: không quản lý đúng/sai thiết bị - bài lab,
-- không lưu trạng thái mặc định 'Hoàn thành', không có số lần lỗi ở timer).

DROP TABLE IF EXISTS training_results;
DROP TABLE IF EXISTS training_events;
DROP TABLE IF EXISTS training_attempts;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS labs;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS technicians;
DROP TABLE IF EXISTS regions;

CREATE TABLE IF NOT EXISTS timer_sessions (
    id BIGSERIAL PRIMARY KEY,
    technician_id VARCHAR(50),
    name VARCHAR(100),
    email VARCHAR(100),
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    duration_sec INT,
    mode VARCHAR(30),
    device VARCHAR(100),
    lab_id VARCHAR(50),
    lab_name VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
