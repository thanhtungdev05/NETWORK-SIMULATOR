-- 045_expand_multi_device_topology_catalog.sql
-- Thêm các bài thực hành Mô Hình Mạng Liên Kết Đa Thiết Bị (Topology Labs) cho MikroTik, AX3000GZ, BE6500C

INSERT INTO lab_catalog (
    lab_id,
    device_id,
    lab_name,
    sort_order,
    is_active
) VALUES
    ('LAB_TOPOLOGY_01', 'DEV_TOPOLOGY', 'Bài 1: ONT AC1000F Bridge Mode + Router DrayTek PPPoE', 1, TRUE),
    ('LAB_TOPOLOGY_02', 'DEV_TOPOLOGY', 'Bài 2: ONT AX3000GZ Bridge Mode + Router MikroTik PPPoE', 2, TRUE),
    ('LAB_TOPOLOGY_03', 'DEV_TOPOLOGY', 'Bài 3: Router DrayTek Vigor + AP Wi-Fi 7 BE6500C Mở Rộng Sóng', 3, TRUE)
ON CONFLICT (lab_id) DO UPDATE
SET device_id = EXCLUDED.device_id,
    lab_name = EXCLUDED.lab_name,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE,
    updated_at = NOW();
