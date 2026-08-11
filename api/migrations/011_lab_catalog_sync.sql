-- 011: Dong bo lab_catalog voi danh sach bai lab tren portal (devices/*/data.js).
-- Rename cac lab dang lech ten cho khop portal + seed cac bai con thieu.
-- Muc tieu: moi thiet bi co dung so bai nhu tren portal.
--   AC1000F: 10 | AX3000CV2: 5 | AX3000GZ: 9 | AX3000HV2: 6
--   AX3000S: 7  | BE12000: 7   | BE15000: 10  (tong 54 lab)

-- 1) Rename cac lab da co cho khop ten voi portal
UPDATE lab_catalog SET lab_name = 'Bài 1: Cấu hình PPPoE'        WHERE lab_id = 'LAB_AC1000F_01';
UPDATE lab_catalog SET lab_name = 'Bài 2: Cấu hình mạng Wi-Fi'   WHERE lab_id = 'LAB_AC1000F_02';
UPDATE lab_catalog SET lab_name = 'Bài 3: CẤU HÌNH IP LAN'        WHERE lab_id = 'LAB_AC1000F_03';
UPDATE lab_catalog SET lab_name = 'Bài 4: Cấu hình Mở Port'       WHERE lab_id = 'LAB_AC1000F_04';
UPDATE lab_catalog SET lab_name = 'Bài 5: Cấu hình DNS'           WHERE lab_id = 'LAB_AC1000F_05';

UPDATE lab_catalog SET lab_name = 'Bài 1: Cấu hình PPPoE'         WHERE lab_id = 'LAB_AX3000HV2_01';
UPDATE lab_catalog SET lab_name = 'Bài 2: Cấu hình Wi-Fi Host'    WHERE lab_id = 'LAB_AX3000HV2_02';

UPDATE lab_catalog SET lab_name = 'Bài 2-Cấu hình WIFI'           WHERE lab_id = 'LAB_AX3000S_02';
UPDATE lab_catalog SET lab_name = 'Bài 3-Cấu hình WIFI IOT'       WHERE lab_id = 'LAB_AX3000S_03';

UPDATE lab_catalog SET lab_name = 'Bài 1 - Quản lý LAN IPv4'      WHERE lab_id = 'LAB_BE12000_01';
UPDATE lab_catalog SET lab_name = 'Bài 2 - Cấu hình Wi-Fi MLO (Wi-Fi 7)' WHERE lab_id = 'LAB_BE12000_02';

UPDATE lab_catalog SET lab_name = 'Bài 1 - Quản lý LAN IPv4'      WHERE lab_id = 'LAB_BE15000_01';
UPDATE lab_catalog SET lab_name = 'Bài 2 - Trạng thái mạng cục bộ' WHERE lab_id = 'LAB_BE15000_02';

-- 2) Seed cac bai con thieu
INSERT INTO lab_catalog (lab_id, device_id, lab_name) VALUES
    -- ONT AC1000F (6..10)
    ('LAB_AC1000F_06', 'DEV_AC1000F', 'Bài 6: Cấu hình Remote Web'),
    ('LAB_AC1000F_07', 'DEV_AC1000F', 'Bài 7: Cấu hình Backup/Restore'),
    ('LAB_AC1000F_08', 'DEV_AC1000F', 'Bài 8: Cấu hình WiFi Timer'),
    ('LAB_AC1000F_09', 'DEV_AC1000F', 'Bài 9: Cấu hình Reboot Timer'),
    ('LAB_AC1000F_10', 'DEV_AC1000F', 'Bài 10: Cấu hình chặn Web'),
    -- ONT AX3000CV2 (4..5)
    ('LAB_AX3000CV2_04', 'DEV_AX3000CV2', 'Bài 4-Cấu hình DNS'),
    ('LAB_AX3000CV2_05', 'DEV_AX3000CV2', 'Bài 5-Cấu hình NAT Port'),
    -- ONT AX3000GZ (3..9)
    ('LAB_AX3000GZ_03', 'DEV_AX3000GZ', 'Bài 3: Tính năng BandSteering'),
    ('LAB_AX3000GZ_04', 'DEV_AX3000GZ', 'Bài 4: Cấu hình Mesh WiFi'),
    ('LAB_AX3000GZ_05', 'DEV_AX3000GZ', 'Bài 5: Cấu hình IGMP'),
    ('LAB_AX3000GZ_06', 'DEV_AX3000GZ', 'Bài 6: Cấu hình DDNS'),
    ('LAB_AX3000GZ_07', 'DEV_AX3000GZ', 'Bài 7: Cấu hình SNTP'),
    ('LAB_AX3000GZ_08', 'DEV_AX3000GZ', 'Bài 8: Cấu hình Port Forwarding'),
    ('LAB_AX3000GZ_09', 'DEV_AX3000GZ', 'Bài 9: Cấu hình Chặn MAC'),
    -- ONT AX3000HV2 (3..6)
    ('LAB_AX3000HV2_03', 'DEV_AX3000HV2', 'Bài 3: Cấu hình Wi-Fi Guest'),
    ('LAB_AX3000HV2_04', 'DEV_AX3000HV2', 'Bài 4: Cấu hình Wi-Fi IoT'),
    ('LAB_AX3000HV2_05', 'DEV_AX3000HV2', 'Bài 5: Cấu hình LAN Based'),
    ('LAB_AX3000HV2_06', 'DEV_AX3000HV2', 'Bài 6: Cấu hình DHCP Reservation'),
    -- AX3000S (4..7)
    ('LAB_AX3000S_04', 'DEV_AX3000S', 'Bài 4-Cấu hình DNS'),
    ('LAB_AX3000S_05', 'DEV_AX3000S', 'Bài 5-Cấu hình địa chỉ IP LAN'),
    ('LAB_AX3000S_06', 'DEV_AX3000S', 'Bài 6-Cấu hình Port Forwarding'),
    ('LAB_AX3000S_07', 'DEV_AX3000S', 'Bài 7-Cấu hình Mesh wifi'),
    -- ONT BE12000 (3..7)
    ('LAB_BE12000_03', 'DEV_BE12000', 'Bài 3 - Trạng thái WAN Ethernet'),
    ('LAB_BE12000_04', 'DEV_BE12000', 'Bài 4 - Chẩn đoán mạng (Network Diag)'),
    ('LAB_BE12000_05', 'DEV_BE12000', 'Bài 5 - Quản lý Tài Khoản & Mật Khẩu'),
    ('LAB_BE12000_06', 'DEV_BE12000', 'Bài 6 - Cấu hình SNTP Đồng Bộ Thời Gian'),
    ('LAB_BE12000_07', 'DEV_BE12000', 'Bài 7 - Khởi Động Lại & Khôi Phục Cài Đặt Gốc'),
    -- ONT BE15000 (3..10)
    ('LAB_BE15000_03', 'DEV_BE15000', 'Bài 3 - Chẩn đoán mạng'),
    ('LAB_BE15000_04', 'DEV_BE15000', 'Bài 4 - Quản lý tài khoản'),
    ('LAB_BE15000_05', 'DEV_BE15000', 'Bài 5 - Bảng ARP'),
    ('LAB_BE15000_06', 'DEV_BE15000', 'Bài 6 - Bảng MAC'),
    ('LAB_BE15000_07', 'DEV_BE15000', 'Bài 7 - Nâng cấp Firmware'),
    ('LAB_BE15000_08', 'DEV_BE15000', 'Bài 8 - Quản lý Log'),
    ('LAB_BE15000_09', 'DEV_BE15000', 'Bài 9 - Khởi động lại & Reset'),
    ('LAB_BE15000_10', 'DEV_BE15000', 'Bài 10 - Cấu hình SNTP')
ON CONFLICT (lab_id) DO NOTHING;

-- 3) Chuan hoa phien AX3000S con dung lab_id cu (LAB_VIRTUAL_ONT_AX3000S)
-- sang lab_id chuan cua danh muc (session sinh ra sau migration 008).
UPDATE timer_sessions
   SET lab_id   = 'LAB_AX3000S_01',
       lab_name = 'Bài 1-Cấu hình PPPoE'
 WHERE lab_id = 'LAB_VIRTUAL_ONT_AX3000S';
