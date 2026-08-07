/**
 * devices/ax3000c/tooltips/bai3.js — Tooltip Hướng dẫn cho Bài 3: Cấu hình đổi IP LAN (AX3000C)
 */

if (!window.TOOLTIPS_AX3000C) window.TOOLTIPS_AX3000C = {};

window.TOOLTIPS_AX3000C['ax3c-bai3'] = [
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
  // Bước 1: đặt IP cho Router ví dụ: 192.168.100.1 (chỉ hiện khi ở trang LAN)
  {
    selector: '.card .bd .row:nth-child(1) input, input[value="192.168.100.1"]',
    text: 'Bước 1: đặt IP cho Router ví dụ: 192.168.100.1',
    position: 'right',
    page: 'lan'
  },
  // Bước 2: đặt Subnet mask ví dụ: 255.255.255.0 (chỉ hiện khi ở trang LAN)
  {
    selector: '.card .bd .row:nth-child(2) input, input[value="255.255.255.0"]',
    text: 'Bước 2: đặt Subnet mask ví dụ: 255.255.255.0',
    position: 'right',
    page: 'lan'
  },
  // Bước 3: đặt IP động đầu tiên ví dụ: 192.168.100.2 (chỉ hiện khi ở trang LAN)
  {
    selector: '.card .bd .row:nth-child(3) input, input[value="192.168.100.2"]',
    text: 'Bước 3: đặt IP động đầu tiên ví dụ: 192.168.100.2',
    position: 'right',
    page: 'lan'
  },
  // Bước 4: đặt IP động sau cùng ví dụ: 192.168.100.249 (chỉ hiện khi ở trang LAN)
  {
    selector: '.card .bd .row:nth-child(4) input, input[value="192.168.100.249"]',
    text: 'Bước 4: đặt IP động sau cùng ví dụ: 192.168.100.249',
    position: 'right',
    page: 'lan'
  },
  // Bước 5: chọn Apply (chỉ hiện khi ở trang LAN)
  {
    selector: 'button.apply, button.btn.apply, button[onclick*="save"], input[type="submit"]',
    text: 'Bước 5: chọn Apply',
    position: 'right',
    page: 'lan'
  }
];
