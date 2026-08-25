/**
 * devices/ax3000c/tooltips/bai2.js — Tooltip Hướng dẫn cho Bài 2: Cấu hình Wi-Fi (AX3000C)
 */

if (!window.TOOLTIPS_AX3000C) window.TOOLTIPS_AX3000C = {};

window.TOOLTIPS_AX3000C['LAB_AX3000CV2_02'] = [
  // 1. Chọn Network ở Menu bên trái (chỉ hiện khi chưa ở trang Wi-Fi)
  {
    selector: '.el-submenu__title:contains("Network"), .el-submenu:contains("Network")',
    text: 'Chọn Network',
    position: 'right',
    hideOnPage: 'wifi'
  },
  // 2. Chọn WIFI ở Menu bên trái cấp 1 (chỉ hiện khi chưa ở trang Wi-Fi)
  {
    selector: '.el-submenu:contains("Network") .el-submenu__title:contains("Wi-Fi"), .el-submenu:contains("Network") .el-submenu__title:contains("WIFI")',
    text: 'Chọn WIFI',
    position: 'right',
    hideOnPage: 'wifi'
  },
  // 3. Chọn WIFI ở Submenu bên trái cấp 2 (chỉ hiện khi chưa ở trang Wi-Fi)
  {
    selector: '.el-menu-item:contains("Wi-Fi"), .el-menu-item:contains("WIFI"), .el-menu-item[index*="/network/wifi"]',
    text: 'Chọn WIFI',
    position: 'right',
    hideOnPage: 'wifi'
  },
  // Bước 1: Khuyến khích đổi tab
  {
    selector: '.tabs:not(:has(.tab.active[data-t="host"])) .tab[data-t="host"]',
    text: 'Bước 1:Cấu hình mạng Host SSID',
    position: 'top',
    page: 'wifi'
  },
  // Bước 2: Đặt tên WIFI
  {
    selector: '.tabs:has(.tab.active[data-t="host"]) ~ .card .row input[type="text"]',
    text: 'Bước 2: Đặt tên WIFI VD: FPT Telecom',
    position: 'right',
    page: 'wifi'
  },
  // Bước 3: Đặt mật khẩu WIFI
  {
    selector: '.tabs:has(.tab.active[data-t="host"]) ~ .card #pp',
    text: 'Bước 3: Đặt mật khẩu WIFI VD: fpt12345',
    position: 'right',
    page: 'wifi'
  },
  // Bước 4: Chọn Apply
  {
    selector: '.tabs:has(.tab.active[data-t="host"]) ~ .actions button.apply',
    text: 'Bước 4: Chọn Apply',
    position: 'right',
    page: 'wifi'
  }
];
