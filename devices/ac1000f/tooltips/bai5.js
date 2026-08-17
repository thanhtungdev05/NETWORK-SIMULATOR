/**
 * devices/ac1000f/tooltips/bai5.js — Tooltip Hướng dẫn cho Bài 5: Cấu hình tên miền động DDNS
 */

if (!window.TOOLTIPS_AC1000F) window.TOOLTIPS_AC1000F = {};

window.TOOLTIPS_AC1000F['LAB_AC1000F_05'] = [
    // Bước 1: Chọn Access ở Header
    {
        selector: 'a[onclick*="change_bg4"]',
        text: 'Bước 1: chọn Access',
        position: 'top'
    },
    // Bước 2: Chọn DDNS ở Menu bên trái (Nav frame)
    {
        selector: 'a[href*="access_ddns.asp"]',
        text: 'Bước 2: chọn DDNS',
        position: 'top'
    },
    // Bước 3: Chọn Enable ở mục Dynamic DNS
    {
        selector: 'input[name="Enable_DyDNS"][value="Yes"], input[name="Enable_DyDNS"]',
        text: 'Bước 3: chọn Enable',
        position: 'top'
    },
    // Bước 4: Chọn www.noip.com ở mục Service Provider
    {
        selector: 'select[name="ddns_ServerName"]',
        text: 'Bước 4: chọn www.noip.com',
        position: 'right'
    },
    // Bước 5: Nhập tên Host
    {
        selector: 'input[name="sysDNSHost"]',
        text: 'Bước 5: nhập tên Host, ví dụ: ac1000f.ddns.net',
        position: 'right'
    },
    // Bước 6: Nhập Username
    {
        selector: 'input[name="sysDNSUser"]',
        text: 'Bước 6: nhập Username, ví dụ: truongconghau04111994@gmail.com',
        position: 'right'
    },
    // Bước 7: Nhập Password
    {
        selector: 'input[name="sysDNSPassword"]',
        text: 'Bước 7: nhập Password, ví dụ: ftc12345',
        position: 'right'
    },
    // Bước 8: Chọn Save để lưu cấu hình
    {
        selector: 'input[name="SaveBtn"], input[value="Save"], input[name="save"], #save, #btnSave, .button1',
        text: 'Bước 8: chọn Save để lưu cấu hình',
        position: 'right'
    }
];
