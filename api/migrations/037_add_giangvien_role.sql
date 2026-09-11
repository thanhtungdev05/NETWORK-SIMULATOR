-- 037: Bổ sung vai trò Giảng viên (GIANGVIEN) vào hệ thống phân quyền RBAC

ALTER TABLE roles DROP CONSTRAINT IF EXISTS roles_role_code_check;

ALTER TABLE roles ADD CONSTRAINT roles_role_code_check 
    CHECK (role_code IN ('KTV', 'ADMIN', 'DEV', 'GIANGVIEN'));

INSERT INTO roles (role_code, role_name, is_admin, can_export_reports, sort_order)
VALUES ('GIANGVIEN', 'Giảng viên', FALSE, TRUE, 15)
ON CONFLICT (role_code) DO UPDATE
SET role_name = EXCLUDED.role_name,
    is_admin = EXCLUDED.is_admin,
    can_export_reports = EXCLUDED.can_export_reports,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();

-- Cập nhật tài khoản giảng viên mẫu sang vai trò GIANGVIEN chuẩn
UPDATE users 
   SET role = 'GIANGVIEN', 
       updated_at = NOW() 
 WHERE email = 'giangvien@grad.edu.vn' 
   AND role IN ('DEV', 'KTV');
