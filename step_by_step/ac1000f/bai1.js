/**
 * step_by_step/ac1000f/bai1.js — Hướng dẫn Bài 1: Cấu hình PPPoE cho ONT AC1000F
 */
window.STEPS_AC1000F = window.STEPS_AC1000F || {};

window.STEPS_AC1000F['ac1-bai1'] = [
  // Header / Nav
  { selector: 'a[onclick*="change_bg2"]', text: 'Chọn tab Network', position: 'top' },
  { selector: 'a[href*="home_wan.asp"]', text: 'Chọn menu Internet', position: 'bottom' },
  // WAN page (home_wan.asp)
  { selector: 'input[name="wan_PPPUsername"]', text: 'Bước 1: Nhập tên khách hàng ví dụ: Sqtdl-210208-218', position: 'right' },
  { selector: 'input[name="wan_PPPPassword"]', text: 'Bước 2: Nhập mật khẩu khách hàng ví dụ: fpt12345', position: 'right' },
  { selector: 'input[name="SaveBtn"], input[value="Save"]', text: 'Bước 3: Chọn Save để lưu cấu hình', position: 'right' }
];
