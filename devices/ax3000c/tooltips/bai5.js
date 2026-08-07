/**
 * devices/ax3000c/tooltips/bai5.js — Tooltip Hướng dẫn cho Bài 5: Cấu hình NAT Port (AX3000C)
 */

if (!window.TOOLTIPS_AX3000C) window.TOOLTIPS_AX3000C = {};

window.TOOLTIPS_AX3000C['ax3c-bai5'] = [
    // 1. Chọn Network ở Menu bên trái (chỉ hiện khi chưa ở trang Port Forwarding)
    {
        selector: '.el-submenu__title:contains("Network")',
        text: 'Chọn Network',
        position: 'right',
        hideOnPage: 'portfwd'
    },
    // 2. Chọn Access ở Submenu bên trái (chỉ hiện khi chưa ở trang Port Forwarding)
    {
        selector: '.el-submenu__title:contains("Access")',
        text: 'Chọn Access',
        position: 'right',
        hideOnPage: 'portfwd'
    },
    // 3. Chọn Port Forwarding ở Submenu bên trái (chỉ hiện khi chưa ở trang Port Forwarding)
    {
        selector: '.el-menu-item:contains("Port Forwarding"), [index*="/network/portfwd"]',
        text: 'Chọn Port Forwarding',
        position: 'right',
        hideOnPage: 'portfwd'
    },
    // Bước 1: chọn Enable (chỉ hiện khi ở trang Port Forwarding)
    {
        selector: '.sw input[type="checkbox"], .sw, table input[type="checkbox"]',
        text: 'Bước 1: chọn Enable',
        position: 'left',
        page: 'portfwd'
    },
    // Bước 2: chọn TCP/UDP (vị trí top để tránh đè ngang)
    {
        selector: 'table select, td select',
        text: 'Bước 2: chọn TCP/UDP',
        position: 'top',
        page: 'portfwd'
    },
    // Bước 3: nhập External port ví dụ: 8080 (vị trí bottom để so le)
    {
        selector: 'table tr td:nth-child(3) input, input[placeholder*="8080"]',
        text: 'Bước 3: nhập External port ví dụ: 8080',
        position: 'bottom',
        page: 'portfwd'
    },
    // Bước 4: chọn thiết bị ví dụ: 192.168.100.20 (vị trí top để so le)
    {
        selector: 'table tr td:nth-child(4) select, table tr td:nth-child(4) input, input[placeholder*="192.168.100"]',
        text: 'Bước 4: chọn thiết bị ví dụ: 192.168.100.20',
        position: 'top',
        page: 'portfwd'
    },
    // Bước 5: nhập Internal port ví dụ: 80 (vị trí bottom để so le)
    {
        selector: 'table tr td:nth-child(5) input, input[placeholder*="80"]',
        text: 'Bước 5: nhập Internal port ví dụ: 80',
        position: 'bottom',
        page: 'portfwd'
    },
    // Bước 1: chọn Add (chỉ gắn duy nhất nút Add phía trên bảng)
    {
        selector: '.card .bd button:contains("Add"), button[onclick*="simAdd"]',
        text: 'Bước 1: chọn Add',
        position: 'left',
        page: 'portfwd'
    },
    // Bước 7: chọn Apply (chỉ gắn duy nhất nút Apply phía dưới bên phải)
    {
        selector: '.actions button.apply, button[onclick*="simState.save"]',
        text: 'Bước 7: chọn Apply',
        position: 'bottom',
        page: 'portfwd'
    }
];
