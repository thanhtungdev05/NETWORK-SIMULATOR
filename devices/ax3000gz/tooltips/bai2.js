/**
 * devices/ax3000gz/tooltips/bai2.js — Tooltip Hướng dẫn cho Bài 2 (AX3000GZ)
 */

if (!window.TOOLTIPS_AX3000GZ) window.TOOLTIPS_AX3000GZ = {};

window.TOOLTIPS_AX3000GZ['ax3gz-bai2'] = [
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
        selector: 'h3:contains("WLAN Global Configuration")',
        text: 'Bước 1: Chọn WLAN Global Configuration',
        position: 'top'
    },
    {
        selector: '#cbi-json-WLANBasicAd0 .cbi-button-edit',
        text: 'Bước 2a: Chọn Edit WLAN (2.4G)',
        position: 'right'
    },
    {
        selector: '.cbi-modal:has([data-name="Standard"]) .cbi-button-save, #modal_overlay:has([data-name="Standard"]) .cbi-button-save',
        text: 'Chọn Apply',
        position: 'top'
    },
    {
        selector: '#cbi-json-WLANBasicAd1 .cbi-button-edit',
        text: 'Bước 2b: Chọn Edit WLAN (5G)',
        position: 'right'
    },
    {
        selector: 'h3:contains("WLAN SSID Configuration")',
        text: 'Bước 3: Chọn WLAN SSID Configuration',
        position: 'bottom'
    },
    {
        selector: '#cbi-json-WLANSSID0 .cbi-button-edit',
        text: 'Bước 4: Chọn Edit SSID1(2.4G)',
        position: 'top'
    },
    {
        selector: '#modal_field_SSID',
        text: 'Bước 5: Nhập SSID Name: FPT Telecom',
        position: 'right'
    },
    {
        selector: '#modal_field_KeyPassphrase',
        text: 'Bước 6: Nhập Password WPA Passphrase',
        position: 'right'
    },
    {
        selector: '.cbi-modal:has([data-name="SSID"]) .cbi-button-save, #modal_overlay:has([data-name="SSID"]) .cbi-button-save',
        text: 'Bước 7: Apply để lưu cấu hình',
        position: 'right'
    }
];
