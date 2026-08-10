/**
 * devices/ax3000gz/tooltips/bai3.js — Tooltip Hướng dẫn cho Bài 3 (AX3000GZ)
 */

if (!window.TOOLTIPS_AX3000GZ) window.TOOLTIPS_AX3000GZ = {};

window.TOOLTIPS_AX3000GZ['ax3gz-bai3'] = [
    {
        selector: '#topmenu a[href$="/localnetwork"]',
        text: 'Chọn Local Network',
        position: 'top'
    },
    {
        selector: '#sidebarmenu a[href$="/localnetwork/WLAN"]',
        text: 'Chọn WLAN',
        position: 'top'
    },
    {
        selector: 'a[href*="/localnetwork/WLAN/BandSteering"]',
        text: 'Bước 1: Chọn BandSteering',
        position: 'bottom'
    },
    {
        selector: '.cbi-button-save',
        text: 'Bước 2: Giữ cấu hình mặc định và chọn Apply',
        position: 'top'
    }
];
