/**
 * devices/ac1000hi/tooltips/bai1.js
 */

if (!window.TOOLTIPS_AC1000HI) window.TOOLTIPS_AC1000HI = {};

window.TOOLTIPS_AC1000HI['LAB_AC1000HI_01'] = [
  {
    selector: 'a[onclick*="change_basic"]',
    text: 'Bước 1 Chọn: Network',
    position: 'top'
  },
  {
    selector: 'a[href*="home_wan"]',
    text: 'Bước 2 Chọn: Internet',
    position: 'top'
  },
  {
    selector: 'input[name="wan_PPPUsername"], input[name="pppUserName"], input[name="username"], #username',
    text: 'Bước 3 Nhập tên khách hàng: Sgfdl-210208-218',
    position: 'right',
    expected: 'Sgfdl-210208-218'
  },
  {
    selector: 'input[name="wan_PPPPassword"], input[name="pppPassword"], input[name="password"], #password',
    text: 'Bước 4 Nhập mật mã khách hàng: fpt12345',
    position: 'right',
    expected: 'fpt12345'
  },
  {
    selector: 'input[name="SaveBtn"], input[value="Save"], input[name="save"], #save, #btnSave, .button1',
    text: 'Bước 5: Chọn Save để lưu cấu hình',
    position: 'right'
  }
];
