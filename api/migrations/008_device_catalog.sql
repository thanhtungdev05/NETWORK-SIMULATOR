-- 008: Danh muc thiet bi + bai lab cho dashboard (ma tran tien do).
-- Migration 007 da drop bang devices/labs, nen tao lai dang catalog tinh
-- de ma tran "theo khu vuc" va "theo lop" luon hien du tat ca thiet bi/lab
-- (o chua co du lieu hien 0%).

CREATE TABLE IF NOT EXISTS device_catalog (
    device_id   VARCHAR(50) PRIMARY KEY,
    model       VARCHAR(100),
    device_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS lab_catalog (
    lab_id     VARCHAR(50) PRIMARY KEY,
    device_id  VARCHAR(50) NOT NULL REFERENCES device_catalog(device_id) ON DELETE CASCADE,
    lab_name   VARCHAR(150) NOT NULL,
    UNIQUE (device_id, lab_name)
);

INSERT INTO device_catalog (device_id, model, device_name) VALUES
    ('DEV_AC1000F',   'AC1000F',   'ONT AC1000F'),
    ('DEV_AX3000CV2', 'AX3000CV2', 'ONT AX3000CV2'),
    ('DEV_AX3000GZ',  'AX3000GZ',  'ONT AX3000GZ'),
    ('DEV_AX3000HV2', 'AX3000HV2', 'ONT AX3000HV2'),
    ('DEV_AX3000S',   'AX3000S',   'AX3000S'),
    ('DEV_BE12000',   'BE12000',   'ONT BE12000'),
    ('DEV_BE15000',   'BE15000',   'ONT BE15000')
ON CONFLICT (device_id) DO NOTHING;

INSERT INTO lab_catalog (lab_id, device_id, lab_name) VALUES
    -- ONT AC1000F
    ('LAB_AC1000F_01', 'DEV_AC1000F', 'Bài 1-Cấu hình PPPoE'),
    ('LAB_AC1000F_02', 'DEV_AC1000F', 'Bài 2-Cấu hình WiFi'),
    ('LAB_AC1000F_03', 'DEV_AC1000F', 'Bài 3-Cấu hình IP LAN'),
    ('LAB_AC1000F_04', 'DEV_AC1000F', 'Bài 4-Cấu hình mở Port'),
    ('LAB_AC1000F_05', 'DEV_AC1000F', 'Bài 5-Cấu hình tên miền động DDNS'),
    -- ONT AX3000CV2
    ('LAB_AX3000CV2_01', 'DEV_AX3000CV2', 'Bài 1-Cấu hình PPPoE'),
    ('LAB_AX3000CV2_02', 'DEV_AX3000CV2', 'Bài 2-Cấu hình WiFi'),
    ('LAB_AX3000CV2_03', 'DEV_AX3000CV2', 'Bài 3-Cấu hình đổi IP LAN'),
    -- ONT AX3000GZ
    ('LAB_AX3000GZ_01', 'DEV_AX3000GZ', 'Bài 1: Cấu hình ONT'),
    ('LAB_AX3000GZ_02', 'DEV_AX3000GZ', 'Bài 2: Cấu hình WiFi'),
    -- ONT AX3000HV2
    ('LAB_AX3000HV2_01', 'DEV_AX3000HV2', 'Bài 1: Cấu hình ONT'),
    ('LAB_AX3000HV2_02', 'DEV_AX3000HV2', 'Bài 2: Cấu hình WiFi'),
    -- AX3000S
    ('LAB_AX3000S_01', 'DEV_AX3000S', 'Bài 1-Cấu hình PPPoE'),
    ('LAB_AX3000S_02', 'DEV_AX3000S', 'Bài 2-Cấu hình WiFi'),
    ('LAB_AX3000S_03', 'DEV_AX3000S', 'Bài 3-Cấu hình IP LAN'),
    -- ONT BE12000
    ('LAB_BE12000_01', 'DEV_BE12000', 'Bài 1: Cấu hình ONT'),
    ('LAB_BE12000_02', 'DEV_BE12000', 'Bài 2: Cấu hình WiFi'),
    -- ONT BE15000
    ('LAB_BE15000_01', 'DEV_BE15000', 'Bài 1: Cấu hình ONT'),
    ('LAB_BE15000_02', 'DEV_BE15000', 'Bài 2: Cấu hình WiFi')
ON CONFLICT (lab_id) DO NOTHING;

-- Chuan hoa cac phien AX3000S cu sang lab_id cua danh muc
-- (truoc day lab_name = lab_id 'LAB_VIRTUAL_ONT_AX3000S' vi simulator gui thieu lab_name).
UPDATE timer_sessions
   SET lab_id   = 'LAB_AX3000S_01',
       lab_name = 'Bài 1-Cấu hình PPPoE'
 WHERE lab_id = 'LAB_VIRTUAL_ONT_AX3000S';
