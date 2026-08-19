/**
 * devices/ax3000gz/tooltips/bai6.js — Tooltip Hướng dẫn cho Bài 6 (AX3000GZ)
 */

if (!window.TOOLTIPS_AX3000GZ) window.TOOLTIPS_AX3000GZ = {};

window.TOOLTIPS_AX3000GZ['LAB_AX3000GZ_06'] = [
    {
        selector: '#topmenu a[href*="/internet"]',
        text: 'Bước 1: Chọn Internet',
        position: 'top'
    },
    {
        selector: '#sidebarmenu a[href*="/internet/ddns"]',
        text: 'Bước 2: Chọn DDNS',
        position: 'top'
    },
    {
        selector: '#cbi-ddns-myddns_ipv4-service_name select',
        text: 'Bước 3: Chọn No-IP',
        position: 'right'
    },
    {
        selector: '#cbi-ddns-myddns_ipv4-enabled input[type="checkbox"]',
        text: 'Bước 4: Check vào DDNS để bật',
        position: 'right'
    },
    {
        selector: '#cbi-ddns-myddns_ipv4-username input',
        text: 'Bước 5: Nhập tên DDNS, ví dụ: binhnt3@fpt.net',
        position: 'right'
    },
    {
        selector: '#cbi-ddns-myddns_ipv4-password input[type="password"]',
        text: 'Bước 6: Nhập mật khẩu DDNS, ví dụ: fpt12345',
        position: 'right'
    },
    {
        selector: '#cbi-ddns-myddns_ipv4-lookup_host input',
        text: 'Bước 7: Nhập tên miền đã đăng ký, ví dụ: test23122021.ddns.net',
        position: 'right'
    },
    {
        selector: '.cbi-button-save',
        text: 'Bước 8: Chọn Apply',
        position: 'top'
    }
];
