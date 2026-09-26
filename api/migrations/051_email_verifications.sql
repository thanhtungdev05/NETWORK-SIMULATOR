-- 051_email_verifications.sql
-- Bảng lưu trữ mã xác thực OTP gửi qua email (Đăng ký tài khoản & Đặt lại mật khẩu)

CREATE TABLE IF NOT EXISTS email_verifications (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    action VARCHAR(50) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_verif_lookup 
    ON email_verifications (LOWER(email), action, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_verif_active 
    ON email_verifications (LOWER(email), action, used_at) 
    WHERE used_at IS NULL;
