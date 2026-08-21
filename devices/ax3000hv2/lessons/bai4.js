/**
 * devices/ax3000hv2/lessons/bai4.js
 * Bài 4: Cấu hình Wi-Fi IoT trên AX3000H v2
 */

window.DEVICE_AX3000HV2_LESSONS = window.DEVICE_AX3000HV2_LESSONS || [];

window.DEVICE_AX3000HV2_LESSONS.push({
  id: 'LAB_AX3000HV2_04',
  title: 'Bài 4 - Cấu hình Wi-Fi IoT',
  subtitle: 'Thiết lập mạng Wi-Fi dành riêng cho thiết bị IoT',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình mạng Wi-Fi IoT theo các thông số dưới đây:',
    '- SSID Name: <span class="val">FPT Telecom_IoT</span>',
    '- WPA Key: <span class="val">fpt12345</span>',
  ],
  practiceUrl: '/sim_ax3000hv2/cgi-bin/index.asp?page=home_wireless.asp',
  clearFields: [
    'input[name="wifi5SSid_2G"]',
    'input[name="wifi5Pwd_2G"]',
    'input[name="wifi5SSid_5G"]',
    'input[name="wifi5Pwd_5G"]'
  ],
  grading: {
    description: 'Kiểm tra SSID IoT và WPA Key trên AX3000Hv2',
    rules: [
      {
        id: 'iot_ssid',
        name: 'Tên Wi-Fi IoT (SSID)',
        selector: 'input[name="ESSID_iot"], input[name*="iot_ssid"]',
        expected: 'FPT Telecom_IoT',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'iot_key',
        name: 'Mật khẩu Wi-Fi IoT',
        selector: 'input[name="PreSharedKey_iot"], input[name*="iot_key"]',
        expected: 'fpt12345',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
