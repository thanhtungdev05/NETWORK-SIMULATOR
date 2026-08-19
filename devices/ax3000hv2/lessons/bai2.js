/**
 * devices/ax3000hv2/lessons/bai2.js
 * Bài 2: Cấu hình Wi-Fi Host trên AX3000H v2
 */

window.DEVICE_AX3000HV2_LESSONS = window.DEVICE_AX3000HV2_LESSONS || [];

window.DEVICE_AX3000HV2_LESSONS.push({
  id: 'LAB_AX3000HV2_02',
  title: 'Bài 2: Cấu hình Wi-Fi Host',
  subtitle: 'Thiết lập mạng Wi-Fi chính (Host)',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình mạng Wi-Fi chính (Host) theo các thông số dưới đây:',
    '- SSID Name: <span class="val">FPT Telecom</span>',
    '- WPA Key: <span class="val">fpt12345</span>',
  ],
  practiceUrl: '/sim_ax3000hv2/cgi-bin/index.asp?page=home_wireless.asp',
  clearFields: [
    'input[name="ESSID"]',
    'input[name="PreSharedKey1"]',
    'input[name="PreSharedKey"]',
    'input[name="ESSID_5g"]',
    'input[name="PreSharedKey_5g"]'
  ],
  grading: {
    description: 'Kiểm tra SSID Host và WPA Key trên AX3000Hv2',
    rules: [
      {
        id: 'host_ssid',
        name: 'Tên Wi-Fi Host (SSID)',
        selector: 'input[name="ESSID"], input[name="ssid"]',
        expected: 'FPT Telecom',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'host_key',
        name: 'Mật khẩu Wi-Fi Host',
        selector: 'input[name="PreSharedKey1"], input[name*="PreSharedKey"]',
        expected: 'fpt12345',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
