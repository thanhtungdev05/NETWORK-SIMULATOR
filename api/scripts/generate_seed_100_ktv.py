# -*- coding: utf-8 -*-
"""
api/scripts/generate_seed_100_ktv.py
Script to generate ~100 realistic KTV accounts, 3 training classes, lab assignments,
and ~300 practice timer_sessions with rich grading_details for the UTH NetLab Dashboard & AI Chatbot.
"""

import sys
import json
import random
import uuid
import datetime
import psycopg2

sys.stdout.reconfigure(encoding='utf-8')

# Database connection
DB_URL = 'postgresql://postgres:@127.0.0.1:5432/ftc_local?sslmode=disable'

conn = psycopg2.connect(DB_URL)
conn.autocommit = True
cur = conn.cursor()

print("Connected to PostgreSQL database ftc_local.")

# 1. Ensure all lab_catalog items are in curriculum_labs
CURRICULUM_ID = '305a616e-ff8c-45be-aa30-61c238e760ec'

cur.execute("""
    INSERT INTO curriculum_labs (curriculum_lab_id, curriculum_id, lab_id, sort_order, is_required)
    SELECT gen_random_uuid(), %s, l.lab_id, 1, true
    FROM lab_catalog l
    WHERE NOT EXISTS (
        SELECT 1 FROM curriculum_labs cl 
        WHERE cl.curriculum_id = %s AND cl.lab_id = l.lab_id
    )
""", (CURRICULUM_ID, CURRICULUM_ID))
print("Synchronized curriculum_labs for all catalog labs.")

# 2. Setup 3 Training Classes
CLASSES = [
    {
        'class_id': 'c1111111-1111-4111-a111-111111111111',
        'class_code': 'CNTT-K22',
        'class_name': 'Lớp Chuyên ngành Mạng & An toàn thông tin K22',
        'region_name': 'TP. Hồ Chí Minh',
        'region_id': 'e78d948d-a528-41c6-85a2-1703834c36ee', # PNCHCM
        'capacity': 40
    },
    {
        'class_id': 'c2222222-2222-4222-a222-222222222222',
        'class_code': 'VT-K22',
        'class_name': 'Lớp Kỹ thuật Mạng Viễn Thông FPT K22',
        'region_name': 'Hà Nội',
        'region_id': '478056f3-8c87-420e-bb0c-a8eb4fffecab', # TINHNI
        'capacity': 40
    },
    {
        'class_id': 'c3333333-3333-4333-a333-333333333333',
        'class_code': 'KTV-PRO2026',
        'class_name': 'Lớp Đào tạo Kỹ thuật viên Thực địa 2026',
        'region_name': 'Đông Nam Bộ',
        'region_id': '8545c361-03e0-4b51-b3a7-75d408ea1c27', # PNCDNB
        'capacity': 35
    }
]

for c in CLASSES:
    cur.execute("""
        INSERT INTO training_classes (
            class_id, class_code, class_name, region_name, region_id,
            curriculum_id, start_date, capacity, status, is_mock, created_at, updated_at
        ) VALUES (
            %s, %s, %s, %s, %s,
            %s, '2026-08-01', %s, 'active', false, NOW(), NOW()
        ) ON CONFLICT (class_id) DO UPDATE SET
            class_code = EXCLUDED.class_code,
            class_name = EXCLUDED.class_name,
            region_name = EXCLUDED.region_name,
            region_id = EXCLUDED.region_id,
            capacity = EXCLUDED.capacity,
            status = 'active',
            is_mock = false,
            updated_at = NOW()
    """, (
        c['class_id'], c['class_code'], c['class_name'], c['region_name'], c['region_id'],
        CURRICULUM_ID, c['capacity']
    ))
print("Ensured 3 active training classes exist.")

