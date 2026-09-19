-- Migration 044: Kich hoat hien thi DrayTek Vigor 2927, MikroTik hEX S va Mo hinh Da thiet bi (Topology)

-- 1. Kich hoat va cap nhat thu tu hien thi trong device_catalog
UPDATE device_catalog
   SET is_active = TRUE,
       device_name = 'DrayTek Vigor 2927',
       sort_order = 11,
       updated_at = NOW()
 WHERE device_id = 'DEV_VIGOR2927';

UPDATE device_catalog
   SET is_active = TRUE,
       device_name = 'Router MikroTik',
       sort_order = 12,
       updated_at = NOW()
 WHERE device_id = 'DEV_MIKROTIK_HEXS';

UPDATE device_catalog
   SET is_active = TRUE,
       device_name = '🔗 Mạng Đa Thiết Bị (Topology)',
       sort_order = 13,
       updated_at = NOW()
 WHERE device_id = 'DEV_TOPOLOGY';

-- 2. Kich hoat toan bo cac bai thuc hanh cua DrayTek Vigor 2927
UPDATE lab_catalog
   SET is_active = TRUE,
       updated_at = NOW()
 WHERE device_id = 'DEV_VIGOR2927'
   AND lab_id IN (
       'vg2927-bai1',
       'vg2927-bai2',
       'vg2927-bai3',
       'vg2927-bai4',
       'vg2927-bai5',
       'vg2927-bai6'
   );

-- 3. Kich hoat bai thuc hanh cua Router MikroTik hEX S
UPDATE lab_catalog
   SET is_active = TRUE,
       updated_at = NOW()
 WHERE device_id = 'DEV_MIKROTIK_HEXS'
   AND lab_id = 'mikrotik_hexs-bai1';

-- 4. Kich hoat bai thuc hanh cua Mang Da Thiet Bi (Topology)
UPDATE lab_catalog
   SET is_active = TRUE,
       updated_at = NOW()
 WHERE device_id = 'DEV_TOPOLOGY'
   AND lab_id = 'LAB_TOPOLOGY_01';