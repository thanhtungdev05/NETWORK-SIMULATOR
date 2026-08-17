/**
 * devices/ac1000f/tooltips/bai3.js — Tooltip Hướng dẫn cho Bài 3: Cấu hình IP LAN
 */

if (!window.TOOLTIPS_AC1000F) window.TOOLTIPS_AC1000F = {};

window.TOOLTIPS_AC1000F['ac1-bai3'] = [
  // Tab Network ở Header
  {
    selector: 'a[onclick*="change_bg2"]',
    text: 'Network',
    position: 'top'
  },
  // Bước 2: Nút LAN ở Menu bên trái (Nav frame)
  {
    selector: 'a[href*="home_lan.asp"]',
    text: 'Bước 2: chọn LAN',
    position: 'bottom'
  },
  // Bước 3: Ô nhập IP Address (Main frame)
  {
    selector: 'input[name="uiViewIPAddr"], input[name="ipAddress"], #ipAddress',
    text: 'Bước 3: nhập IP LAN theo yêu cầu, ví dụ 192.168.1.1',
    position: 'right'
  },
  // Bước 4: Ô nhập IP Subnet Mask (Main frame)
  {
    selector: 'input[name="uiViewNetMask"], input[name="subnetMask"]',
    text: 'Bước 4: nhập IP Subnet Mask thích hợp, ví dụ 255.255.255.0',
    position: 'right'
  },
  // Bước 5: Đảm bảo chọn Enable ở mục DHCP
  {
    selector: 'input[name="dhcpTypeRadio"][value="1"], input[name="dhcpTypeRadio"]',
    text: 'Bước 5: đảm bảo chọn Enable',
    position: 'right'
  },
  // Bước 6: Ô nhập Start IP
  {
    selector: 'input[name="StartIp"], input[name="startIP"]',
    text: 'Bước 6: nhập IP đầu tiên, ví dụ: 192.168.1.2',
    position: 'right'
  },
  // Bước 7: Ô nhập End IP
  {
    selector: 'input[name="EndIp"], input[name="endIP"]',
    text: 'Bước 7: nhập IP cuối, ví dụ: 192.168.1.254',
    position: 'right'
  },
  // Bước 8: Ô nhập Lease Time
  {
    selector: 'input[name="dhcp_LeaseTime"], input[name="leaseTime"]',
    text: 'Bước 8: nhập 86400',
    position: 'bottom'
  },
  // Bước 9: Chọn Automatically ở mục DNS Relay
  {
    selector: 'select[name="dnsTypeRadio"], select[name="dnsRelay"]',
    text: 'Bước 9: chọn Automatically',
    position: 'right'
  },
  // Bước 10: Chọn SAVE
  {
    selector: 'input[name="SaveBtn"], input[value="Save"], input[name="save"], #save, #btnSave, .button1',
    text: 'Bước 10: chọn SAVE',
    position: 'right'
  }
];