# 3. Define 100 KTVs with authentic Vietnamese names
# bcrypt hash for 'Hocvien@123'
PASSWORD_HASH = '$2y$12$MnkcWROPGTuONdExrkvfUu8L9KJWD6fYXUCIatryvPw2wWXOSjbai'

STUDENT_DEFINITIONS = [
    # Top Stars & Key query subjects
    ('tungdt5101@ut.edu.vn', 'Tùng Đặng Thanh', 'KTV2026001', 'CNTT-K22', 'e78d948d-a528-41c6-85a2-1703834c36ee', 'HCM'),
    ('sangnp3251@ut.edu.vn', 'Nguyễn Phương Sang', 'KTV2026002', 'CNTT-K22', 'e78d948d-a528-41c6-85a2-1703834c36ee', 'HCM'),
    ('lehoangc@uth.edu.vn', 'Lê Hoàng C', 'KTV2026003', 'CNTT-K22', 'e78d948d-a528-41c6-85a2-1703834c36ee', 'HCM'),
    ('hocvien01@grad.edu.vn', 'Nguyễn Văn A', 'KTV2026004', 'CNTT-K22', 'e78d948d-a528-41c6-85a2-1703834c36ee', 'HCM'),
    ('tranthib@uth.edu.vn', 'Trần Thị B', 'KTV2026005', 'CNTT-K22', 'e78d948d-a528-41c6-85a2-1703834c36ee', 'HCM'),
    ('phamminhd@uth.edu.vn', 'Phạm Minh D', 'KTV2026006', 'CNTT-K22', 'e78d948d-a528-41c6-85a2-1703834c36ee', 'HCM'),
    ('vuhaye@uth.edu.vn', 'Vũ Hải E', 'KTV2026007', 'CNTT-K22', 'e78d948d-a528-41c6-85a2-1703834c36ee', 'HCM'),
    ('anbcd@uth.edu.vn', 'Anbcd', 'KTV2026008', 'CNTT-K22', 'e78d948d-a528-41c6-85a2-1703834c36ee', 'HCM'),
]

# Additional realistic Vietnamese names
HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đoàn', 'Mai']
LOT_NAM = ['Văn', 'Hữu', 'Minh', 'Quốc', 'Thanh', 'Đức', 'Hoàng', 'Quang', 'Trọng', 'Gia', 'Tuấn', 'Duy', 'Phúc', 'Tấn', 'Bảo']
LOT_NU = ['Thị', 'Thu', 'Ngọc', 'Kim', 'Khánh', 'Phương', 'Yến', 'Bảo', 'Thùy', 'Hải']
TEN_NAM = ['Hùng', 'Dũng', 'Thắng', 'Long', 'Trí', 'Bảo', 'Sơn', 'Khải', 'Huy', 'Kiệt', 'Khang', 'Thịnh', 'Phát', 'Nam', 'Tú', 'Lâm', 'Toàn', 'Hiếu', 'Khoa', 'Nhân']
TEN_NU = ['Mai', 'Hà', 'Lan', 'Châu', 'Linh', 'Nhi', 'Ngân', 'Vy', 'Thảo', 'Trang', 'Hương', 'Anh', 'Trâm', 'My', 'Chi', 'Tuyết', 'Nhung', 'Ngọc']

random.seed(2026)

used_names = set(s[1] for s in STUDENT_DEFINITIONS)
used_emails = set(s[0] for s in STUDENT_DEFINITIONS)

