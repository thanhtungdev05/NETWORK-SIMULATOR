/**
 * devices/ac1000f/tooltips/bai6.js — Tooltip Hướng dẫn cho Bài 6: Cấu hình Remote Web
 */

if (!window.TOOLTIPS_AC1000F) window.TOOLTIPS_AC1000F = {};

window.TOOLTIPS_AC1000F['LAB_AC1000F_06'] = [
    // Bước 1: Chọn Advanced ở Header
    {
        selector: 'a[onclick*="change_bg3"]',
        text: 'Bước 1: chọn Advanced',
        position: 'top'
    },
    // Bước 2: Chọn Firewall ở Menu bên trái (Nav frame)
    {
        selector: 'a[href*="adv_firewall.asp"]',
        text: 'Bước 2: chọn Firewall',
        position: 'bottom'
    },
    // Bước 3: Chọn Enable ở mục Remote Web
    {
        selector: 'input[name="wanAccessLanWebRadio"][value="Yes"], input[name="wanAccessLanWebRadio"]',
        text: 'Bước 3: chọn Enable',
        position: 'top'
    },
    // Bước 4: Nhập Username
    {
        selector: 'input[name="remote_username"]',
        text: 'Bước 4: nhập Username, ví dụ: admin99',
        position: 'right'
    },
    // Bước 5: Nhập Password
    {
        selector: 'input[name="remote_password"]',
        text: 'Bước 5: nhập Password, ví dụ ftc12345',
        position: 'right'
    },
    // Bước 6: Chọn Save để lưu cấu hình
    {
        selector: 'input[name="SaveBtn"], input[value="Save"], input[onclick*="fwSave"], #save, #btnSave, .button1',
        text: 'Bước 6: chọn Save để lưu cấu hình',
        position: 'right'
    }
];
