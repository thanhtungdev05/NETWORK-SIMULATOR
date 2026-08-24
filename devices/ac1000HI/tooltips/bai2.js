/**
 * devices/ac1000hi/tooltips/bai2.js
 */

if (!window.TOOLTIPS_AC1000HI) window.TOOLTIPS_AC1000HI = {};

window.TOOLTIPS_AC1000HI['LAB_AC1000HI_02'] = [
  // --- CHUNG ---
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

  // --- 2.4G (Chỉ hiện ở trang home_wireless.asp) ---
  {
    page: 'home_wireless.asp',
    selector: 'input[name="wlan_APenable"][value="1"], input[name="wlan_APenable"]',
    text: 'Bước 3: Chọn Enable',
    position: 'top'
  },
  {
    page: 'home_wireless.asp',
    selector: 'select[name="WirelessMode"]',
    text: 'Bước 4: Đảm bảo đã chọn 802.11b+g+n',
    position: 'right',
    forcePosition: true
  },
  {
    page: 'home_wireless.asp',
    selector: 'select[name="Countries_Channels"]',
    text: 'Bước 5: Đảm bảo chọn VIETNAM và Auto',
    position: 'bottom'
  },
  {
    page: 'home_wireless.asp',
    selector: 'select[name="WLANChannelBandwidth"]',
    text: 'Bước 6: Đảm bảo đã chọn 40 MHz',
    position: 'right',
    forcePosition: true
  },
  {
    page: 'home_wireless.asp',
    selector: 'input[name="ESSID"], input[name="ssid"]',
    text: 'Bước 7: Nhập tên Wifi bạn muốn, ví dụ: FPT Telecom-7EA8',
    position: 'right',
    forcePosition: true,
    expected: 'FPT Telecom-7EA8'
  },
  {
    page: 'home_wireless.asp',
    selector: 'input[name="PreSharedKey1"], input[name="PreSharedKey2"], input[name="PreSharedKey3"], input[name*="PreSharedKey"]',
    text: 'Bước 8: Nhập mật khẩu bạn muốn, ví dụ: 00032934',
    position: 'right',
    forcePosition: true,
    expected: '00032934'
  },
  {
    page: 'home_wireless.asp',
    selector: 'input[name="SaveBtn"], input[value="Save"], input[name="save"], #save, #btnSave, .button1',
    text: 'Bước 9: Chọn Save & Apply cho 2.4G',
    position: 'right',
    forcePosition: true
  },

  // --- 5G (Tiếp nối, menu luôn hiện) ---
  {
    selector: 'a[href*="home_wireless_5g.asp"]',
    text: 'Bước 10: Chọn sang Wireless 5G',
    position: 'bottom'
  },

  // (Chỉ hiện ở trang home_wireless_5g.asp)
  {
    page: 'home_wireless_5g.asp',
    selector: 'input[name="wlan_APenable"][value="1"], input[name="wlan_APenable"]',
    text: 'Bước 11: Chọn Enable',
    position: 'top'
  },
  {
    page: 'home_wireless_5g.asp',
    selector: 'select[name="WirelessMode"]',
    text: 'Bước 12: Đảm bảo đã chọn Auto',
    position: 'right',
    forcePosition: true
  },
  {
    page: 'home_wireless_5g.asp',
    selector: 'select[name="Countries_Channels"]',
    text: 'Bước 13: Đảm bảo chọn VIETNAM và Auto',
    position: 'bottom'
  },
  {
    page: 'home_wireless_5g.asp',
    selector: 'select[name="WLANChannelBandwidth"]',
    text: 'Bước 14: Đảm bảo đã chọn Auto',
    position: 'right',
    forcePosition: true
  },
  {
    page: 'home_wireless_5g.asp',
    selector: 'input[name="ESSID"], input[name="ssid"]',
    text: 'Bước 15: Nhập tên Wifi 5G (VD: FPT Telecom-7EA8)',
    position: 'right',
    forcePosition: true
  },
  {
    page: 'home_wireless_5g.asp',
    selector: 'input[name="PreSharedKey1"], input[name="PreSharedKey2"], input[name="PreSharedKey3"], input[name*="PreSharedKey"]',
    text: 'Bước 16: Nhập mật khẩu 5G (VD: 00032934)',
    position: 'right',
    forcePosition: true
  },
  {
    page: 'home_wireless_5g.asp',
    selector: 'input[name="SaveBtn"], input[value="Save"], input[name="save"], #save, #btnSave, .button1',
    text: 'Bước 17: Chọn Save & Apply cho 5G',
    position: 'right',
    forcePosition: true
  }
];
