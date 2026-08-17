/**
 * devices/ax3000gz/lessons/bai2.js
 * Bài 2: Cấu hình WiFi trên AX3000GZ
 */

window.DEVICE_AX3000GZ_LESSONS = window.DEVICE_AX3000GZ_LESSONS || [];

window.DEVICE_AX3000GZ_LESSONS.push({
  id: 'ax3gz-bai2',
  title: 'Bài 2: Cấu hình WiFi',
  subtitle: 'Thiết lập Wi-Fi 2.4GHz và 5GHz cho AX3000GZ',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình các thông số mạng Wi-Fi theo đúng yêu cầu dưới đây:',
    '- SSID Name: <span class="val">FPT Telecom</span>',
    '- WPA Key: <span class="val">fpt12345</span>',
  ],
  practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/localnetwork/WLAN/WLANbasic',
  grading: {
    description: 'Kiểm tra SSID và WPA Key trên AX3000GZ',
    rules: [
      {
        id: 'wlan_ssid',
        name: 'Tên Wi-Fi (SSID)',
        selector: 'input[name="ssid"], input[name*="SSID"], #ssid',
        expected: 'FPT Telecom',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'wlan_key',
        name: 'Mật khẩu Wi-Fi (WPA Key)',
        selector: 'input[name="wpakey"], input[name*="key"], input[type="password"]',
        expected: 'fpt12345',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
