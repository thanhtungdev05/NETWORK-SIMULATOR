/**
 * step_by_step/ax3000s/bai1.js — Hướng dẫn Bài 1: Cấu hình WAN cho AX3000S
 */
window.STEPS_AX3000S = window.STEPS_AX3000S || {};

window.STEPS_AX3000S['ax3s-bai1'] = [
  { selector: 'input[type="text"], #username', text: 'Bước 1: Nhập tên đăng nhập', position: 'right' },
  { selector: 'input[type="password"], #password', text: 'Bước 2: Nhập mật khẩu', position: 'right' },
  { selector: 'input[type="submit"], button', text: 'Bước 3: Bấm Login để đăng nhập', position: 'right' },
  { selector: 'a[href*="wan"], a:has-text("Internet")', text: 'Bước 4: Chọn Cấu hình WAN', position: 'right' },
  { selector: 'input[value*="Save"], input[value*="Apply"]', text: 'Bước 5: Bấm Apply để lưu cài đặt', position: 'right' }
];
