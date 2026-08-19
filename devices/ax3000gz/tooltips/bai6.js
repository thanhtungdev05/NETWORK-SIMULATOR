/**
 * devices/ax3000gz/tooltips/bai6.js — Tooltip Hướng dẫn cho Bài 6: Cấu hình DDNS (AX3000GZ)
 */

if (!window.TOOLTIPS_AX3000GZ) window.TOOLTIPS_AX3000GZ = {};

window.TOOLTIPS_AX3000GZ['LAB_AX3000GZ_06'] = [
  {
    selector: '#topmenu a[href*="internet"]',
    text: 'Chọn Internet',
    position: 'bottom',
    hideOnPage: 'internet'
  },
  {
    selector: '#sidebarmenu a[href*="/internet/ddns"]',
    text: 'Chọn DDNS',
    position: 'right',
    page: 'internet',
    hideOnPage: 'ddns'
  },
  {
    selector: '[id="widget.cbid.ddns.myddns_ipv4.service_name"]',
    text: 'Bước 1: Chọn Provider là No-IP',
    position: 'right',
    page: 'ddns'
  },
  {
    selector: 'input[data-widget-id="widget.cbid.ddns.myddns_ipv4.enabled"]',
    text: 'Bước 2: Check vào ô DDNS để kích hoạt',
    position: 'right',
    page: 'ddns'
  },
  {
    selector: '[id="widget.cbid.ddns.myddns_ipv4.username"]',
    text: 'Bước 3: Nhập Username: binhnt3@fpt.net',
    position: 'right',
    page: 'ddns'
  },
  {
    selector: '[id="widget.cbid.ddns.myddns_ipv4.password"]',
    text: 'Bước 4: Nhập Password: fpt12345',
    position: 'right',
    page: 'ddns'
  },
  {
    selector: '[id="widget.cbid.ddns.myddns_ipv4.lookup_host"]',
    text: 'Bước 5: Nhập Host Name: test23122021.ddns.net',
    position: 'right',
    page: 'ddns'
  },
  {
    selector: '.cbi-page-actions .cbi-button-save',
    text: 'Bước 6: Chọn Apply để lưu cấu hình.',
    position: 'bottom',
    page: 'ddns'
  }
];
