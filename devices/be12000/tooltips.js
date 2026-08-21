/**
 * devices/be12000/tooltips.js — Tooltips Hướng dẫn từng bước cho BE12000 (ZTE F8728D)
 */

if (!window.TOOLTIPS_BE12000) window.TOOLTIPS_BE12000 = {};

// Hướng dẫn đăng nhập chung
window.TOOLTIPS_BE12000._common_login = [
  {
    selector: 'input#Frm_Username, input[name="Frm_Username"]',
    text: 'Nhập tên đăng nhập: admin',
    position: 'right'
  },
  {
    selector: 'input#Frm_Password, input[name="Frm_Password"]',
    text: 'Nhập mật khẩu: admin',
    position: 'right'
  },
  {
    selector: 'input#LoginId, input[type="submit"]',
    text: 'Bấm Login để đăng nhập',
    position: 'bottom'
  }
];

// Bài 1: Quản lý LAN IPv4
window.TOOLTIPS_BE12000['LAB_BE12000_01'] = [
  {
    selector: 'a#MM_localnet, #MM_localnet',
    text: 'Bước 1: Chọn Local Network',
    position: 'bottom'
  },
  {
    selector: 'a[href*="lanMgrIpv4"], #lanMgrIpv4',
    text: 'Bước 2: Chọn LAN > IPv4',
    position: 'right'
  },
  {
    selector: 'input[name*="IPAddress"], #IPAddress',
    text: 'Bước 3: Nhập IP Address (192.168.1.1)',
    position: 'right'
  },
  {
    selector: 'input[type="submit"], input[value="Apply"], #Btn_Apply',
    text: 'Bước 4: Bấm Apply để lưu',
    position: 'bottom'
  }
];

// Bài 2: Cấu hình Wi-Fi MLO (Wi-Fi 7)
window.TOOLTIPS_BE12000['LAB_BE12000_02'] = [
  {
    selector: 'a#MM_localnet, #MM_localnet',
    text: 'Bước 1: Chọn Local Network',
    position: 'bottom'
  },
  {
    selector: 'a[href*="WLANMLO"], #WLANMLO',
    text: 'Bước 2: Chọn WLAN > MLO',
    position: 'right'
  },
  {
    selector: 'input[name*="ESSID"], #ESSID',
    text: 'Bước 3: Nhập SSID Name (FPT_BE12000_MLO)',
    position: 'right'
  },
  {
    selector: 'input[type="submit"], input[value="Apply"], #Btn_Apply',
    text: 'Bước 4: Bấm Apply để lưu',
    position: 'bottom'
  }
];

// Bài 3: Trạng thái WAN Ethernet
window.TOOLTIPS_BE12000['LAB_BE12000_03'] = [
  {
    selector: 'a#MM_internet, #MM_internet',
    text: 'Bước 1: Chọn Internet',
    position: 'bottom'
  },
  {
    selector: 'a[href*="ethWanStatus"], #ethWanStatus',
    text: 'Bước 2: Chọn Status > WAN',
    position: 'right'
  }
];

// Bài 4: Chẩn đoán mạng
window.TOOLTIPS_BE12000['LAB_BE12000_04'] = [
  {
    selector: 'a#MM_management, #MM_management',
    text: 'Bước 1: Chọn Management & Diagnosis',
    position: 'bottom'
  },
  {
    selector: 'a[href*="networkDiag"], #networkDiag',
    text: 'Bước 2: Chọn Network Diagnostics',
    position: 'right'
  }
];

// Bài 5: Quản lý Tài Khoản
window.TOOLTIPS_BE12000['LAB_BE12000_05'] = [
  {
    selector: 'a#MM_management, #MM_management',
    text: 'Bước 1: Chọn Management & Diagnosis',
    position: 'bottom'
  },
  {
    selector: 'a[href*="accountMgr"], #accountMgr',
    text: 'Bước 2: Chọn Account Management',
    position: 'right'
  }
];

// Bài 6: SNTP
window.TOOLTIPS_BE12000['LAB_BE12000_06'] = [
  {
    selector: 'a#MM_internet, #MM_internet',
    text: 'Bước 1: Chọn Internet',
    position: 'bottom'
  },
  {
    selector: 'a[href*="sntp"], #sntp',
    text: 'Bước 2: Chọn SNTP',
    position: 'right'
  }
];

// Bài 7: Reboot & Reset
window.TOOLTIPS_BE12000['LAB_BE12000_07'] = [
  {
    selector: 'a#MM_management, #MM_management',
    text: 'Bước 1: Chọn Management & Diagnosis',
    position: 'bottom'
  },
  {
    selector: 'a[href*="rebootAndReset"], #rebootAndReset',
    text: 'Bước 2: Chọn System Management > Reboot & Reset',
    position: 'right'
  }
];
