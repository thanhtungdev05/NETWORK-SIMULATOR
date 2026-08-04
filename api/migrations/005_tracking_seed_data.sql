-- Seed Regions
INSERT INTO regions (region_id, region_name) VALUES
    ('REG_1', 'Vùng 1'),
    ('REG_2', 'Vùng 2'),
    ('REG_3', 'Vùng 3'),
    ('REG_4', 'Vùng 4'),
    ('REG_5', 'Vùng 5'),
    ('REG_6', 'Vùng 6'),
    ('REG_7', 'Vùng 7')
ON CONFLICT (region_id) DO NOTHING;

-- Seed Technicians
INSERT INTO technicians (technician_id, email, full_name, region_id) VALUES
    ('TECH_01', 'nguyenvana@fpt.com', 'Nguyễn Văn A', 'REG_1'),
    ('TECH_02', 'tranthib@fpt.com', 'Trần Thị B', 'REG_1'),
    ('TECH_03', 'levanc@fpt.com', 'Lê Văn C', 'REG_2')
ON CONFLICT (technician_id) DO NOTHING;

-- Seed Devices
INSERT INTO devices (device_id, model, device_name) VALUES
    ('DEV_01', 'AC1000F', 'ONT AC1000F'),
    ('DEV_02', 'AC1000HI', 'ONT AC1000HI'),
    ('DEV_03', 'AX3000CV2', 'ONT AX3000CV2'),
    ('DEV_04', 'AX3000GZ', 'ONT AX3000GZ'),
    ('DEV_05', 'AX3000HV2', 'ONT AX3000HV2'),
    ('DEV_06', 'Vigor2927', 'DrayTek Vigor2927'),
    ('DEV_07', 'R_MIKROTIK', 'Router MikroTik')
ON CONFLICT (device_id) DO NOTHING;

-- Seed Labs
INSERT INTO labs (lab_id, device_id, lab_name) VALUES
    ('LAB_DEV_01_01', 'DEV_01', 'Bài 1-Cấu hình PPPoE'),
    ('LAB_DEV_01_02', 'DEV_01', 'Bài 2-Cấu hình WiFi'),
    ('LAB_DEV_01_03', 'DEV_01', 'Bài 3-Cấu hình IP LAN'),
    ('LAB_DEV_01_04', 'DEV_01', 'Bài 4-Cấu hình mở Port'),
    ('LAB_DEV_01_05', 'DEV_01', 'Bài 5-Cấu hình tên miền động DDNS'),
    ('LAB_DEV_02_01', 'DEV_02', 'Bài 1: Cấu hình DNS'),
    ('LAB_DEV_02_02', 'DEV_02', 'Bài 2: Cấu hình PPPoE'),
    ('LAB_DEV_02_03', 'DEV_02', 'Bài 3: WiFi và Bảo mật'),
    ('LAB_DEV_03_01', 'DEV_03', 'Bài 1-Cấu hình PPPoE'),
    ('LAB_DEV_03_02', 'DEV_03', 'Bài 2-Cấu hình WiFi'),
    ('LAB_DEV_03_03', 'DEV_03', 'Bài 3-Cấu hình đổi IP LAN'),
    ('LAB_DEV_04_01', 'DEV_04', 'Bài 1: Cấu hình ONT'),
    ('LAB_DEV_04_02', 'DEV_04', 'Bài 2: Cấu hình WiFi'),
    ('LAB_DEV_05_01', 'DEV_05', 'Bài 1: Cấu hình ONT'),
    ('LAB_DEV_05_02', 'DEV_05', 'Bài 2: Cấu hình WiFi'),
    ('LAB_DEV_06_01', 'DEV_06', 'Bài 1-Thay đổi lớp mạng LAN'),
    ('LAB_DEV_06_02', 'DEV_06', 'Bài 2-Hướng dẫn cấu hình PPPoE'),
    ('LAB_DEV_07_01', 'DEV_07', 'Bài 1: Cấu hình PPPoE Server'),
    ('LAB_DEV_07_02', 'DEV_07', 'Bài 2: Cấu hình LAN IP Address')
ON CONFLICT (lab_id) DO NOTHING;

-- Seed Initial Demo Sessions
INSERT INTO sessions (session_id, technician_id, lab_id, started_at, duration_sec, mode, status, completed_first_try, last_action) VALUES
    ('SES_001', 'TECH_01', 'LAB_DEV_01_01', '2026-07-01T08:15:00Z', 900, 'Thực hành', 'Hoàn thành', true, 'Bấm Apply thành công')
ON CONFLICT (session_id) DO NOTHING;
