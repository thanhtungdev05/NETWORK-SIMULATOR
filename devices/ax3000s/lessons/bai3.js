/**
 * devices/ax3000s/lessons/bai3.js
 * Bài 3: Cấu hình WIFI IOT trên AX3000S
 */

window.DEVICE_AX3000S_LESSONS = window.DEVICE_AX3000S_LESSONS || [];

window.DEVICE_AX3000S_LESSONS.push({
  id: 'ax3s-bai3',
  title: 'Bài 3-Cấu hình WIFI IOT',
  subtitle: 'Thiết lập mạng Wi-Fi dành riêng cho thiết bị IoT',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình mạng Wi-Fi IoT theo các thông số dưới đây:',
    '- SSID Name: <span class="val">FPT Telecom_IoT</span>',
    '- WPA Key: <span class="val">19006600</span>',
  ],
  practiceUrl: '/sim_ax3000s/app.html#wlanBasicSetting2g',
  grading: {
    description: 'Kiểm tra SSID IoT và WPA Key trên AX3000S',
    rules: [
      {
        id: 'iot_ssid',
        name: 'Tên Wi-Fi IoT',
        selector: 'input[name="iot_ssid"], input[name*="iot"], #iot_ssid',
        expected: 'FPT Telecom_IoT',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'iot_key',
        name: 'Mật khẩu Wi-Fi IoT',
        selector: 'input[name="iot_key"], input[name*="iot_key"], #iot_key',
        expected: '19006600',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
