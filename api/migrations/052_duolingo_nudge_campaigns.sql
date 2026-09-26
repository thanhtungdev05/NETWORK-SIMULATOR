-- 052_duolingo_nudge_campaigns.sql
-- Bảng lưu trữ token nhắc nhở học tập theo chuỗi ngày Duolingo & Rương quà xu may mắn

CREATE TABLE IF NOT EXISTS nudge_campaign_tokens (
    token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 5),
    token VARCHAR(64) UNIQUE NOT NULL,
    points_awarded INTEGER DEFAULT 0,
    claimed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nudge_tokens_lookup ON nudge_campaign_tokens (token);
CREATE INDEX IF NOT EXISTS idx_nudge_tokens_user ON nudge_campaign_tokens (user_id, day_number);

CREATE TABLE IF NOT EXISTS nudge_campaign_logs (
    campaign_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES training_classes(class_id) ON DELETE SET NULL,
    class_code VARCHAR(50),
    day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 5),
    target_email VARCHAR(255),
    sent_count INTEGER NOT NULL DEFAULT 0,
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nudge_logs_created ON nudge_campaign_logs (created_at DESC);
