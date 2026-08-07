/**
 * devices/ax3000c/tooltips/bai4.js — Tooltip Hướng dẫn cho Bài 4: Cấu hình DNS (AX3000C)
 */

if (!window.TOOLTIPS_AX3000C) window.TOOLTIPS_AX3000C = {};

window.TOOLTIPS_AX3000C['ax3c-bai4'] = [
  // 1. Chọn Network ở Menu bên trái (chỉ hiện khi chưa ở trang LAN)
  {
    selector: '.el-submenu__title:contains("Network"), .el-submenu:contains("Network")',
    text: 'Chọn Network',
    position: 'right',
    hideOnPage: 'lan'
  },
  // 2. Chọn LAN cấp 1 ở Submenu bên trái (chỉ hiện khi chưa ở trang LAN)
  {
    selector: '.el-submenu:contains("Network") .el-submenu__title:contains("LAN"), li.el-submenu:contains("LAN") .el-submenu__title',
    text: 'Chọn LAN',
    position: 'right',
    hideOnPage: 'lan'
  },
  // 3. Chọn LAN cấp 2 ở Submenu bên trái (chỉ hiện khi chưa ở trang LAN)
  {
    selector: '.el-menu-item:contains("LAN"), li.el-menu-item:contains("LAN"), [index*="/network/lan"], [index*="/network/dhcp"]',
    text: 'Chọn LAN',
    position: 'right',
    hideOnPage: 'lan'
  },
  // Bước 1: chọn Enable của Define custom servers (chỉ hiện khi ở trang LAN)
  {
    selector: '.card .bd .row:nth-child(6) .ctrl, .row:has(.lbl:contains("Define custom servers")) select, .row:has(.lbl:contains("Define custom servers")) input',
    text: 'Bước 1: chọn Enable của Define custom servers',
    position: 'right',
    page: 'lan'
  },
  // Bước 2: nhập DNS Server 1 ví dụ: 8.8.8.8 (chỉ hiện khi ở trang LAN)
  {
    selector: '.card .bd .row:nth-child(7) input, .row:has(.lbl:contains("DNS Server 1")) input',
    text: 'Bước 2: nhập DNS Server 1 ví dụ: 8.8.8.8',
    position: 'right',
    page: 'lan'
  },
  // Bước 3: nhập DNS Server 2 ví dụ: 8.8.4.4 (chỉ hiện khi ở trang LAN)
  {
    selector: '.card .bd .row:nth-child(8) input, .row:has(.lbl:contains("DNS Server 2")) input',
    text: 'Bước 3: nhập DNS Server 2 ví dụ: 8.8.4.4',
    position: 'right',
    page: 'lan'
  },
  // Bước 4: chọn Apply (chỉ hiện khi ở trang LAN)
  {
    selector: 'button.apply, button.btn.apply, button[onclick*="save"], input[type="submit"]',
    text: 'Bước 4: chọn Apply',
    position: 'right',
    page: 'lan'
  }
];
