/**
 * devices/ac1000f/tooltips/bai2.js — Tooltip Hướng dẫn cho Bài 2: Cấu hình mạng Wi-Fi
 */

if (!window.TOOLTIPS_AC1000F) window.TOOLTIPS_AC1000F = {};

window.TOOLTIPS_AC1000F['ac1-bai2'] = [
  // Tab Network ở Header
  {
    selector: 'a[onclick*="change_bg2"]',
    text: 'Network',
    position: 'top'
  },
  // Bước 2a: Chọn Wireless 2.4G ở Menu bên trái
  {
    selector: 'a[href*="home_wireless.asp"]',
    text: 'Bước 2a: chọn Wireless 2.4G',
    position: 'top'
  },
  // Bước 2b: Chọn Wireless 5G ở Menu bên trái
  {
    selector: 'a[href*="home_wireless_5g.asp"]',
    text: 'Bước 2b: chọn Wireless 5G',
    position: 'bottom'
  },
  // Bước 3: Đảm bảo đã chọn Enable
  {
    selector: 'input[name="wlan_APenable"][value="1"], input[name="wlan_APenable"]',
    text: 'Bước 3: đảm bảo đã chọn Enable',
    position: 'right'
  },
  // Bước 4: Đảm bảo đã chọn 802.11b+g+n
  {
    selector: 'select[name="WirelessMode"]',
    text: 'Bước 4: đảm bảo đã chọn 802.11b+g+n',
    position: 'right'
  },
  // Bước 5: Đảm bảo chọn VIETNAM và Auto
  {
    selector: 'select[name="Countries_Channels"]',
    text: 'Bước 5: đảm bảo chọn VIETNAM và Auto',
    position: 'bottom'
  },
  // Bước 6: Đảm bảo đã chọn 40 MHz
  {
    selector: 'select[name="WLANChannelBandwidth"]',
    text: 'Bước 6: đảm bảo đã chọn 40 MHz',
    position: 'right'
  },
  // Bước 7: Nhập tên Wifi bạn muốn
  {
    selector: 'input[name="ESSID"], input[name="ssid"]',
    text: 'Bước 7: nhập tên Wifi bạn muốn ví dụ: FPT Telecom-7EA8',
    position: 'right'
  },
  // Bước 8: Nhập mật khẩu bạn muốn
  {
    selector: 'input[name="PreSharedKey1"], input[name="PreSharedKey2"], input[name="PreSharedKey3"], input[name*="PreSharedKey"]',
    text: 'Bước 8: nhập mật khẩu bạn muốn ví dụ: 00032934',
    position: 'right'
  },
  // Bước 9: Chọn Save
  {
    selector: 'input[name="SaveBtn"], input[value="Save"], input[name="save"], #save, #btnSave, .button1',
    text: 'Bước 9: chọn Save',
    position: 'right'
  }
];
