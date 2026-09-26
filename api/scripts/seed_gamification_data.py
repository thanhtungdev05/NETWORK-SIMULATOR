# -*- coding: utf-8 -*-
"""
api/scripts/seed_gamification_data.py
Populates realistic Duolingo-style streaks, NetCoins, daily activities,
speedrun records, and reward redemption requests for UTH NetLab KTVs.
"""

import sys
import random
import datetime
import psycopg2

sys.stdout.reconfigure(encoding='utf-8')

DB_URL = 'postgresql://postgres:@127.0.0.1:5432/ftc_local?sslmode=disable'
conn = psycopg2.connect(DB_URL)
conn.autocommit = True
cur = conn.cursor()

print("Connected to PostgreSQL for gamification seeding.")

# 1. Fetch all KTV users
cur.execute("SELECT user_id, email, display_name FROM users WHERE role = 'KTV' ORDER BY email")
ktv_users = cur.fetchall()

today = datetime.date.today()
yesterday = today - datetime.timedelta(days=1)

print(f"Found {len(ktv_users)} KTV users.")

# 2. Seed streaks and points
for u_id, email, name in ktv_users:
    if email == 'tungdt5101@ut.edu.vn':
        current_streak = 14
        longest_streak = 14
        total_points = 1680
        last_date = today
    elif email == 'sangnp3251@ut.edu.vn':
        current_streak = 9
        longest_streak = 10
        total_points = 1150
        last_date = today
    elif email == 'lehoangc@uth.edu.vn':
        current_streak = 7
        longest_streak = 7
        total_points = 850
        last_date = today
    elif email == 'hocvien01@grad.edu.vn':
        current_streak = 5
        longest_streak = 6
        total_points = 620
        last_date = today
    elif email == 'anbcd@uth.edu.vn':
        current_streak = 2
        longest_streak = 3
        total_points = 190
        last_date = yesterday # Has not completed today! Needs Duolingo reminder!
    elif email in ['tranthib@uth.edu.vn', 'phamminhd@uth.edu.vn', 'vuhaye@uth.edu.vn']:
        current_streak = 1
        longest_streak = 2
        total_points = random.randint(80, 150)
        last_date = yesterday
    else:
        # Varied streaks: 40% active today, 60% yesterday
        is_today = random.random() < 0.5
        last_date = today if is_today else yesterday
        current_streak = random.choice([1, 2, 3, 4, 5, 6])
        longest_streak = max(current_streak, random.randint(current_streak, current_streak + 3))
        total_points = current_streak * 70 + random.randint(50, 200)

    cur.execute("""
        INSERT INTO user_streaks (
            user_id, current_streak, longest_streak, last_activity_date, streak_freeze_count, total_points, created_at, updated_at
        ) VALUES (
            %s, %s, %s, %s, 1, %s, NOW() - INTERVAL '30 days', NOW()
        ) ON CONFLICT (user_id) DO UPDATE SET
            current_streak = EXCLUDED.current_streak,
            longest_streak = EXCLUDED.longest_streak,
            last_activity_date = EXCLUDED.last_activity_date,
            total_points = EXCLUDED.total_points,
            updated_at = NOW()
    """, (u_id, current_streak, longest_streak, last_date, total_points))

    # Add daily activities for the streak
    for day_offset in range(min(current_streak, 7)):
        act_date = last_date - datetime.timedelta(days=day_offset)
        cur.execute("""
            INSERT INTO user_daily_activity (
                user_id, activity_date, activity_type, points_earned, created_at
            ) VALUES (
                %s, %s, 'practice_passed', 25, NOW() - INTERVAL '%s days'
            ) ON CONFLICT (user_id, activity_date, activity_type) DO NOTHING
        """, (u_id, act_date, day_offset))

print("Seeded user_streaks and weekly activities.")