counter = 9
while len(STUDENT_DEFINITIONS) < 100:
    is_female = random.random() < 0.25
    h = random.choice(HO)
    if is_female:
        lot = random.choice(LOT_NU)
        ten = random.choice(TEN_NU)
    else:
        lot = random.choice(LOT_NAM)
        ten = random.choice(TEN_NAM)
    full_name = f"{h} {lot} {ten}"
    if full_name in used_names:
        continue
    used_names.add(full_name)
    
    # Class assignment: 1-35 CNTT-K22, 36-70 VT-K22, 71-100 KTV-PRO2026
    if len(STUDENT_DEFINITIONS) < 35:
        class_code = 'CNTT-K22'
        reg_id = 'e78d948d-a528-41c6-85a2-1703834c36ee'
        reg_code = 'HCM'
    elif len(STUDENT_DEFINITIONS) < 70:
        class_code = 'VT-K22'
        reg_id = '478056f3-8c87-420e-bb0c-a8eb4fffecab'
        reg_code = 'HNI'
    else:
        class_code = 'KTV-PRO2026'
        reg_id = '8545c361-03e0-4b51-b3a7-75d408ea1c27'
        reg_code = 'DNB'

    emp_id = f"KTV2026{counter:03d}"
    email = f"ktv{counter:03d}@uth.edu.vn"
    STUDENT_DEFINITIONS.append((email, full_name, emp_id, class_code, reg_id, reg_code))
    counter += 1

print(f"Generated {len(STUDENT_DEFINITIONS)} KTV profiles.")

# Insert/Update users in database
created_users = []
for email, name, emp_id, class_code, reg_id, reg_code in STUDENT_DEFINITIONS:
    cur.execute("""
        INSERT INTO users (
            user_id, email, display_name, role, employee_id, password_hash,
            class_code, region_id, dashboard_region, region_code,
            is_terminated, iam_profile, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), %s, %s, 'KTV', %s, %s,
            %s, %s, %s, %s,
            false, '{}', NOW() - INTERVAL '30 days', NOW()
        ) ON CONFLICT (email) DO UPDATE SET
            display_name = EXCLUDED.display_name,
            employee_id = EXCLUDED.employee_id,
            password_hash = EXCLUDED.password_hash,
            class_code = EXCLUDED.class_code,
            region_id = EXCLUDED.region_id,
            dashboard_region = EXCLUDED.dashboard_region,
            region_code = EXCLUDED.region_code,
            role = 'KTV',
            is_terminated = false,
            updated_at = NOW()
        RETURNING user_id, email, display_name, employee_id, class_code, region_id
    """, (email, name, emp_id, PASSWORD_HASH, class_code, reg_id, reg_code, reg_code))
    user_row = cur.fetchone()
    created_users.append(user_row)

print(f"Upserted {len(created_users)} users in database.")

# 4. Enroll each user into their training class
class_map = {c['class_code']: c['class_id'] for c in CLASSES}
enrollments = []

for u in created_users:
    u_id, u_email, u_name, u_emp, u_class, u_reg = u
    c_id = class_map[u_class]
    
    cur.execute("""
        INSERT INTO class_enrollments (
            class_id, user_id, source_class_code, status, valid_from, is_mock, created_at, updated_at
        ) VALUES (
            %s, %s, %s, 'active', '2026-08-01', false, NOW() - INTERVAL '30 days', NOW()
        ) ON CONFLICT (class_id, user_id, valid_from) DO UPDATE SET
            status = 'active',
            is_mock = false,
            updated_at = NOW()
        RETURNING enrollment_id, class_id, user_id
    """, (c_id, u_id, u_class))
    enr = cur.fetchone()
    enrollments.append({
        'enrollment_id': enr[0],
        'class_id': enr[1],
        'user_id': enr[2],
        'user_email': u_email,
        'user_name': u_name,
        'user_emp': u_emp,
        'class_code': u_class,
        'region_id': u_reg
    })

print(f"Enrolled {len(enrollments)} students into training classes.")

