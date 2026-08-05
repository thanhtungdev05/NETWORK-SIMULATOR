/**
 * step_by_step/ax3000c/bai3.js — Hướng dẫn Bài 3: Cấu hình LAN & DHCP trên AX3000C
 */
window.STEPS_AX3000C = window.STEPS_AX3000C || {};

window.STEPS_AX3000C['ax3c-bai3'] = [
  { selector: 'a[href*="dhcp"], .el-menu-item:has-text("LAN"), div:has-text("LAN")', text: 'Bước 1: Chọn Local Network → LAN', position: 'right' },
  { selector: 'input[name*="ip"], input[placeholder*="192.168"]', text: 'Bước 2: Nhập dải IP LAN', position: 'right' },
  { selector: 'button:has-text("Apply"), .el-button--primary', text: 'Bước 3: Bấm Apply để cập nhật DHCP', position: 'right' }
];