# 3. Seed Speedrun Records
# Find sessions with score 100
cur.execute("""
    SELECT id, user_id, lab_id, duration_sec 
    FROM timer_sessions 
    WHERE score >= 100.0 AND status = 'completed' AND duration_sec > 0
    ORDER BY duration_sec ASC
""")
perfect_sessions = cur.fetchall()

seen_user_lab = set()
speed_count = 0
for sid, uid, lab_id, dur in perfect_sessions:
    key = (lab_id, uid)
    if key in seen_user_lab:
        continue
    seen_user_lab.add(key)

    cur.execute("""
        INSERT INTO lab_speed_records (
            lab_id, user_id, session_id, duration_sec, score, achieved_at
        ) VALUES (%s, %s, %s, %s, 100.0, NOW() - INTERVAL '3 days')
        ON CONFLICT (lab_id, user_id) DO UPDATE SET
            duration_sec = LEAST(lab_speed_records.duration_sec, EXCLUDED.duration_sec),
            session_id = EXCLUDED.session_id
    """, (lab_id, uid, sid, dur))
    speed_count += 1
    if speed_count >= 25:
        break

print(f"Seeded {speed_count} lab speed records.")

# 4. Seed Reward Redemptions (Pending and Fulfilled)
# Find instructor user id (e.g. admin or giangvien)
cur.execute("SELECT user_id FROM users WHERE role IN ('admin', 'giangvien') LIMIT 1")
inst_row = cur.fetchone()
instructor_id = inst_row[0] if inst_row else None

# Clean prior test redemptions
cur.execute("DELETE FROM reward_redemptions")

sample_redemptions = [
    ('tungdt5101@ut.edu.vn', 'item_keychain_net', 400, 'pending', 'Học viên đạt mốc chuỗi 14 ngày đăng ký nhận móc khóa Switch UTH.'),
    ('sangnp3251@ut.edu.vn', 'item_coffee_voucher', 350, 'fulfilled', 'Giảng viên đã trao voucher đồ uống cho em Sang ngày hôm qua.'),
    ('lehoangc@uth.edu.vn', 'item_bonus_grade_05', 300, 'pending', 'Xin cộng 0.5 điểm bài tập số 2 môn Mạng máy tính.'),
    ('hocvien01@grad.edu.vn', 'item_bonus_training_10', 500, 'pending', 'Đăng ký cộng 1.0 điểm rèn luyện đợt tháng 9.'),
    ('anbcd@uth.edu.vn', 'item_pass_late_1', 250, 'pending', 'Xin nộp bù bài lab quá hạn.'),
]

for email, item_id, cost, status, notes in sample_redemptions:
    cur.execute("SELECT user_id FROM users WHERE email = %s", (email,))
    u_row = cur.fetchone()
    if not u_row:
        continue
    uid = u_row[0]

    fulfilled_at = 'NOW()' if status == 'fulfilled' else 'NULL'
    approved_by = instructor_id if status == 'fulfilled' else None

    cur.execute(f"""
        INSERT INTO reward_redemptions (
            redemption_id, user_id, item_id, points_spent, status, instructor_notes, approved_by, requested_at, fulfilled_at
        ) VALUES (
            gen_random_uuid(), %s, %s, %s, %s, %s, %s, NOW() - INTERVAL '1 day', {fulfilled_at}
        )
    """, (uid, item_id, cost, status, notes, approved_by))

print(f"Seeded {len(sample_redemptions)} reward redemption requests.")

cur.execute("SELECT COUNT(*) FROM user_streaks WHERE current_streak > 0")
active_streaks = cur.fetchone()[0]
cur.execute("SELECT COUNT(*) FROM reward_redemptions WHERE status = 'pending'")
pending_redemptions = cur.fetchone()[0]

print("=" * 60)
print("GAMIFICATION SEEDING COMPLETE:")
print(f" - Active Streak Users: {active_streaks}")
print(f" - Pending Instructor Redemptions: {pending_redemptions}")
print(f" - Speed Records: {speed_count}")
print("=" * 60)

cur.close()
conn.close()
