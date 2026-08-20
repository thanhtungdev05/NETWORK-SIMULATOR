/**
 * devices/ax3000s/lessons/bai3.js
 * Bài 3: Cấu hình WIFI IOT trên AX3000S
 */

window.DEVICE_AX3000S_LESSONS = window.DEVICE_AX3000S_LESSONS || [];

window.DEVICE_AX3000S_LESSONS.push({
  id: 'LAB_AX3000S_03',
  title: 'Bài 3-Cấu hình WIFI IOT',
  subtitle: 'Thiết lập mạng Wi-Fi dành riêng cho thiết bị IoT',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình mạng Wi-Fi IoT theo các thông số dưới đây:',
    '- SSID Name: <span class="val">FPT Telecom_IoT</span>',
    '- WPA Key: <span class="val">19006600</span>',
  ],
  practiceUrl: '/sim_ax3000s/app.html#wlanMapSettingAll',
  clearFields: [
    'input[name="Txt_SSID_2G_3"]',
    'input[name="Pwd_WpaPsk_2G_3"]'
  ],
  grading: {
    description: 'Kiểm tra SSID IoT và WPA Key trên AX3000S',
    rules: [
      {
        id: 'iot_ssid',
        name: 'Tên Wi-Fi IoT',
        selector: 'input[name="Txt_SSID_2G_3"], #Txt_SSID_2G_3',
        expected: 'FPT Telecom_IoT',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'iot_key',
        name: 'Mật khẩu Wi-Fi IoT',
        selector: 'input[name="Pwd_WpaPsk_2G_3"], #Pwd_WpaPsk_2G_3',
        expected: '19006600',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
