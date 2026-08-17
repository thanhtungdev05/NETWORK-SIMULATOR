/**
 * devices/ax3000c/tooltips/bai2.js — Tooltip Hướng dẫn cho Bài 2: Cấu hình Wi-Fi (AX3000C)
 */

if (!window.TOOLTIPS_AX3000C) window.TOOLTIPS_AX3000C = {};

window.TOOLTIPS_AX3000C['ax3c-bai2'] = [
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
  // Bước 1: Đặt tên WIFI VD: FPT Telecom (chỉ hiện khi đã vào trang Wi-Fi)
  {
    selector: '.card .row input[type="text"], input[value*="FPT"]',
    text: 'Bước 1: Đặt tên WIFI VD: FPT Telecom',
    position: 'right',
    page: 'wifi'
  },
  // Bước 2: Đặt mật khẩu WIFI VD: fpt123456 (chỉ hiện khi đã vào trang Wi-Fi)
  {
    selector: '#pp, input[type="password"]',
    text: 'Bước 2: Đặt mật khẩu WIFI VD: fpt123456',
    position: 'right',
    page: 'wifi'
  },
  // Bước 3: Chọn Apply (chỉ hiện khi đã vào trang Wi-Fi)
  {
    selector: 'button.apply, button.btn.apply, button[onclick*="save"], input[type="submit"]',
    text: 'Bước 3: Chọn Apply',
    position: 'right',
    page: 'wifi'
  }
];
