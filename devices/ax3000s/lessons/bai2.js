/**
 * devices/ax3000s/lessons/bai2.js
 * Bài 2: Cấu hình WIFI trên AX3000S
 */

window.DEVICE_AX3000S_LESSONS = window.DEVICE_AX3000S_LESSONS || [];

window.DEVICE_AX3000S_LESSONS.push({
  id: 'ax3s-bai2',
  title: 'Bài 2-Cấu hình WIFI',
  subtitle: 'Thiết lập mạng Wi-Fi 2.4GHz và 5GHz',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình các thông số mạng Wi-Fi theo đúng yêu cầu dưới đây:',
    '- SSID Name: <span class="val">FPT Telecom</span>',
    '- WPA Key: <span class="val">19006600</span>',
  ],
  practiceUrl: '/sim_ax3000s/app.html#wlanBasicSetting2g',
  grading: {
    description: 'Kiểm tra WLAN Basic Setting 2.4G/5G trên AX3000S',
    rules: [
      {
        id: 'wifi_ssid',
        name: 'Tên Wi-Fi (SSID)',
        selector: 'input[name="ssid"], input[name*="SSID"], #ssid',
        expected: 'FPT Telecom',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'wifi_key',
        name: 'Mật khẩu Wi-Fi (WPA Key)',
        selector: 'input[name="wpakey"], input[name*="key"], #wpakey',
        expected: '19006600',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
