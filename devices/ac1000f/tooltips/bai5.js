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
  // Bước 3: Đảm bảo chọn Enable ở mục DHCP
  {
    selector: 'input[name="dhcpTypeRadio"][value="1"], input[name="dhcpTypeRadio"]',
    text: 'Bước 3: đảm bảo chọn Enable cho DHCP Server',
    position: 'right'
  },
  // Bước 4: Ô nhập Start IP
  {
    selector: 'input[name="StartIp"], input[name="startIP"]',
    text: 'Bước 4: nhập IP bắt đầu, ví dụ: 192.168.1.2',
    position: 'right'
  },
  // Bước 5: Ô nhập End IP
  {
    selector: 'input[name="EndIp"], input[name="endIP"]',
    text: 'Bước 5: nhập IP kết thúc, ví dụ: 192.168.1.254',
    position: 'right'
  },
  // Bước 6: Ô nhập Lease Time
  {
    selector: 'input[name="dhcp_LeaseTime"], input[name="leaseTime"]',
    text: 'Bước 6: nhập Lease Time là 86400',
    position: 'bottom'
  },
  // Bước 7: Chọn SAVE
  {
    selector: 'input[name="SaveBtn"], input[value="Save"], input[name="save"], #save, #btnSave, .button1',
    text: 'Bước 7: chọn SAVE',
    position: 'right'
  }
];
