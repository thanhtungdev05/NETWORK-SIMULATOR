/**
 * step_by_step/ax3000gz/bai1.js — Hướng dẫn Bài 1: Cấu hình WAN Interface trên AX3000GZ
 */
window.STEPS_AX3000GZ = window.STEPS_AX3000GZ || {};

window.STEPS_AX3000GZ['ax3gz-bai1'] = [
  { selector: 'input[type="text"], #username', text: 'Bước 1: Nhập tài khoản quản trị (admin)', position: 'right' },
  { selector: 'input[type="password"], #password', text: 'Bước 2: Nhập mật khẩu quản trị', position: 'right' },
  { selector: 'input[type="submit"], button', text: 'Bước 3: Bấm Login để đăng nhập', position: 'right' },
  { selector: 'a[href*="wan"], a:has-text("Internet")', text: 'Bước 4: Chọn menu Internet → WAN', position: 'right' },
  { selector: 'input[value*="Save"], input[value*="Apply"]', text: 'Bước 5: Bấm Apply để lưu cấu hình WAN', position: 'right' }
];
