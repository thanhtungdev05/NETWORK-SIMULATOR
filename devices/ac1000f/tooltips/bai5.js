/**
 * devices/ac1000f/tooltips/bai5.js — Tooltip Hướng dẫn cho Bài 5: Cấu hình DHCP
 */

if (!window.TOOLTIPS_AC1000F) window.TOOLTIPS_AC1000F = {};

window.TOOLTIPS_AC1000F['LAB_AC1000F_05'] = [
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
  // Bước 3: IP Address
  {
    selector: 'input[name="uiViewIPAddr"], input[name="ipAddress"], #ipAddress',
    text: 'Bước 3: nhập IP Address, ví dụ 192.168.1.1',
    position: 'right',
    expected: '192.168.1.1'
  },
  // Bước 4: IP Subnet Mask
  {
    selector: 'input[name="uiViewNetMask"], input[name="subnetMask"]',
    text: 'Bước 4: nhập IP Subnet Mask, ví dụ 255.255.255.0',
    position: 'right',
    expected: '255.255.255.0'
  },
  // Bước 5: Đảm bảo chọn Enable ở mục DHCP
  {
    selector: 'input[name="dhcpTypeRadio"][value="1"], input[name="dhcpTypeRadio"]',
    text: 'Bước 5: đảm bảo chọn Enable cho DHCP Server',
    position: 'right'
  },
  // Bước 6: Ô nhập Lease Time
  {
    selector: 'input[name="dhcp_LeaseTime"], input[name="leaseTime"]',
    text: 'Bước 6: nhập Lease Time là 86400',
    position: 'bottom',
    expected: '86400'
  },
  // Bước 7: Chọn SAVE
  {
    selector: 'input[name="SaveBtn"], input[value="Save"], input[name="save"], #save, #btnSave, .button1',
    text: 'Bước 7: chọn SAVE',
    position: 'right'
  }
];
