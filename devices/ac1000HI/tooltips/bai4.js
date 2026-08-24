/**
 * devices/ac1000hi/tooltips/bai4.js
 */

if (!window.TOOLTIPS_AC1000HI) window.TOOLTIPS_AC1000HI = {};

window.TOOLTIPS_AC1000HI['LAB_AC1000HI_04'] = [
  {
    selector: 'a[onclick*="change_access"]',
    text: 'Bước 1: Chọn tab Access',
    position: 'top'
  },
  {
    selector: 'a[href*="access_ddns.asp"]',
    text: 'Bước 2: Chọn DDNS',
    position: 'top'
  },
  {
    page: 'access_ddns.asp',
    selector: 'input[name="Enable_DyDNS"][value="Yes"]',
    text: 'Bước 3: Chọn Yes để bật DDNS',
    position: 'right'
  },
  {
    page: 'access_ddns.asp',
    selector: 'input[name="sysDNSHost"]',
    text: 'Bước 4: Nhập Tên Host (ac1000HI.ddns.net)',
    position: 'left',
    expected: 'ac1000HI.ddns.net'
  },
  {
    page: 'access_ddns.asp',
    selector: 'input[name="sysDNSUser"]',
    text: 'Bước 5: Nhập Username (truongconghau04111994@gmail.com)',
    position: 'left',
    expected: 'truongconghau04111994@gmail.com'
  },
  {
    page: 'access_ddns.asp',
    selector: 'input[name="sysDNSPassword"]',
    text: 'Bước 6: Nhập Password (fpt12345)',
    position: 'left',
    expected: 'fpt12345'
  },
  {
    page: 'access_ddns.asp',
    selector: 'input[name="SaveBtn"], input[value="Save"], input[name="save"], .button1',
    text: 'Bước 7: Chọn Save để lưu cấu hình',
    position: 'left'
  }
];
