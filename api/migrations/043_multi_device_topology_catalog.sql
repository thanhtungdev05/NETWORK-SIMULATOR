-- 043_multi_device_topology_catalog.sql
-- Thêm danh mục Mô hình Mạng Đa Thiết Bị Liên Kết và bài thực hành tổng hợp vào hệ thống

INSERT INTO device_catalog (
    device_id,
    model,
    device_name,
    sort_order,
    is_active
) VALUES
    ('DEV_TOPOLOGY', 'TOPOLOGY', 'Mạng Đa Thiết Bị (Topology)', 7, TRUE)
ON CONFLICT (device_id) DO UPDATE
SET model = EXCLUDED.model,
    device_name = EXCLUDED.device_name,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO lab_catalog (
    lab_id,
    device_id,
    lab_name,
    sort_order,
    is_active
) VALUES
    ('LAB_TOPOLOGY_01', 'DEV_TOPOLOGY', 'Bài 1: ONT Bridge Mode + Router DrayTek PPPoE', 1, TRUE)
ON CONFLICT (lab_id) DO UPDATE
SET device_id = EXCLUDED.device_id,
    lab_name = EXCLUDED.lab_name,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE,
    updated_at = NOW();
