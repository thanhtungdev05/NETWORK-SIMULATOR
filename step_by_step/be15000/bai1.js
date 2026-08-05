/**
 * step_by_step/be15000/bai1.js — Hướng dẫn Bài 1: Cấu hình WiFi 7 trên BE15000
 */
window.STEPS_BE15000 = window.STEPS_BE15000 || {};

window.STEPS_BE15000['be15k-bai1'] = [
  { selector: 'input[type="text"], #username', text: 'Bước 1: Nhập tên đăng nhập', position: 'right' },
  { selector: 'input[type="password"], #password', text: 'Bước 2: Nhập mật khẩu', position: 'right' },
  { selector: 'input[type="submit"], button', text: 'Bước 3: Bấm Login để đăng nhập', position: 'right' },
  { selector: 'a[href*="wifi"], a:has-text("Wireless")', text: 'Bước 4: Chọn Cấu hình WiFi 7 MLO', position: 'right' },
  { selector: 'input[value*="Save"], input[value*="Apply"]', text: 'Bước 5: Bấm Save/Apply để kích hoạt', position: 'right' }
];
