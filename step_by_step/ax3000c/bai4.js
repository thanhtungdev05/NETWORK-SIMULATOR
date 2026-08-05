/**
 * step_by_step/ax3000c/bai4.js — Hướng dẫn Bài 4: Cấu hình Port Forwarding trên AX3000C
 */
window.STEPS_AX3000C = window.STEPS_AX3000C || {};

window.STEPS_AX3000C['ax3c-bai4'] = [
  { selector: 'a[href*="portfwd"], div:has-text("Port Forwarding")', text: 'Bước 1: Chọn Security → Port Forwarding', position: 'right' },
  { selector: 'button:has-text("Add"), .el-button--primary', text: 'Bước 2: Bấm Add Rule để thêm cổng cần mở', position: 'right' },
  { selector: 'button:has-text("Apply")', text: 'Bước 3: Bấm Apply để lưu', position: 'right' }
];
