-- 030: Enforce the device team's approved public catalog after migration 029.
-- Historical sessions and retired catalog rows are preserved. Only six devices
-- and their six approved labs remain active for portal/dashboard use.

INSERT INTO device_catalog (
    device_id,
    model,
    device_name,
    sort_order,
    is_active
) VALUES
    ('DEV_AC1000F',   'AC1000F',   'ONT AC1000F',          1, TRUE),
    ('DEV_AX3000CV2', 'AX3000CV2', 'ONT AX3000CV2',        2, TRUE),
    ('DEV_AX3000GZ',  'AX3000GZ',  'ONT AX3000GZ',         3, TRUE),
    ('DEV_AX3000HV2', 'AX3000HV2', 'ONT AX3000HV2',        4, TRUE),
    ('DEV_AX3000S',   'AX3000S',   'Internet Hub AX3000S', 5, TRUE),
    ('DEV_AC1000HI',  'AC1000HI',  'ONT AC1000HI',         6, TRUE)
ON CONFLICT (device_id) DO UPDATE
SET model = EXCLUDED.model,
    device_name = EXCLUDED.device_name,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE,
    updated_at = NOW();

UPDATE device_catalog
   SET is_active = device_id IN (
           'DEV_AC1000F',
           'DEV_AX3000CV2',
           'DEV_AX3000GZ',
           'DEV_AX3000HV2',
           'DEV_AX3000S',
           'DEV_AC1000HI'
       ),
       updated_at = NOW()
 WHERE is_active IS DISTINCT FROM (device_id IN (
           'DEV_AC1000F',
           'DEV_AX3000CV2',
           'DEV_AX3000GZ',
           'DEV_AX3000HV2',
           'DEV_AX3000S',
           'DEV_AC1000HI'
       ));

-- Preserve rows for audit/history, but remove every old or unapproved lab from
-- the public catalog before reactivating the canonical 36 rows below.
UPDATE lab_catalog
   SET is_active = FALSE,
       updated_at = NOW()
 WHERE is_active = TRUE;

INSERT INTO lab_catalog (
    lab_id,
    device_id,
    lab_name,
    sort_order,
    is_active
) VALUES
    ('LAB_AC1000F_01', 'DEV_AC1000F', 'Bài 1 - Cấu hình PPPoE', 1, TRUE),
    ('LAB_AC1000F_02', 'DEV_AC1000F', 'Bài 2 - Cấu hình Wi-Fi', 2, TRUE),
    ('LAB_AC1000F_03', 'DEV_AC1000F', 'Bài 3 - Cấu hình Wi-Fi IoT', 3, TRUE),
    ('LAB_AC1000F_04', 'DEV_AC1000F', 'Bài 4 - Cấu hình DNS', 4, TRUE),
    ('LAB_AC1000F_05', 'DEV_AC1000F', 'Bài 5 - Cấu hình DHCP', 5, TRUE),
    ('LAB_AC1000F_06', 'DEV_AC1000F', 'Bài 6 - Cấu hình Port Forwarding', 6, TRUE),

    ('LAB_AX3000CV2_01', 'DEV_AX3000CV2', 'Bài 1 - Cấu hình PPPoE', 1, TRUE),
    ('LAB_AX3000CV2_02', 'DEV_AX3000CV2', 'Bài 2 - Cấu hình Wi-Fi', 2, TRUE),
    ('LAB_AX3000CV2_03', 'DEV_AX3000CV2', 'Bài 3 - Cấu hình Wi-Fi IoT', 3, TRUE),
    ('LAB_AX3000CV2_04', 'DEV_AX3000CV2', 'Bài 4 - Cấu hình DNS', 4, TRUE),
    ('LAB_AX3000CV2_05', 'DEV_AX3000CV2', 'Bài 5 - Cấu hình DHCP', 5, TRUE),
    ('LAB_AX3000CV2_06', 'DEV_AX3000CV2', 'Bài 6 - Cấu hình Port Forwarding', 6, TRUE),

    ('LAB_AX3000GZ_01', 'DEV_AX3000GZ', 'Bài 1 - Cấu hình PPPoE', 1, TRUE),
    ('LAB_AX3000GZ_02', 'DEV_AX3000GZ', 'Bài 2 - Cấu hình Wi-Fi', 2, TRUE),
    ('LAB_AX3000GZ_03', 'DEV_AX3000GZ', 'Bài 3 - Cấu hình Wi-Fi IoT', 3, TRUE),
    ('LAB_AX3000GZ_04', 'DEV_AX3000GZ', 'Bài 4 - Cấu hình DNS', 4, TRUE),
    ('LAB_AX3000GZ_05', 'DEV_AX3000GZ', 'Bài 5 - Cấu hình DHCP', 5, TRUE),
    ('LAB_AX3000GZ_06', 'DEV_AX3000GZ', 'Bài 6 - Cấu hình Port Forwarding', 6, TRUE),

    ('LAB_AX3000HV2_01', 'DEV_AX3000HV2', 'Bài 1 - Cấu hình PPPoE', 1, TRUE),
    ('LAB_AX3000HV2_02', 'DEV_AX3000HV2', 'Bài 2 - Cấu hình Wi-Fi', 2, TRUE),
    ('LAB_AX3000HV2_03', 'DEV_AX3000HV2', 'Bài 3 - Cấu hình Wi-Fi IoT', 3, TRUE),
    ('LAB_AX3000HV2_04', 'DEV_AX3000HV2', 'Bài 4 - Cấu hình DNS', 4, TRUE),
    ('LAB_AX3000HV2_05', 'DEV_AX3000HV2', 'Bài 5 - Cấu hình DHCP', 5, TRUE),
    ('LAB_AX3000HV2_06', 'DEV_AX3000HV2', 'Bài 6 - Cấu hình Port Forwarding', 6, TRUE),

    ('LAB_AX3000S_01', 'DEV_AX3000S', 'Bài 1 - Cấu hình PPPoE', 1, TRUE),
    ('LAB_AX3000S_02', 'DEV_AX3000S', 'Bài 2 - Cấu hình Wi-Fi', 2, TRUE),
    ('LAB_AX3000S_03', 'DEV_AX3000S', 'Bài 3 - Cấu hình Wi-Fi IoT', 3, TRUE),
    ('LAB_AX3000S_04', 'DEV_AX3000S', 'Bài 4 - Cấu hình DNS', 4, TRUE),
    ('LAB_AX3000S_05', 'DEV_AX3000S', 'Bài 5 - Cấu hình DHCP', 5, TRUE),
    ('LAB_AX3000S_06', 'DEV_AX3000S', 'Bài 6 - Cấu hình Port Forwarding', 6, TRUE),

    ('LAB_AC1000HI_01', 'DEV_AC1000HI', 'Bài 1 - Cấu hình PPPoE', 1, TRUE),
    ('LAB_AC1000HI_02', 'DEV_AC1000HI', 'Bài 2 - Cấu hình Wi-Fi', 2, TRUE),
    ('LAB_AC1000HI_03', 'DEV_AC1000HI', 'Bài 3 - Cấu hình Wi-Fi IoT', 3, TRUE),
    ('LAB_AC1000HI_04', 'DEV_AC1000HI', 'Bài 4 - Cấu hình DNS', 4, TRUE),
    ('LAB_AC1000HI_05', 'DEV_AC1000HI', 'Bài 5 - Cấu hình DHCP', 5, TRUE),
    ('LAB_AC1000HI_06', 'DEV_AC1000HI', 'Bài 6 - Cấu hình Port Forwarding', 6, TRUE)
