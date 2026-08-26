/**
 * devices/ac1000hi/tooltips/bai3.js
 */

if (!window.TOOLTIPS_AC1000HI) window.TOOLTIPS_AC1000HI = {};

window.TOOLTIPS_AC1000HI['LAB_AC1000HI_03'] = [
  {
    selector: 'a[onclick*="change_basic"]',
    text: 'Bước 1: Chọn tab Network',
    position: 'top'
  },
  {
    selector: 'a[href*="home_wireless.asp"]',
    text: 'Bước 2: Chọn Wireless 2.4G',
    position: 'top'
  },
  {
    page: 'home_wireless.asp',
    hideOnPage: 'home_wireless_5g.asp',
    selector: 'select[name="SSID_INDEX"]',
    text: 'Bước 3: Đảm bảo chọn SSID index là 2',
    position: 'right',
    expected: '1'
  },
  {
    page: 'home_wireless.asp',
    hideOnPage: 'home_wireless_5g.asp',
    selector: 'input[name="ESSID"], input[name="ssid"]',
    text: 'Bước 4: Nhập tên Wifi IoT (VD: FPT Telecom_IoT)',
    position: 'left',
    expected: 'FPT Telecom_IoT'
  },
  {
    page: 'home_wireless.asp',
    hideOnPage: 'home_wireless_5g.asp',
    selector: 'input[name="PreSharedKey1"], input[name="PreSharedKey2"], input[name="PreSharedKey3"], input[name*="PreSharedKey"]',
    text: 'Bước 5: Nhập mật khẩu (VD: fpt12345)',
    position: 'left',
    expected: 'fpt12345'
  },
  {
    page: 'home_wireless.asp',
    hideOnPage: 'home_wireless_5g.asp',
    selector: 'input[name="SaveBtn"], input[value="Save"], input[name="save"], #save, #btnSave, .button1',
    text: 'Bước 6: Chọn Save & Apply',
    position: 'left'
  }
];
