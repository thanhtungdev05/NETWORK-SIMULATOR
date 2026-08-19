-- 014_update_old_sessions_ax3000gz.sql
-- Update legacy ax3000gz lab IDs to standardized LAB_AX3000GZ_XX format

UPDATE timer_sessions
SET lab_id = 'LAB_AX3000GZ_' || LPAD(SUBSTRING(lab_id FROM 'ax3gz-bai([0-9]+)'), 2, '0')
WHERE lab_id LIKE 'ax3gz-bai%';
