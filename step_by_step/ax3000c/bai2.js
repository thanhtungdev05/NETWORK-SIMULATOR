/**
 * step_by_step/ax3000c/bai2.js — Hướng dẫn Bài 2: Cấu hình WiFi trên AX3000C
 */
window.STEPS_AX3000C = window.STEPS_AX3000C || {};

window.STEPS_AX3000C['ax3c-bai2'] = [
  { selector: 'a[href*="wifi"], .el-menu-item:has-text("WLAN"), div:has-text("WLAN")', text: 'Bước 1: Chọn menu WLAN Basic', position: 'right' },
  { selector: 'input[name*="ssid"], input[placeholder*="SSID"]', text: 'Bước 2: Nhập tên WiFi (SSID)', position: 'right' },
  { selector: 'input[name*="pass"], input[type="password"]', text: 'Bước 3: Nhập mật khẩu WiFi', position: 'right' },
  { selector: 'button:has-text("Apply"), .el-button--primary', text: 'Bước 4: Bấm Apply để lưu cài đặt WiFi', position: 'right' }
];
