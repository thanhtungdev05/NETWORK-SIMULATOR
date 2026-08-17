/**
 * devices/ac1000f/tooltips/bai1.js — Tooltip Hướng dẫn cho Bài 1: Cấu hình PPPoE
 */

if (!window.TOOLTIPS_AC1000F) window.TOOLTIPS_AC1000F = {};

window.TOOLTIPS_AC1000F['ac1-bai1'] = [
  // Nút chọn Network ở Menu trên cùng (Frame header)
  {
    selector: 'a[onclick*="change_bg2"]',
    text: 'Network',
    position: 'top'
  },
  // Nút chọn Internet ở Menu bên trái (Frame nav)
  {
    selector: 'a[href*="home_wan"]',
    text: 'Internet',
    position: 'top'
  },
  // Bước 1: Ô nhập PPPoE Username (Frame main)
  {
    selector: 'input[name="wan_PPPUsername"], input[name="pppUserName"], input[name="username"], #username',
    text: 'Bước 1: nhập tên khách hàng ví dụ: Sgfdl-210208-218',
    position: 'right',
    expected: 'Sgfdl-210208-218'
  },
  // Bước 2: Ô nhập PPPoE Password (Frame main)
  {
    selector: 'input[name="wan_PPPPassword"], input[name="pppPassword"], input[name="password"], #password',
    text: 'Bước 2: nhập mật mã khách hàng ví dụ: fpt12345',
    position: 'right',
    expected: 'fpt12345'
  },
  // Bước 3: Nút Save (Frame main)
  {
    selector: 'input[name="SaveBtn"], input[value="Save"], input[name="save"], #save, #btnSave, .button1',
    text: 'Bước 3: chọn Save để lưu cấu hình',
    position: 'right'
  }
];
