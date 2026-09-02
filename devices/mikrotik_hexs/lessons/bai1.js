/**
 * devices/mikrotik_hexs/lessons/bai1.js
 */
window.DEVICE_MIKROTIK_HEXS_LESSONS = window.DEVICE_MIKROTIK_HEXS_LESSONS || [];

window.DEVICE_MIKROTIK_HEXS_LESSONS.push({
  id: 'mikrotik_hexs-bai1',
  title: 'Cấu hình PPPoE',
  subtitle: 'Cấu hình PPPoE',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Đăng nhập vào thiết bị và xem trạng thái thiết bị',
    '- Username: <span class="val">admin</span>',
    '- Password: <span class="val">admin</span>',
  ],
  practiceUrl: '/sim_mikrotik_hexs/index.html',
  clearFields: [],
  grading: {
    description: 'Kiểm tra đăng nhập',
    rules: [
      {
        "id": "login_name",
        "name": "Username",
        "selector": "input#name",
        "expected": "admin",
        "type": "text_exact",
        "trim": true,
        "required": true
      },
      {
        "id": "login_pass",
        "name": "Password",
        "selector": "input#password",
        "expected": "admin",
        "type": "text_exact",
        "trim": true,
        "required": true
      }
    ]
  },
  guidePopups: [
    {
      "selector": "input#name",
      "text": "Nhập Username là admin",
      "position": "right"
    },
    {
      "selector": "input#password",
      "text": "Nhập Password là admin",
      "position": "right"
    },
    {
      "selector": "input[type=\"submit\"]",
      "text": "Click nút Login để đăng nhập",
      "position": "right"
    }
  ]
});
