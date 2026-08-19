/**
 * devices/ax3000gz/tooltips/bai4.js — Tooltip Hướng dẫn cho Bài 4: Cấu hình Mesh WiFi (AX3000GZ)
 */

if (!window.TOOLTIPS_AX3000GZ) window.TOOLTIPS_AX3000GZ = {};

window.TOOLTIPS_AX3000GZ['LAB_AX3000GZ_04'] = [
  {
    selector: '#topmenu a[href*="localnetwork"]',
    text: 'Chọn Local Network',
    position: 'bottom',
    hideOnPage: 'localnetwork'
  },
  {
    selector: '#sidebarmenu a[href*="/localnetwork/WLAN"]',
    text: 'Chọn WLAN',
    position: 'right',
    page: 'localnetwork',
    hideOnPage: 'wlan'
  },
  {
    selector: '.tabs a[href*="mesh"]',
    text: 'Chọn tab Mesh Wi-Fi',
    position: 'bottom',
    page: 'wlan',
    hideOnPage: 'mesh'
  },
  {
    selector: '[id="widget.cbid.json.data.Enable.0"]',
    text: 'Enable chọn On',
    position: 'left',
    page: 'mesh'
  },
  {
    selector: '[id="widget.cbid.json.data.RoamRssiLmt24G"]',
    text: 'Bước 1: Nhập Roaming Limit (2.4G): -65',
    position: 'right',
    page: 'mesh'
  },
  {
    selector: '[id="widget.cbid.json.data.RoamRssiLmt5G"]',
    text: 'Bước 2: Nhập Roaming Limit (5G): -65',
    position: 'right',
    page: 'mesh'
  },
  {
    selector: '.cbi-page-actions .cbi-button-save',
    text: 'Bước 3: Chọn Apply để lưu cấu hình.',
    position: 'bottom',
    page: 'mesh'
  }
];
