/**
 * devices/ax3000gz/tooltips/bai4.js — Tooltip Hướng dẫn cho Bài 4 (AX3000GZ)
 */

if (!window.TOOLTIPS_AX3000GZ) window.TOOLTIPS_AX3000GZ = {};

window.TOOLTIPS_AX3000GZ['ax3gz-bai4'] = [
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
        selector: 'a[href*="/localnetwork/WLAN/mesh"]',
        text: 'Bước 1: Chọn Mesh Wi-Fi',
        position: 'bottom'
    },
    {
        selector: '#cbi-json-data-Enable input[value="1"]',
        text: 'Bước 2: Khuyến cáo chọn On',
        position: 'bottom'
    },
    {
        selector: '.cbi-button-save',
        text: 'Bước 3: Chọn Apply',
        position: 'top'
    }
];
