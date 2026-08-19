/**
 * devices/ax3000gz/tooltips/bai3.js — Tooltip Hướng dẫn cho Bài 3: Tính năng BandSteering (AX3000GZ)
 */

if (!window.TOOLTIPS_AX3000GZ) window.TOOLTIPS_AX3000GZ = {};

window.TOOLTIPS_AX3000GZ['LAB_AX3000GZ_03'] = [
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
    selector: '.tabs a[href*="BandSteering"]',
    text: 'Chọn tab BandSteering',
    position: 'bottom',
    page: 'wlan',
    hideOnPage: 'bandsteering'
  },
  {
    selector: '[id="widget.cbid.json.BandSteering.RssiThreshold2g"]',
    text: 'Bước 1: Nhập RSSIThreshold(2.4g): -65',
    position: 'right',
    page: 'bandsteering'
  },
  {
    selector: '[id="widget.cbid.json.BandSteering.RssiThreshold5g"]',
    text: 'Bước 2: Nhập RSSIThreshold(5g): -65',
    position: 'right',
    page: 'bandsteering'
  },
  {
    selector: '.cbi-page-actions .cbi-button-save',
    text: 'Bước 3: Chọn Apply để lưu cấu hình.',
    position: 'bottom',
    page: 'bandsteering'
  }
];
