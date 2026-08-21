/**
 * devices/ax3000gz/tooltips/bai8.js — Tooltip Hướng dẫn cho Bài 5 - Cấu hình Port Forwarding (AX3000GZ)
 */

if (!window.TOOLTIPS_AX3000GZ) window.TOOLTIPS_AX3000GZ = {};

window.TOOLTIPS_AX3000GZ['LAB_AX3000GZ_05'] = [
  {
    selector: '#topmenu a[href*="internet"]',
    text: 'Chọn Internet',
    position: 'bottom',
    hideOnPage: 'internet'
  },
  {
    selector: '#sidebarmenu a[href*="/internet/security"]',
    text: 'Chọn Security',
    position: 'right',
    page: 'internet',
    hideOnPage: 'security'
  },
  {
    selector: '.tabs a[href*="/security/forwards"]',
    text: 'Chọn Port Forwards',
    position: 'bottom',
    page: 'security',
    hideOnPage: 'forwards'
  },
  {
    selector: '.cbi-section-create .cbi-button-add',
    text: 'Bước 1: Chọn Add',
    position: 'right',
    page: 'forwards'
  },
  {
    selector: '[id="modal_field_name"]',
    text: 'Bước 3: Nhập Name: FPT Telecom',
    position: 'right',
    page: 'forwards'
  },
  {
    selector: '[id="modal_field_enabled"] label:last-child',
    text: 'Bước 2: Enable: Chọn On',
    position: 'right',
    page: 'forwards'
  },
  {
    selector: '[id="modal_field_proto"]',
    text: 'Bước 4: Protocol: Chọn TCP/UDP',
    position: 'right',
    page: 'forwards'
  },
  {
    selector: '[id="modal_field_src_ip"]',
    text: 'Bước 5: Nhập WAN Host IP Address: 21.143.157.184',
    position: 'right',
    page: 'forwards'
  },
  {
    selector: '[id="modal_field_dest_ip"]',
    text: 'Bước 6: Nhập LAN Host: 192.168.1.254',
    position: 'right',
    page: 'forwards'
  },
  {
    selector: '[id="modal_field_src_dport"]',
    text: 'Bước 7: Nhập WAN Port: 8080',
    position: 'right',
    page: 'forwards'
  },
  {
    selector: '[id="modal_field_dest_port"]',
    text: 'Bước 8: Nhập LAN Host Port: 8080',
    position: 'right',
    page: 'forwards'
  },
  {
    selector: '.modal .cbi-page-actions .cbi-button-save',
    text: 'Bước 9: Chọn Apply để lưu cấu hình',
    position: 'bottom',
    page: 'forwards'
  }
];
