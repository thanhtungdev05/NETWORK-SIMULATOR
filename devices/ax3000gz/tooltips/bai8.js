/**
 * devices/ax3000gz/tooltips/bai8.js — Tooltip Hướng dẫn cho Bài 8 (AX3000GZ)
 */

if (!window.TOOLTIPS_AX3000GZ) window.TOOLTIPS_AX3000GZ = {};

window.TOOLTIPS_AX3000GZ['LAB_AX3000GZ_08'] = [
    {
        selector: '#topmenu a[href*="/internet"]',
        text: 'Bước 1: Chọn Internet',
        position: 'top'
    },
    {
        selector: '#sidebarmenu a[href*="/internet/security"]',
        text: 'Bước 2: Chọn Security',
        position: 'top'
    },
    {
        selector: 'a[href*="/internet/security/forwards"]',
        text: 'Bước 3: Chọn Port Forwards',
        position: 'bottom'
    },
    {
        selector: 'button.cbi-button-add',
        text: 'Bước 4: Chọn Add để thêm rule mới',
        position: 'top'
    },
    {
        selector: '#modal_field_name',
        text: 'Bước 5: Nhập Name: FPT Telecom',
        position: 'right'
    },
    {
        selector: '#modal_field_proto',
        text: 'Bước 6: Chọn Protocol TCP/UDP',
        position: 'right'
    },
    {
        selector: '#modal_field_src_ip',
        text: 'Bước 7: Điền dãy IP WAN, ví dụ: 21.143.157.184 - 21.143.157.184',
        position: 'right'
    },
    {
        selector: '#modal_field_dest_ip',
        text: 'Bước 8: Điền địa chỉ IP LAN, ví dụ: 192.168.1.5',
        position: 'right'
    },
    {
        selector: '#modal_field_src_dport',
        text: 'Bước 9: Điền port WAN, ví dụ: 8080 - 8080',
        position: 'right'
    },
    {
        selector: '#modal_field_dest_port',
        text: 'Bước 10: Điền port LAN, ví dụ: 8080 - 8080',
        position: 'right'
    },
    {
        selector: '.cbi-modal .cbi-button-save, #modal_overlay .cbi-button-save',
        text: 'Bước 11: Chọn Apply',
        position: 'top'
    }
];
