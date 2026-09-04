/**
 * devices/ax3000c/lessons/bai3.js
 * Bài 3: Cấu hình WiFi IoT trên AX3000C
 */

window.DEVICE_AX3000C_LESSONS = window.DEVICE_AX3000C_LESSONS || [];

// Loại bỏ bài bị trùng nếu đang load lại (HMR/reload)
var idx = window.DEVICE_AX3000C_LESSONS.findIndex(function (l) { return l.id === 'LAB_AX3000C_03'; });
var lessonObj = {
  id: 'LAB_AX3000C_03',
  title: 'Cấu hình wifi IoT',
  subtitle: 'Cấu hình wifi IoT',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình một mạng Wi-Fi riêng biệt dành riêng cho các thiết bị IoT (Smart Home, Camera, v.v.). Cấu hình các thông số mạng Wi-Fi IoT theo đúng yêu cầu dưới đây:',
    '- SSID Name: <span class="val">FPT IoT</span>',
    '- WPA Key: <span class="val">fptiot123</span>',
  ],
  practiceUrl: '/sim_ax3000c/#/network/wifi',
  clearFields: [
    '.card .row input[type="text"]',
    '#pp'
  ],
  grading: {
    description: 'Kiểm tra SSID và WPA Key (dành cho IoT) trên AX3000C',
    rules: [
      {
        id: 'wifi_ssid',
        name: 'Tên Wi-Fi IoT (SSID)',
        selector: '.card .row input[type="text"], input[value*="FPT"]',
        expected: 'FPT IoT',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'wifi_key',
        name: 'Mật khẩu Wi-Fi IoT (WPA Key)',
        selector: '#pp, input[type="password"]',
        expected: 'fptiot123',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: [
    {
      selector: 'li.el-submenu:not(.is-opened) .el-submenu__title:contains("Network")',
      text: 'Chọn Network',
      position: 'right',
      hideOnPage: 'wifi'
    },
    {
      selector: 'li.el-submenu.is-opened li.el-submenu:not(.is-opened) .el-submenu__title:contains("Wi-Fi"), li.el-submenu.is-opened li.el-submenu:not(.is-opened) .el-submenu__title:contains("WIFI")',
      text: 'Chọn WIFI',
      position: 'right',
      hideOnPage: 'wifi'
    },
    {
      selector: 'li.el-submenu.is-opened li.el-submenu.is-opened li.el-menu-item:contains("Wi-Fi"), li.el-submenu.is-opened li.el-menu-item:contains("Wi-Fi"), li.el-submenu.is-opened li.el-menu-item:contains("WIFI")',
      text: 'Chọn WIFI',
      position: 'right',
      hideOnPage: 'wifi'
    },
    {
      selector: '.tabs:not(:has(.tab.active[data-t="guest"])) .tab[data-t="guest"]',
      text: 'Bước 1:Cấu hình mạng Guest SSID (cho IoT)',
      position: 'top',
      page: 'wifi'
    },
    {
      selector: '.tabs:has(.tab.active[data-t="guest"]) ~ .card .row input[type="text"]',
      text: 'Bước 2: Đặt tên WIFI IoT VD: FPT IoT',
      position: 'right',
      page: 'wifi'
    },
    {
      selector: '.tabs:has(.tab.active[data-t="guest"]) ~ .card #pp',
      text: 'Bước 3: Đặt mật khẩu WIFI IoT VD: fptiot123',
      position: 'right',
      page: 'wifi'
    },
    {
      selector: '.tabs:has(.tab.active[data-t="guest"]) ~ .actions button.apply',
      text: 'Bước 4: Chọn Apply',
      position: 'bottom',
      page: 'wifi'
    }
  ]
};

if (idx !== -1) {
  window.DEVICE_AX3000C_LESSONS[idx] = lessonObj;
} else {
  window.DEVICE_AX3000C_LESSONS.push(lessonObj);
}
