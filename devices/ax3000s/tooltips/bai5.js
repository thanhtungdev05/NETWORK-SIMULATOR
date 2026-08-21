/**
 * devices/ax3000s/tooltips/bai5.js — Tooltip Hướng dẫn cho Bài 5: Cấu hình DNS
 */

if (!window.TOOLTIPS_AX3000S) window.TOOLTIPS_AX3000S = {};

window.TOOLTIPS_AX3000S['LAB_AX3000S_05'] = [
  // Chọn Network
  {
    selector: '#Sky_Network span, #Sky_Network li, #Sky_Network',
    text: 'Chọn Network',
    position: 'bottom',
    hideOnPage: 'network'
  },
  // Chọn LAN Configuration
  {
    selector: '#layer2-leaf-lancfg .dt, #layer2-leaf-lancfg',
    text: 'Chọn LAN Configuration',
    position: 'right',
    hideOnPage: 'lancfgv4'
  },
  // Chọn IPv4 Configuration
  {
    selector: '#Sky_IPv4_Configuration, #layer2-leaf-lancfg #Sky_IPv4_Configuration',
    text: 'Chọn IPv4 Configuration',
    position: 'top',
    page: 'lancfgv4'
  },
  // Bước 1: Chọn Enable (DHCP Server)
  {
    selector: '#Sky_DHCP_Enable',
    text: 'Bước 1: Chọn Enable',
    position: 'top',
    page: 'lancfgv4',
    expected: '1'
  },
  // Bước 2: Chọn Static ở IPv4 DNS Mode
  {
    selector: '#Sky_DHCP_Mode_Static',
    text: 'Bước 2: Chọn Static ở IPv4 DNS Mode',
    position: 'right',
    page: 'lancfgv4',
    expected: '1'
  },
  // Bước 3: Nhập Primary DNS 210.245.31.220
  {
    selector: '#dnsPrimary',
    text: 'Bước 3: Nhập Primary DNS 210.245.31.220',
    position: 'right',
    page: 'lancfgv4',
    expected: '210.245.31.220'
  },
  // Bước 4: Nhập Secondary DNS 8.8.8.8
  {
    selector: '#dnsSecondary',
    text: 'Bước 4: Nhập Secondary DNS 8.8.8.8',
    position: 'right',
    page: 'lancfgv4',
    expected: '8.8.8.8'
  },
  // Bước 5: Nhấn Save & Apply
  {
    selector: '#Sky_Apply',
    text: 'Bước 5: Nhấn Save & Apply',
    position: 'top',
    page: 'lancfgv4'
  }
];
