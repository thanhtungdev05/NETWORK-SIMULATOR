CREATE INDEX IF NOT EXISTS idx_activity_logs_id_desc ON activity_logs (id DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_user ON activity_logs (created_at DESC, user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_employee_created ON activity_logs (technician_employee_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_device_created ON activity_logs (device, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_event_created ON activity_logs (event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_login_logs_id_desc ON login_logs (id DESC);
CREATE INDEX IF NOT EXISTS idx_login_logs_created_user ON login_logs (created_at DESC, user_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_employee_created ON login_logs (employee_id, created_at DESC);
