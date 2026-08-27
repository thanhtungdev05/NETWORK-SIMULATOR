/**
 * devices/be12000/tooltips/bai1.js
 * Tooltips cho Bài 1: Cấu hình PPPoE
 */

if (!window.TOOLTIPS_BE12000) window.TOOLTIPS_BE12000 = {};

window.TOOLTIPS_BE12000['LAB_BE12000_01'] = [
  {
    selector: '#internet:not(.SelectMenuItem)',
    text: 'Bước 1: Chọn menu Internet',
    position: 'bottom'
  },
  {
    selector: '#internetConfig:not(.selectClass2Menu)',
    text: 'Bước 2: Chọn WAN ở cột trái',
    position: 'right'
  },
  {
    selector: '#ethWanConfig:not(.AEleMenu3Selected)',
    text: 'Bước 3: Chọn WAN ở menu ngang',
    position: 'bottom'
  },
  {
    selector: '#ServList, select[id^="ServList"]',
    text: 'Bước 4: Chọn kết nối INTERNET_TR069',
    position: 'right'
  },
  {
    selector: '#TransType, select[id^="TransType"]',
    text: 'Bước 5: Chọn PPPoE (PPP Transfer Type)',
    position: 'right'
  },
  {
    selector: '#UserName, input[id^="UserName"]',
    text: 'Bước 6: Nhập Username: hnfdl-123456-789',
    position: 'right'
  },
  {
    selector: '#Password, input[id^="Password"]',
    text: 'Bước 7: Nhập Password: d123456',
    position: 'right'
  },
  {
    selector: '#Btn_apply_internet, .Btn_apply, #Btn_Apply, input[value="Apply"], .button1',
    text: 'Bước 8: Bấm Apply để lưu',
    position: 'top'
  }
];
