/**
 * devices/ax3000s/tooltips/common_login.js — Tooltip Đăng nhập chung cho AX3000S
 */

if (!window.TOOLTIPS_AX3000S) window.TOOLTIPS_AX3000S = {};

window.TOOLTIPS_AX3000S._common_login = [
  {
    selector: 'input#user, input[autocomplete="username"]',
    text: 'Nhập tên đăng nhập: admin',
    position: 'right'
  },
  {
    selector: 'input#pass, input[autocomplete="current-password"]',
    text: 'Nhập mật khẩu: admin',
    position: 'right'
  }
];
