/**
 * devices/ax3000c/lessons/bai2.js
 * Bài 2: Cấu hình WiFi trên AX3000C
 */

window.DEVICE_AX3000C_LESSONS = window.DEVICE_AX3000C_LESSONS || [];

window.DEVICE_AX3000C_LESSONS.push({
  id: 'LAB_AX3000CV2_02',
  title: 'Bài 2 - Cấu hình WiFi',
  subtitle: 'Kích hoạt Band Steering và thiết lập Wi-Fi',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình mạng Wi-Fi Band Steering trên thiết bị. Kích hoạt tính năng Band Steering và cấu hình các thông số mạng Wi-Fi theo đúng yêu cầu dưới đây:',
    '- SSID Name: <span class="val">FPT Telecom</span>',
    '- WPA Key: <span class="val">fpt12345</span>',
  ],
  practiceUrl: '/sim_ax3000c/#/network/wifi',
  clearFields: [
    '.card .row input[type="text"]',
    '#pp'
  ],
  grading: {
    description: 'Kiểm tra SSID và WPA Key trên AX3000C',
    rules: [
      {
        id: 'wifi_ssid',
        name: 'Tên Wi-Fi (SSID)',
        selector: '.card .row input[type="text"], input[value*="FPT"]',
        expected: 'FPT Telecom',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'wifi_key',
        name: 'Mật khẩu Wi-Fi (WPA Key)',
        selector: '#pp, input[type="password"]',
        expected: 'fpt12345',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: [
    {
      selector: '.el-submenu__title:contains("Network"), .el-submenu:contains("Network")',
      text: 'Chọn Network',
      position: 'right',
      hideOnPage: 'wifi'
    },
    {
      selector: '.el-submenu:contains("Network") .el-submenu__title:contains("Wi-Fi"), .el-submenu:contains("Network") .el-submenu__title:contains("WIFI")',
      text: 'Chọn WIFI',
      position: 'right',
      hideOnPage: 'wifi'
    },
    {
      selector: '.el-menu-item:contains("Wi-Fi"), .el-menu-item:contains("WIFI"), [index*="/network/wifi"]',
      text: 'Chọn WIFI',
      position: 'right',
      hideOnPage: 'wifi'
    },
    {
      selector: '.card .row input[type="text"], input[value*="FPT"]',
      text: 'Bước 1: Đặt tên WIFI VD: FPT Telecom',
      position: 'right',
      page: 'wifi'
    },
    {
      selector: '#pp, input[type="password"]',
      text: 'Bước 2: Đặt mật khẩu WIFI VD: fpt12345',
      position: 'right',
      page: 'wifi'
    },
    {
      selector: 'button.apply, button.btn.apply, button[onclick*="save"], input[type="submit"]',
      text: 'Bước 3: Chọn Apply',
      position: 'right',
      page: 'wifi'
    }
  ]
});
