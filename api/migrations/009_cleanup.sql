-- 009: Don dep schema + chuyen quan ly role vao DB.
-- - Xoa bang log khong co UI doc/gui: activity_logs, user_role_audit_logs.
-- - Xoa cot profile_status khoi users (chi dung trong API /users, khong co UI dung).
-- - Role duoc quan ly trong DB (users.role) thay vi .env:
--   seed admin hien tai theo email + employee_id (phản ánh IAM_ADMIN_EMAILS/IDS cu).
--   Sau nay doi role bang API PUT /users/:email (can admin) hoac SQL truc tiep.

DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS user_role_audit_logs;

ALTER TABLE users DROP COLUMN IF EXISTS profile_status;

-- Seed admin vao DB (truoc day tu .env: baotpt@fpt.com / 00350603; giu hocvien.login@fpt.com test)
INSERT INTO users (email, role, iam_profile, created_at, updated_at)
VALUES
    ('baotpt@fpt.com', 'admin', '{}'::jsonb, NOW(), NOW()),
    ('hocvien.login@fpt.com', 'admin', '{}'::jsonb, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET role = 'admin', updated_at = NOW();

UPDATE users
   SET role = 'admin', updated_at = NOW()
 WHERE UPPER(COALESCE(employee_id, '')) IN ('00350603');
