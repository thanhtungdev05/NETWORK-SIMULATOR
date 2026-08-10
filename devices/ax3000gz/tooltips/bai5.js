/**
 * devices/ax3000gz/tooltips/bai5.js — Tooltip Hướng dẫn cho Bài 5 (AX3000GZ)
 */

if (!window.TOOLTIPS_AX3000GZ) window.TOOLTIPS_AX3000GZ = {};

window.TOOLTIPS_AX3000GZ['ax3gz-bai5'] = [
    {
        selector: '#topmenu a[href*="/internet"]',
        text: 'Bước 1: Chọn Internet',
        position: 'top'
    },
    {
        selector: '#sidebarmenu a[href*="/internet/multicast"]',
        text: 'Bước 2: Chọn Multicast',
        position: 'top'
    },
    {
        selector: '#cbi-json-multicastWifi-Enable input[value="true"]',
        text: 'Bước 3: Đảm bảo chọn On',
        position: 'bottom'
    },
    {
        selector: '.cbi-button-save',
        text: 'Bước 4: Chọn Apply',
        position: 'top'
    }
];