# 5. Core Labs to Assign & Practice
CORE_LABS = [
    ('LAB_AC1000F_01', 'ONT AC1000F: Cấu hình WAN PPPoE cơ bản', 'DEV_AC1000F', 'Modem Quang ONT AC1000F'),
    ('LAB_AC1000F_02', 'ONT AC1000F: Cấu hình Wi-Fi', 'DEV_AC1000F', 'Modem Quang ONT AC1000F'),
    ('LAB_AX3000GZ_01', 'ONT AX3000GZ: Cấu hình WAN PPPoE Wi-Fi 6', 'DEV_AX3000GZ', 'Modem ONT AX3000GZ'),
    ('LAB_AX3000GZ_02', 'ONT AX3000GZ: Cấu hình Wi-Fi', 'DEV_AX3000GZ', 'Modem ONT AX3000GZ'),
    ('LAB_VIGOR2927_01', 'DrayTek Vigor 2927: Cấu hình WAN PPPoE & Load Balancing', 'DEV_VIGOR2927', 'Router DrayTek Vigor 2927'),
    ('mikrotik_hexs-bai1', 'MikroTik hEX S: Bài 1 - Cấu hình PPPoE', 'DEV_MIKROTIK_HEXS', 'Router MikroTik hEX S'),
    ('be6500c-bai1', 'AP Wi-Fi 7 BE6500C: Bài 1 - Cấu hình PPPoE', 'DEV_BE6500C', 'AP Wi-Fi 7 BE6500C'),
    ('LAB_TOPOLOGY_01', 'Bài 1: ONT AC1000F Bridge Mode + Router DrayTek PPPoE', 'DEV_TOPOLOGY', '🔗 Mạng Đa Thiết Bị (Topology)'),
    ('LAB_TOPOLOGY_02', 'Bài 2: ONT AX3000GZ Bridge Mode + Router MikroTik PPPoE', 'DEV_TOPOLOGY', '🔗 Mạng Đa Thiết Bị (Topology)'),
    ('LAB_TOPOLOGY_03', 'Bài 3: Router DrayTek Vigor + AP Wi-Fi 7 BE6500C Mở Rộng Sóng', 'DEV_TOPOLOGY', '🔗 Mạng Đa Thiết Bị (Topology)'),
]

# Fetch curriculum_lab_id for each core lab
cur_lab_map = {}
for lab_id, _, _, _ in CORE_LABS:
    cur.execute("""
        SELECT curriculum_lab_id FROM curriculum_labs 
        WHERE curriculum_id = %s AND lab_id = %s LIMIT 1
    """, (CURRICULUM_ID, lab_id))
    row = cur.fetchone()
    if row:
        cur_lab_map[lab_id] = row[0]

print(f"Mapped {len(cur_lab_map)} curriculum labs.")

# Clean up prior practice sessions for these students to allow clean idempotency
ktv_user_ids = [str(e['user_id']) for e in enrollments]
cur.execute("""
    DELETE FROM timer_session_assignment_links 
    WHERE timer_session_id IN (
        SELECT id FROM timer_sessions WHERE user_id::text = ANY(%s)
    )
""", (ktv_user_ids,))
cur.execute("DELETE FROM timer_sessions WHERE user_id::text = ANY(%s)", (ktv_user_ids,))
print("Cleaned up old test sessions for idempotent run.")

