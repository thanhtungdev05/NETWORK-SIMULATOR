/**
 * step_by_step/ac1000f/bai3.js — Hướng dẫn Bài 3: Cấu hình IP LAN cho ONT AC1000F
 */
window.STEPS_AC1000F = window.STEPS_AC1000F || {};

window.STEPS_AC1000F['ac1-bai3'] = [
  { selector: 'a[onclick*="change_bg2"]', text: 'Bước 1: Chọn tab Network', position: 'top' },
  { selector: 'a[href*="home_lan.asp"]', text: 'Bước 2: Chọn LAN', position: 'top' },
  { selector: 'input[name="uiViewIPAddr"]', text: 'Bước 1: Nhập IP LAN (ví dụ: 192.168.10.1)', position: 'right' },
  { selector: 'input[name="uiViewNetMask"]', text: 'Bước 2: Nhập Subnet Mask (255.255.255.0)', position: 'right' },
  { selector: 'input[name="SaveBtn"], input[value="Save"]', text: 'Bước 3: Bấm Save để lưu địa chỉ IP LAN', position: 'right' }
];
