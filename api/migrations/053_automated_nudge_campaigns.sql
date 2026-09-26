-- Migration 053: Automated 5-Day Duolingo Nudge Sequences
-- Cho phép Giảng viên thiết lập tự động hóa chiến dịch gửi email 5 ngày liên tiếp

CREATE TABLE IF NOT EXISTS nudge_automated_campaigns (
    campaign_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    class_id UUID REFERENCES training_classes(class_id) ON DELETE SET NULL,
    class_code VARCHAR(50),
    target_email VARCHAR(255),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    send_hour INTEGER NOT NULL DEFAULT 8,
    current_day INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'paused', 'completed', 'cancelled'
    last_sent_at TIMESTAMPTZ,
    last_sent_day INTEGER DEFAULT 0,
    total_sent_count INTEGER NOT NULL DEFAULT 0,
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nudge_auto_campaigns_status ON nudge_automated_campaigns (status, start_date);