# 6. Assign labs to enrollments
assigned_records = []
for enr in enrollments:
    # Top students: Tùng, Sang, Hoàng C, Văn A
    is_top_student = enr['user_email'] in ['tungdt5101@ut.edu.vn', 'sangnp3251@ut.edu.vn', 'lehoangc@uth.edu.vn', 'hocvien01@grad.edu.vn']
    # Struggling students: Trần Thị B, Phạm Minh D, Vũ Hải E, Anbcd, and ~10 others
    is_struggling = enr['user_email'] in ['tranthib@uth.edu.vn', 'phamminhd@uth.edu.vn', 'vuhaye@uth.edu.vn', 'anbcd@uth.edu.vn'] or (hash(enr['user_email']) % 7 == 0)

    # Assign 5 to 10 labs per student
    labs_to_assign = CORE_LABS if is_top_student else CORE_LABS[:random.randint(6, 10)]

    for lab_id, lab_name, dev_id, dev_name in labs_to_assign:
        cl_id = cur_lab_map.get(lab_id)
        if not cl_id:
            continue

        assigned_at = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=28)
        due_at = assigned_at + datetime.timedelta(days=14)

        if is_top_student:
            status = 'passed'
            pass_attempt = 1
            completed_days = random.randint(2, 20)
            completed_at = assigned_at + datetime.timedelta(days=completed_days)
            passed_at = completed_at
        elif is_struggling:
            rand_val = random.random()
            if rand_val < 0.25:
                status = 'passed'
                pass_attempt = random.randint(2, 4)
                completed_days = random.randint(3, 15)
                completed_at = assigned_at + datetime.timedelta(days=completed_days)
                passed_at = completed_at
            else:
                status = 'in_progress'
                pass_attempt = None
                completed_at = None
                passed_at = None
        else:
            # Average student: 75% passed
            if random.random() < 0.75:
                status = 'passed'
                pass_attempt = random.choice([1, 1, 2])
                completed_days = random.randint(2, 22)
                completed_at = assigned_at + datetime.timedelta(days=completed_days)
                passed_at = completed_at
            else:
                status = 'in_progress'
                pass_attempt = None
                completed_at = None
                passed_at = None

        cur.execute("""
            INSERT INTO lab_assignments (
                assignment_id, enrollment_id, curriculum_lab_id, assigned_at, due_at,
                status, first_pass_attempt_no, completed_at, passed_at,
                class_id_snapshot, region_id_snapshot, assignment_source, is_inferred,
                created_at, updated_at
            ) VALUES (
                gen_random_uuid(), %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, 'manual', false,
                %s, NOW()
            ) ON CONFLICT (enrollment_id, curriculum_lab_id) DO UPDATE SET
                status = EXCLUDED.status,
                first_pass_attempt_no = EXCLUDED.first_pass_attempt_no,
                completed_at = EXCLUDED.completed_at,
                passed_at = EXCLUDED.passed_at,
                updated_at = NOW()
            RETURNING assignment_id
        """, (
            enr['enrollment_id'], cl_id, assigned_at, due_at,
            status, pass_attempt, completed_at, passed_at,
            enr['class_id'], enr['region_id'], assigned_at
        ))
        assign_id = cur.fetchone()[0]
        assigned_records.append({
            'assignment_id': assign_id,
            'enrollment': enr,
            'lab_id': lab_id,
            'lab_name': lab_name,
            'device_id': dev_id,
            'device_name': dev_name,
            'status': status,
            'completed_at': completed_at
        })

print(f"Created {len(assigned_records)} lab assignments across 100 students.")

