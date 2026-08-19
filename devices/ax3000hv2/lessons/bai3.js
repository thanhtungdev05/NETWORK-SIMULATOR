/**
 * devices/ax3000hv2/lessons/bai3.js
 * Bài 3: Cấu hình Wi-Fi Guest trên AX3000H v2
 */

window.DEVICE_AX3000HV2_LESSONS = window.DEVICE_AX3000HV2_LESSONS || [];

window.DEVICE_AX3000HV2_LESSONS.push({
  id: 'LAB_AX3000HV2_03',
  title: 'Bài 3: Cấu hình Wi-Fi Guest',
  subtitle: 'Thiết lập mạng Wi-Fi phụ cho khách (Guest)',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình mạng Wi-Fi Guest (Khách) theo các thông số dưới đây:',
    '- SSID Name: <span class="val">FPT Telecom_Guest</span>',
    '- WPA Key: <span class="val">fpt12345</span>',
  ],
  practiceUrl: '/sim_ax3000hv2/cgi-bin/index.asp?page=home_wireless.asp',
  clearFields: [
    'input[name="ESSID"]',
    'input[name="PreSharedKey"]',
    'input[name="ESSID_5g"]',
    'input[name="PreSharedKey_5g"]'
  ],
  grading: {
    description: 'Kiểm tra SSID Guest và WPA Key trên AX3000Hv2',
    rules: [
      {
        id: 'guest_ssid',
        name: 'Tên Wi-Fi Guest (SSID)',
        selector: 'input[name="ESSID_guest"], input[name*="guest_ssid"]',
        expected: 'FPT Telecom_Guest',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'guest_key',
        name: 'Mật khẩu Wi-Fi Guest',
        selector: 'input[name="PreSharedKey_guest"], input[name*="guest_key"]',
        expected: 'fpt12345',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
