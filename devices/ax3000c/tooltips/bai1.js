/**
 * devices/ax3000c/tooltips/bai1.js — Tooltip Hướng dẫn cho Bài 1: Cấu hình PPPoE (AX3000C)
 */

if (!window.TOOLTIPS_AX3000C) window.TOOLTIPS_AX3000C = {};

window.TOOLTIPS_AX3000C['LAB_AX3000CV2_01'] = [
  // 1. Chọn Network ở Menu bên trái (chỉ hiện khi chưa ở trang WAN)
  {
    selector: 'li.el-submenu:not(.is-opened):contains("Network") .el-submenu__title',
    text: 'Chọn Network',
    position: 'right',
    hideOnPage: 'wan'
  },
  // 2. Chọn WAN ở Menu bên trái cấp 1 (chỉ hiện khi chưa ở trang WAN)
  {
    selector: 'li.el-submenu.is-opened:contains("Network") li.el-submenu:not(.is-opened):contains("WAN") .el-submenu__title',
    text: 'Chọn WAN',
    position: 'right',
    hideOnPage: 'wan'
  },
  // 3. Chọn WAN ở Submenu bên trái cấp 2 (chỉ hiện khi chưa ở trang WAN)
  {
    selector: 'li.el-submenu.is-opened:contains("Network") li.el-submenu.is-opened:contains("WAN") li.el-menu-item:contains("WAN")',
    text: 'Chọn WAN',
    position: 'right',
    hideOnPage: 'wan'
  },
  // Bước 1: Chọn PPPOE (chỉ hiện khi đã vào trang WAN)
  {
    selector: 'select#ctype, select[name="proto"]',
    text: 'Bước 1: Chọn PPPOE',
    position: 'right',
    page: 'wan'
  },
  // Bước 2: Nhập tên VD: sgfdl-123456-789 (chỉ hiện khi đã vào trang WAN)
  {
    selector: '.grp[data-t="PPPoE"] input[type="text"], input[name="username"], #username',
    text: 'Bước 2: nhập tên VD: sgfdl-123456-789',
    position: 'right',
    page: 'wan'
  },
  // Bước 3: Nhập mật khẩu VD: d123456 (chỉ hiện khi đã vào trang WAN)
  {
    selector: '#pppw, .grp[data-t="PPPoE"] input[type="password"], input[name="password"]',
    text: 'Bước 3: Nhập mật khẩu VD: d123456',
    position: 'right',
    page: 'wan'
  },
  // Bước 4: Chọn SAVE (chỉ hiện khi đã vào trang WAN)
  {
    selector: 'button.apply, button.btn.apply, button[onclick*="save"], input[type="submit"], #save, .btn-save',
    text: 'Bước 4: Chọn SAVE',
    position: 'right',
    page: 'wan'
  }
];
