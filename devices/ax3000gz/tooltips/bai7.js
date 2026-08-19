/**
 * devices/ax3000gz/tooltips/bai7.js — Tooltip Hướng dẫn cho Bài 7: Cấu hình SNTP (AX3000GZ)
 */

if (!window.TOOLTIPS_AX3000GZ) window.TOOLTIPS_AX3000GZ = {};

window.TOOLTIPS_AX3000GZ['LAB_AX3000GZ_07'] = [
  {
    selector: '#topmenu a[href*="internet"]',
    text: 'Chọn Internet',
    position: 'bottom',
    hideOnPage: 'internet'
  },
  {
    selector: '#sidebarmenu a[href*="/internet/sntp"]',
    text: 'Chọn SNTP',
    position: 'right',
    page: 'internet',
    hideOnPage: 'sntp'
  },
  {
    selector: '[id="widget.cbid.system.cfg01e48a.zonename"]',
    text: 'Bước 1: Time Zone: Chọn Asia/Ho Chi Minh (GMT+07:00)',
    position: 'right',
    page: 'sntp'
  },
  {
    selector: '[id="widget.cbid.system.cfg01e48a.server"]',
    text: 'Bước 2: Nhập lần lượt vn.pool.ntp.org và asia.pool.ntp.org rồi nhấn nút + để thêm',
    position: 'right',
    page: 'sntp'
  },
  {
    selector: '.cbi-page-actions .cbi-button-save',
    text: 'Bước 3: Chọn Apply để lưu cấu hình.',
    position: 'bottom',
    page: 'sntp'
  }
];
