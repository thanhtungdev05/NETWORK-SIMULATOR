/**
 * devices/ax3000gz/tooltips/bai1.js — Tooltip Hướng dẫn cho Bài 1: Cấu hình ONT (AX3000GZ)
 */

if (!window.TOOLTIPS_AX3000GZ) window.TOOLTIPS_AX3000GZ = {};

window.TOOLTIPS_AX3000GZ['LAB_AX3000GZ_01'] = [
  {
    selector: '#topmenu a[href*="internet"]',
    text: 'Chọn Internet',
    position: 'bottom',
    page: 'home'
  },
  {
    selector: '#WANUrl, #sidebarmenu a[href*="/internet/wan"]',
    text: 'Chọn Wan',
    position: 'right',
    hideOnPage: 'wan'
  },
  {
    selector: '#widget\\.cbid\\.network\\.wan\\.username',
    text: 'Bước 1: Nhập Username của phần PPP: fpt',
    position: 'right',
    page: 'wan'
  },
  {
    selector: '#widget\\.cbid\\.network\\.wan\\.password',
    text: 'Bước 2: Nhập Password của phần PPP: fpt12345',
    position: 'right',
    page: 'wan'
  },
  {
    selector: '.cbi-button-save',
    text: 'Bước 3: Chọn Apply để lưu cấu hình.',
    position: 'bottom',
    page: 'wan'
  }
];
