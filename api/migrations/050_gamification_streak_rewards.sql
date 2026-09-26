-- Migration 050: Gamification, Duolingo-style Streak, Speedrun Records, and Instructor Reward Store
-- Created for UTH Network Simulator

CREATE TABLE IF NOT EXISTS user_streaks (
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_date DATE,
    streak_freeze_count INTEGER NOT NULL DEFAULT 1,
    total_points INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_daily_activity (
    activity_id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    points_earned INTEGER NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT user_daily_activity_unique UNIQUE (user_id, activity_date, activity_type)
);

CREATE INDEX IF NOT EXISTS idx_user_daily_activity_user_date ON user_daily_activity (user_id, activity_date);

CREATE TABLE IF NOT EXISTS reward_items (
    item_id VARCHAR(50) PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'academic', 'souvenir', 'voucher'
    points_cost INTEGER NOT NULL,
    icon TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT -1, -- -1: unlimited
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reward_redemptions (
    redemption_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    item_id VARCHAR(50) NOT NULL REFERENCES reward_items(item_id) ON DELETE RESTRICT,
    points_spent INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'fulfilled', 'rejected'
    instructor_notes TEXT,
    approved_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fulfilled_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_reward_redemptions_user ON reward_redemptions (user_id, requested_at DESC);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_status ON reward_redemptions (status, requested_at DESC);

CREATE TABLE IF NOT EXISTS lab_speed_records (
    record_id BIGSERIAL PRIMARY KEY,
    lab_id VARCHAR(50) NOT NULL REFERENCES lab_catalog(lab_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    session_id BIGINT NOT NULL REFERENCES timer_sessions(id) ON DELETE CASCADE,
    duration_sec INTEGER NOT NULL,
    score NUMERIC NOT NULL DEFAULT 100.0,
    achieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT lab_speed_records_user_lab_unique UNIQUE (lab_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_lab_speed_records_lab_duration ON lab_speed_records (lab_id, duration_sec ASC);

-- Initial Reward Catalog Seed
INSERT INTO reward_items (item_id, title, description, category, points_cost, icon, sort_order) VALUES
('item_bonus_grade_05', '+0.5 Điểm Chuyên Cần / Bài Tập', 'Cộng trực tiếp 0.5 điểm vào điểm chuyên cần hoặc bài tập thực hành môn mạng.', 'academic', 300, '📝', 1),
('item_bonus_training_10', '+1.0 Điểm Rèn Luyện Tháng', 'Cộng 1.0 điểm vào đánh giá rèn luyện sinh viên/KTV định kỳ.', 'academic', 500, '🌟', 2),
('item_pass_late_1', 'Vé Miễn Trừ 1 Lần Trễ Hạn', 'Đặc quyền nộp bổ sung 1 bài lab quá hạn mà không bị trừ điểm.', 'academic', 250, '🎫', 3),
('item_keychain_net', 'Móc Khóa Mô Hình Switch / Router UTH', 'Quà lưu niệm mô hình thiết bị mạng tinh xảo độc quyền phòng NetLab.', 'souvenir', 400, '🔑', 4),
('item_coffee_voucher', 'Voucher Trà Sữa / Cà Phê Từ Thầy', 'Phiếu thưởng đồ uống 40.000đ do Giảng viên trực tiếp mời học viên chăm chỉ.', 'voucher', 350, '☕', 5),
('item_thermos_netlab', 'Bình Giữ Nhiệt Cao Cấp NetLab UTH', 'Bình giữ nhiệt inox 304 in logo Network Simulator & UTH.', 'souvenir', 800, '🍶', 6),
('item_cert_honor', 'Giấy Khen Điện Tử "KTV Siêu Cấp"', 'Chứng nhận danh dự vinh danh thành tích học tập và rèn luyện xuất sắc.', 'academic', 200, '📜', 7)
ON CONFLICT (item_id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    points_cost = EXCLUDED.points_cost,
    icon = EXCLUDED.icon,
    sort_order = EXCLUDED.sort_order;

-- View for Streak Leaderboard
CREATE OR REPLACE VIEW v_streak_leaderboard AS
SELECT 
    s.user_id,
    u.display_name,
    u.email,
    u.employee_id,
    COALESCE(u.class_code, tc.class_code, 'Lớp chung') AS class_code,
    s.current_streak,
    s.longest_streak,
    s.total_points,
    s.last_activity_date
FROM user_streaks s
JOIN users u ON u.user_id = s.user_id
LEFT JOIN class_enrollments ce ON ce.user_id = u.user_id AND ce.status = 'active'
LEFT JOIN training_classes tc ON tc.class_id = ce.class_id
WHERE u.role = 'KTV'
ORDER BY s.current_streak DESC, s.total_points DESC;

-- View for Pending Redemptions for Instructors
CREATE OR REPLACE VIEW v_pending_reward_redemptions AS
SELECT 
    r.redemption_id,
    r.user_id,
    u.display_name,
    u.display_name AS student_name,
    u.email,
    u.email AS student_email,
    u.employee_id,
    COALESCE(u.class_code, tc.class_code, 'Lớp chung') AS class_code,
    r.item_id,
    i.title AS item_title,
    i.category AS item_category,
    i.icon AS item_icon,
    r.points_spent,
    r.status,
    r.instructor_notes,
    r.requested_at,
    r.fulfilled_at
FROM reward_redemptions r
JOIN users u ON u.user_id = r.user_id
JOIN reward_items i ON i.item_id = r.item_id
LEFT JOIN class_enrollments ce ON ce.user_id = u.user_id AND ce.status = 'active'
LEFT JOIN training_classes tc ON tc.class_id = ce.class_id
ORDER BY r.requested_at DESC;
