-- 1. Bảng regions
CREATE TABLE IF NOT EXISTS regions (
    region_id VARCHAR(50) PRIMARY KEY,
    region_name VARCHAR(100) NOT NULL
);

-- 2. Bảng technicians
CREATE TABLE IF NOT EXISTS technicians (
    technician_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    region_id VARCHAR(50) NOT NULL,
    CONSTRAINT fk_tech_region FOREIGN KEY (region_id) REFERENCES regions(region_id) ON DELETE CASCADE
);

-- 3. Bảng devices
CREATE TABLE IF NOT EXISTS devices (
    device_id VARCHAR(50) PRIMARY KEY,
    model VARCHAR(50) NOT NULL,
    device_name VARCHAR(100) NOT NULL
);

-- 4. Bảng labs
CREATE TABLE IF NOT EXISTS labs (
    lab_id VARCHAR(50) PRIMARY KEY,
    device_id VARCHAR(50) NOT NULL,
    lab_name VARCHAR(150) NOT NULL,
    CONSTRAINT fk_lab_device FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE
);

-- 5. Bảng sessions
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(50) PRIMARY KEY,
    technician_id VARCHAR(50) NOT NULL,
    lab_id VARCHAR(50) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    duration_sec INT DEFAULT 0,
    mode VARCHAR(30) NOT NULL CHECK (mode IN ('Thực hành', 'Hướng dẫn')),
    status VARCHAR(30) NOT NULL DEFAULT 'Đang làm' CHECK (status IN ('Hoàn thành', 'Đang làm', 'Chưa thực hiện')),
    completed_first_try BOOLEAN DEFAULT TRUE,
    last_action TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_session_tech FOREIGN KEY (technician_id) REFERENCES technicians(technician_id) ON DELETE CASCADE,
    CONSTRAINT fk_session_lab FOREIGN KEY (lab_id) REFERENCES labs(lab_id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_tech ON sessions (technician_id);
CREATE INDEX IF NOT EXISTS idx_sessions_lab ON sessions (lab_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions (status);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions (started_at DESC);
CREATE INDEX IF NOT EXISTS idx_technicians_region ON technicians (region_id);
CREATE INDEX IF NOT EXISTS idx_labs_device ON labs (device_id);