# 7. Generate Practice Sessions (timer_sessions) with realistic grading_details
COMMON_MISTAKE_TEMPLATES = [
    {
        "id": "wan_vlan_id",
        "name": "Cấu hình 802.1q VLAN Tag 2502 Internet FPT",
        "category": "VLAN",
        "expected": "2502",
        "actual": "0 (Chưa nhập)",
        "message": "Quên gắn Tag VLAN 2502 khiến OLT/BRAS không nhận diện luồng dịch vụ Internet",
        "tip": "Vào menu Network > WAN, bật 802.1q chọn Tag và nhập VLAN ID 2502."
    },
    {
        "id": "lan_dhcp_mode",
        "name": "Tắt DHCP Server trên ONT khi Bridge Mode",
        "category": "DHCP Server",
        "expected": "Disable",
        "actual": "Enable",
        "message": "Chưa tắt DHCP Server trên modem quang gây xung đột cấp phát IP (Double DHCP)",
        "tip": "Vào menu Network > LAN, tại mục DHCP Server chọn Disable và bấm Save."
    },
    {
        "id": "router_ip_gateway",
        "name": "Đổi IP LAN Router tránh xung đột 192.168.1.1",
        "category": "IP Gateway",
        "expected": "192.168.10.1",
        "actual": "192.168.1.1",
        "message": "Trùng dải IP 192.168.1.1 với Modem ONT phía trước làm mất định tuyến gateway",
        "tip": "Vào menu LAN > General Setup trên Router đổi IP LAN sang 192.168.10.1 hoặc 192.168.88.1."
    },
    {
        "id": "mikrotik_nat_rule",
        "name": "Cấu hình NAT Masquerade ra Internet",
        "category": "Firewall NAT",
        "expected": "masquerade",
        "actual": "(Trống)",
        "message": "Thiếu rule NAT Masquerade khiến máy trạm nội bộ không ra được Internet",
        "tip": "Vào IP > Firewall > Tab NAT, thêm rule srcnat, out-interface pppoe-out1, action masquerade."
    },
    {
        "id": "wan_pppoe_auth",
        "name": "Xác thực tài khoản PPPoE FPT",
        "category": "PPPoE",
        "expected": "sgfdl-210208-218",
        "actual": "admin",
        "message": "Nhập sai Username hợp đồng mạng do FPT cung cấp",
        "tip": "Kiểm tra kỹ thông tin hợp đồng mạng và nhập đúng Username/Password PPPoE."
    },
    {
        "id": "save_config",
        "name": "Lưu & Áp dụng cấu hình thiết bị",
        "category": "Lưu cấu hình",
        "expected": "Saved",
        "actual": "Chưa lưu cấu hình",
        "message": "Quên bấm nút Save / Apply / OK trước khi chuyển trang hoặc nộp bài",
        "tip": "Luôn tạo thói quen bấm nút Save/Apply sau mỗi bước cấu hình trước khi nộp bài."
    }
]

