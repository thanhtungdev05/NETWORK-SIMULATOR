/**
 * devices/ax3000gz/tooltips/bai7.js — Tooltip Hướng dẫn cho Bài 7 (AX3000GZ)
 */

if (!window.TOOLTIPS_AX3000GZ) window.TOOLTIPS_AX3000GZ = {};

window.TOOLTIPS_AX3000GZ['ax3gz-bai7'] = [
    {
        selector: '#topmenu a[href*="/internet"]',
        text: 'Bước 1: Chọn Internet',
        position: 'top'
    },
    {
        selector: '#sidebarmenu a[href*="/internet/sntp"]',
        text: 'Bước 2: Chọn SNTP',
        position: 'top'
    },
    {
        selector: '#cbi-system-cfg01e48a-zonename select',
        text: 'Bước 3: Đảm bảo chọn Asia/Ho Chi Minh (GMT+7)',
        position: 'right'
    },
    {
        selector: '.cbi-dynlist',
        text: ' đảm bảo là vn.pool.ntp.org và asia.pool.ntp.org',
        position: 'left'
    },
    {
        selector: '.cbi-button-save',
        text: 'Bước 4: Chọn Apply',
        position: 'top'
    }
];
