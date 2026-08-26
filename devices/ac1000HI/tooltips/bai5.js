/**
 * devices/ac1000hi/tooltips/bai5.js
 */

if (!window.TOOLTIPS_AC1000HI) window.TOOLTIPS_AC1000HI = {};

window.TOOLTIPS_AC1000HI['LAB_AC1000HI_05'] = [
  {
    selector: 'a[onclick*="change_basic"]',
    text: 'Bước 1: Chọn tab Network',
    position: 'top'
  },
  {
    selector: 'a[href*="home_lan.asp"]',
    text: 'Bước 2: Chọn LAN',
    position: 'top'
  },
  {
    page: 'home_lan.asp',
    selector: 'input[name="dhcpTypeRadio"][value="1"]',
    text: 'Bước 3: Chọn Enable DHCP',
    position: 'right'
  },
  {
    page: 'home_lan.asp',
    selector: 'input[name="StartIp"]',
    text: 'Bước 4: Nhập Start IP (VD: 192.168.1.2)',
    position: 'right',
    expected: '192.168.1.2'
  },
  {
    page: 'home_lan.asp',
    selector: 'input[name="PoolSize"]',
    text: 'Bước 5: Nhập IP Pool Count (VD: 253)',
    position: 'right',
    expected: '253'
  },
  {
    page: 'home_lan.asp',
    selector: 'input[name="dhcp_LeaseTime"]',
    text: 'Bước 6: Nhập Lease Time (VD: 86400)',
    position: 'right',
    expected: '86400'
  },
  {
    page: 'home_lan.asp',
    selector: 'input[name="SaveBtn"], input[value="Save"], input[name="save"], .button1',
    text: 'Bước 7: Chọn Save & Apply để lưu cấu hình',
    position: 'right'
  }
];
