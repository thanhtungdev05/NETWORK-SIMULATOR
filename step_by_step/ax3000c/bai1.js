/**
 * step_by_step/ax3000c/bai1.js — Hướng dẫn Bài 1: Cấu hình WAN/Internet trên AX3000C
 */
window.STEPS_AX3000C = window.STEPS_AX3000C || {};

window.STEPS_AX3000C['ax3c-bai1'] = [
  { selector: 'input[name="username"], #username, input[type="text"]', text: 'Bước 1: Nhập tài khoản quản trị (admin)', position: 'right' },
  { selector: 'input[name="password"], #password, input[type="password"]', text: 'Bước 2: Nhập mật khẩu quản trị (admin)', position: 'right' },
  { selector: 'button[type="submit"], .el-button--primary, button:has-text("Đăng nhập"), button:has-text("Login")', text: 'Bước 3: Bấm Đăng nhập', position: 'right' },
  { selector: 'a[href*="wan"], div:has-text("Internet"), .el-menu-item:has-text("WAN")', text: 'Bước 4: Chọn WAN Interface', position: 'right' },
  { selector: 'button:has-text("Apply"), button:has-text("Lưu"), .el-button--success', text: 'Bước 5: Bấm Apply để lưu cấu hình', position: 'right' }
];
