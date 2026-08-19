/**
 * devices/ax3000gz/tooltips/bai1.js — Tooltip Hướng dẫn cho Bài 1: Cấu hình ONT (AX3000GZ)
 */

if (!window.TOOLTIPS_AX3000GZ) window.TOOLTIPS_AX3000GZ = {};

window.TOOLTIPS_AX3000GZ['LAB_AX3000GZ_01'] = [
    {
        selector: '#WANUrl, li:not(.active) > a[href$="/internet/wan"]',
        text: 'Chọn WAN',
        position: 'right'
    },
    {
        selector: '#widget\\.cbid\\.network\\.wan\\.username',
        text: 'Bước 1: nhập tên hợp đồng ví dụ: fpt',
        position: 'right'
    },
    {
        selector: '#widget\\.cbid\\.network\\.wan\\.password',
        text: 'Bước 2: nhập Password, ví dụ: fpt12345',
        position: 'right'
    },
    {
        selector: '.cbi-button-save',
        text: 'Bước 3: chọn Apply',
        position: 'bottom'
    }
];
