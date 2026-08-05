/**
 * step_by_step/ac1000f/bai2.js — Hướng dẫn Bài 2: Cấu hình WiFi cho ONT AC1000F
 */
window.STEPS_AC1000F = window.STEPS_AC1000F || {};

window.STEPS_AC1000F['ac1-bai2'] = [
  // Header / Nav
  { selector: 'a[onclick*="change_bg2"]', text: 'Chọn tab Network', position: 'top' },
  { selector: 'a[href*="home_wireless.asp"]', text: 'Chọn menu Wireless 2.4G', position: 'bottom' },
  
  // Wireless 2.4G page
  { selector: 'input[name="ESSID"]', text: 'Bước 1: Nhập tên mạng WiFi (SSID)', position: 'right' },
  { selector: 'select[name="WEP_Selection"]', text: 'Bước 2: Chọn WPA-PSK/WPA2-PSK', position: 'right' },
  { selector: 'input[name="PreSharedKey1"]', text: 'Bước 3: Nhập mật khẩu WiFi (Security Passphrase)', position: 'right' },
  { selector: 'input[name="SaveBtn"], input[value="Save"]', text: 'Bước 4: Bấm Save để lưu cấu hình WiFi', position: 'right' }
];
