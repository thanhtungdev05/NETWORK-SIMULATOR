/**
 * devices/ax3000gz/tooltips/bai9.js — Tooltip Hướng dẫn cho Bài 9 (AX3000GZ)
 */

if (!window.TOOLTIPS_AX3000GZ) window.TOOLTIPS_AX3000GZ = {};

window.TOOLTIPS_AX3000GZ['ax3gz-bai9'] = [
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
        selector: 'a[href*="/internet/security/filterCriteria"]',
        text: 'Bước 3: Chọn Filter Criteria',
        position: 'bottom'
    },
    {
        selector: 'h3:contains("MAC Filter")',
        text: 'Bước 4: Tại mục MAC Filter',
        position: 'top'
    },
    {
        selector: '#cbi-firewall-rule[data-idref="82f281a2"] button.cbi-button-add, h3:contains("MAC Filter") + .cbi-map-descr + .cbi-section button.cbi-button-add',
        text: 'Bước 5: Chọn Add để thêm rule MAC Filter',
        position: 'top'
    },
    {
        selector: '#modal_field_enabled',
        text: 'Bước 6: Chọn On',
        position: 'right'
    },
    {
        selector: '#modal_field_name',
        text: 'Bước 7: Đặt tên MAC Filter, ví dụ: Black list',
        position: 'right'
    },
    {
        selector: '#modal_field_src_mac',
        text: 'Bước 8: Nhập địa chỉ MAC muốn chặn, ví dụ: aa:bb:cc:11:22:33',
        position: 'right'
    },
    {
        selector: '#modal_field_start_time',
        text: 'Bước 9: Chọn thời gian bắt đầu, ví dụ: 08:00:00 AM',
        position: 'right'
    },
    {
        selector: '#modal_field_stop_time',
        text: 'Bước 10: Chọn thời gian kết thúc, ví dụ: 05:00:00 PM',
        position: 'right'
    },
    {
        selector: '#modal_field_weekdays',
        text: 'Bước 11: Chọn ngày trong tuần, ví dụ: thứ 2, 3, 4, 5, 6',
        position: 'right'
    },
    {
        selector: '.cbi-modal .cbi-button-save, #modal_overlay .cbi-button-save',
        text: 'Bước 12: Chọn Apply',
        position: 'top'
    }
];