ON CONFLICT (lab_id) DO UPDATE
SET device_id = EXCLUDED.device_id,
    lab_name = EXCLUDED.lab_name,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE,
    updated_at = NOW();

-- Migration 029 temporarily used LAB_AX3000C_*. Move session facts back to the
-- stable portal IDs. No session is deleted and timestamps/outcomes are untouched.
UPDATE timer_sessions
   SET lab_id = REPLACE(lab_id, 'LAB_AX3000C_', 'LAB_AX3000CV2_'),
       device_id = 'DEV_AX3000CV2',
       device = 'ONT AX3000CV2',
       lab_name = CASE RIGHT(lab_id, 2)
           WHEN '01' THEN 'Bài 1 - Cấu hình PPPoE'
           WHEN '02' THEN 'Bài 2 - Cấu hình Wi-Fi'
           WHEN '03' THEN 'Bài 3 - Cấu hình Wi-Fi IoT'
           WHEN '04' THEN 'Bài 4 - Cấu hình DNS'
           WHEN '05' THEN 'Bài 5 - Cấu hình DHCP'
           WHEN '06' THEN 'Bài 6 - Cấu hình Port Forwarding'
           ELSE lab_name
       END
 WHERE lab_id ~ '^LAB_AX3000C_[0-9]{2}$';

-- Canonical names in session facts make exports and audit queries consistent;
-- the catalog remains the authority used for dashboard display.
UPDATE timer_sessions session
   SET device_id = lab.device_id,
       device = device.device_name,
       lab_name = lab.lab_name
  FROM lab_catalog lab
  JOIN device_catalog device ON device.device_id = lab.device_id
 WHERE session.lab_id = lab.lab_id
   AND lab.is_active = TRUE
   AND device.is_active = TRUE
   AND (
       session.device_id IS DISTINCT FROM lab.device_id
       OR session.device IS DISTINCT FROM device.device_name
       OR session.lab_name IS DISTINCT FROM lab.lab_name
   );

-- Optional normalized curriculum tables exist in some deployments. Keep them in
-- sync when present without making the migration depend on that optional model.
DO $migration$
BEGIN
    IF to_regclass('public.curriculum_labs') IS NOT NULL THEN
        EXECUTE $sql$
            UPDATE curriculum_labs curriculum_lab
               SET is_required = FALSE,
                   updated_at = NOW()
              FROM lab_catalog lab
             WHERE lab.lab_id = curriculum_lab.lab_id
               AND lab.is_active = FALSE
        $sql$;
    END IF;

    IF to_regclass('public.curricula') IS NOT NULL
       AND to_regclass('public.curriculum_labs') IS NOT NULL THEN
        EXECUTE $sql$
            INSERT INTO curriculum_labs (
                curriculum_id,
                lab_id,
                required_mode,
                is_required,
                sort_order,
                passing_score
            )
            SELECT curriculum.curriculum_id,
                   lab.lab_id,
                   'practice',
                   TRUE,
                   (device.sort_order * 100) + lab.sort_order,
                   80.00
              FROM curricula curriculum
             CROSS JOIN lab_catalog lab
              JOIN device_catalog device ON device.device_id = lab.device_id
             WHERE curriculum.curriculum_code = 'LEGACY-PORTAL-LABS'
               AND curriculum.version = '1'
               AND lab.is_active = TRUE
               AND device.is_active = TRUE
            ON CONFLICT (curriculum_id, lab_id, required_mode) DO UPDATE
            SET is_required = TRUE,
                sort_order = EXCLUDED.sort_order,
                passing_score = EXCLUDED.passing_score,
                updated_at = NOW()
        $sql$;
    END IF;
END
$migration$;
