/**
 * devices/ac1000f/tooltips/bai4.js — Tooltip Hướng dẫn cho Bài 4: Cấu hình DNS
 */

if (!window.TOOLTIPS_AC1000F) window.TOOLTIPS_AC1000F = {};

window.TOOLTIPS_AC1000F['LAB_AC1000F_04'] = [
  // Bước 1: Chọn tab Network
  {
    selector: 'a[onclick*="change_bg2"]',
    text: 'Bước 1: chọn Network',
    position: 'top'
  },
  // Bước 2: Chọn LAN
  {
    selector: 'a[href*="home_lan.asp"]',
    text: 'Bước 2: chọn LAN',
    position: 'bottom'
  },
  // Bước 3: Đảm bảo chọn DNS Relay là Manually
  {
    selector: 'select[name="dnsTypeRadio"], select[name="dnsRelay"]',
    text: 'Bước 3: chọn Manually',
    position: 'right'
  },
  // Bước 4: Nhập Primary DNS
  {
    selector: 'input[name="PrimaryDns"], input[name="PrimaryDNS"]',
    text: 'Bước 4: nhập Primary DNS, ví dụ: 8.8.8.8',
    position: 'right'
  },
  // Bước 5: Nhập Secondary DNS
  {
    selector: 'input[name="SecondDns"], input[name="SecondaryDNS"]',
    text: 'Bước 5: nhập Secondary DNS, ví dụ: 8.8.4.4',
    position: 'right'
  },
  // Bước 6: Chọn SAVE
  {
    selector: 'input[name="SaveBtn"], input[value="Save"], input[name="save"], #save, #btnSave, .button1',
    text: 'Bước 6: chọn Save để lưu cấu hình',
    position: 'right'
  }
];
