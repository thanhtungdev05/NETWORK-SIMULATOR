-- 036_add_password_authentication.sql
-- Thêm cột password_hash để hỗ trợ đăng nhập bằng mật khẩu (Native Authentication)
-- và khởi tạo các tài khoản mẫu độc lập phục vụ Đồ án Tốt nghiệp.

-- 1. Thêm cột password_hash vào bảng users nếu chưa có
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 2. Cập nhật quyền cho vai trò ADMIN để có thể xuất báo cáo đầy đủ
UPDATE roles
   SET can_export_reports = TRUE,
       updated_at = NOW()
 WHERE role_code = 'ADMIN';

-- 3. Khởi tạo / cập nhật tài khoản Quản trị viên (Admin)
INSERT INTO users (
    user_id,
    email,
    display_name,
    role,
    employee_id,
    password_hash,
    iam_profile,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'admin@grad.edu.vn',
    'Quản trị viên Hệ thống',
    'ADMIN',
    'ADMIN01',
    '$2y$12$9KLDhYE0EKmGdCgF.wiHNu8DeTx5KdC9HuUEJlO4.vOBh.wEDBd.m', -- Mật khẩu: Admin@123
    '{}'::jsonb,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    display_name = EXCLUDED.display_name,
    role = EXCLUDED.role,
    employee_id = EXCLUDED.employee_id,
    updated_at = NOW();

-- 4. Khởi tạo / cập nhật tài khoản Giảng viên (Instructor / DEV)
INSERT INTO users (
    user_id,
    email,
    display_name,
    role,
    employee_id,
    password_hash,
    iam_profile,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'giangvien@grad.edu.vn',
    'ThS. Nguyễn Văn Hướng - Giảng viên',
    'DEV',
    'GV2026',
    '$2y$12$2be.UVvd8E9aZ9N9s2Fobe2FVBKOAdU7ahj4b0ZngE2ycOUJKnU4C', -- Mật khẩu: Teacher@123
    '{}'::jsonb,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    display_name = EXCLUDED.display_name,
    role = EXCLUDED.role,
    employee_id = EXCLUDED.employee_id,
    updated_at = NOW();

-- 5. Khởi tạo / cập nhật tài khoản Học viên (Student / KTV)
INSERT INTO users (
    user_id,
    email,
    display_name,
    role,
    employee_id,
    password_hash,
    iam_profile,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'hocvien01@grad.edu.vn',
    'Nguyễn Văn A - Học viên',
    'KTV',
    'SV2026001',
    '$2y$12$H.o8o5YelJfcDXh1fv.3yuLSypbdNq7hphNNqNxna6paBODDuxd/C', -- Mật khẩu: Student@123
    '{}'::jsonb,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    display_name = EXCLUDED.display_name,
    role = EXCLUDED.role,
    employee_id = EXCLUDED.employee_id,
    updated_at = NOW();