total_sessions = 0
for asgn in assigned_records:
    enr = asgn['enrollment']
    u_email = enr['user_email']
    u_name = enr['user_name']
    u_emp = enr['user_emp']
    u_id = enr['user_id']
    lab_id = asgn['lab_id']
    lab_name = asgn['lab_name']
    dev_id = asgn['device_id']
    dev_name = asgn['device_name']
    status = asgn['status']
    completed_at = asgn['completed_at'] or (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=random.randint(1, 10)))

    # Determine attempts based on user profile
    if u_email == 'tungdt5101@ut.edu.vn':
        # Tùng Đặng Thanh: Top 1 student, hardworking, highest score, multiple attempts
        attempts = [100.0, 96.0] if random.random() < 0.6 else [100.0]
    elif u_email in ['sangnp3251@ut.edu.vn', 'lehoangc@uth.edu.vn']:
        attempts = [100.0]
    elif u_email == 'hocvien01@grad.edu.vn':
        attempts = [91.0]
    elif u_email == 'anbcd@uth.edu.vn':
        # Anbcd failed with 0 score
        attempts = [0.0, 0.0]
    elif u_email in ['tranthib@uth.edu.vn', 'phamminhd@uth.edu.vn', 'vuhaye@uth.edu.vn']:
        # Did not attempt AC1000F, failed other labs
        if 'AC1000F' in lab_id:
            continue # Haven't attempted AC1000F!
        attempts = [random.choice([35.0, 45.0, 50.0])]
    else:
        if status == 'passed':
            attempts = [random.choice([80.0, 85.0, 90.0, 95.0, 100.0])]
        else:
            # in_progress: 50% chance attempted and failed, 50% not attempted yet
            if random.random() < 0.55:
                attempts = [random.choice([25.0, 40.0, 55.0])]
            else:
                continue

    for attempt_idx, score in enumerate(attempts):
        is_passed = (score >= 80.0)
        session_status = 'completed' if is_passed else 'failed'
        duration_sec = random.randint(360, 2400) if is_passed else random.randint(240, 1500)
        session_time = completed_at - datetime.timedelta(hours=attempt_idx * 12 + random.randint(1, 5))
        session_started = session_time - datetime.timedelta(seconds=duration_sec)

        # Build grading details
        grading_details = []
        if is_passed:
            grading_details = [
                {"id": "rule_1", "name": "Cấu hình cổng mạng WAN/LAN", "category": "Network", "passed": True, "expected": "Đạt chuẩn", "actual": "Đạt chuẩn"},
                {"id": "rule_2", "name": "Thông số IP & DHCP Server", "category": "DHCP", "passed": True, "expected": "Đạt chuẩn", "actual": "Đạt chuẩn"},
                {"id": "rule_3", "name": "Lưu & Áp dụng cấu hình", "category": "Lưu cấu hình", "passed": True, "expected": "Đạt chuẩn", "actual": "Đạt chuẩn"}
            ]
        else:
            # Pick 1 or 2 realistic failure reasons
            fail_samples = random.sample(COMMON_MISTAKE_TEMPLATES, k=min(2, len(COMMON_MISTAKE_TEMPLATES)))
            for f in fail_samples:
                grading_details.append({
                    "id": f["id"],
                    "name": f["name"],
                    "category": f["category"],
                    "passed": False,
                    "expected": f["expected"],
                    "actual": f["actual"],
                    "message": f["message"],
                    "tip": f["tip"]
                })
            # Add one passing baseline rule
            grading_details.append({
                "id": "rule_conn",
                "name": "Kết nối vật lý thiết bị",
                "category": "Cáp mạng",
                "passed": True,
                "expected": "Link Up",
                "actual": "Link Up"
            })

        # completed_first_try: must be NULL if not 'completed' per table constraint
        completed_first_try = (attempt_idx == 0) if session_status == 'completed' else None

        cur.execute("""
            INSERT INTO timer_sessions (
                user_id, technician_id, name, email,
                started_at, finished_at, duration_sec, mode,
                practice_attempt_no, attempt_sequence_complete,
                device, device_id, lab_id, lab_name,
                status, is_passed, score, grading_details,
                completed_first_try, is_mock, created_at, updated_at
            ) VALUES (
                %s, %s, %s, %s,
                %s, %s, %s, 'Thực hành',
                %s, true,
                %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, false, %s, %s
            ) RETURNING id
        """, (
            u_id, u_emp, u_name, u_email,
            session_started, session_time, duration_sec,
            attempt_idx + 1,
            dev_name, dev_id, lab_id, lab_name,
            session_status, is_passed, score, json.dumps(grading_details, ensure_ascii=False),
            completed_first_try, session_time, session_time
        ))
        sess_id = cur.fetchone()[0]
        total_sessions += 1

        # Link session to assignment
        cur.execute("""
            INSERT INTO timer_session_assignment_links (
                timer_session_id, assignment_id, link_source, linked_at
            ) VALUES (%s, %s, 'live_sync', %s)
            ON CONFLICT DO NOTHING
        """, (sess_id, asgn['assignment_id'], session_time))

print(f"Generated {total_sessions} timer sessions linked to lab assignments.")

# Summary report
cur.execute("SELECT COUNT(*) FROM users WHERE role = 'KTV'")
ktv_count = cur.fetchone()[0]
cur.execute("SELECT COUNT(*) FROM timer_sessions WHERE NOT COALESCE(is_mock, false)")
sess_count = cur.fetchone()[0]
cur.execute("SELECT COUNT(*) FROM lab_assignments")
asgn_count = cur.fetchone()[0]
cur.execute("SELECT COUNT(*) FROM class_enrollments WHERE status = 'active'")
enr_count = cur.fetchone()[0]

print("=" * 60)
print(f"SEEDING COMPLETE:")
print(f" - Total KTV Users: {ktv_count}")
print(f" - Active Class Enrollments: {enr_count}")
print(f" - Total Lab Assignments: {asgn_count}")
print(f" - Total Practice Sessions: {sess_count}")
print(f" - Active Classes: {len(CLASSES)}")
print("=" * 60)

cur.close()
conn.close()
