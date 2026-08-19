/**
 * devices/ax3000gz/lessons/bai6.js
 * Bài 6: Cấu hình DDNS trên AX3000GZ
 */

window.DEVICE_AX3000GZ_LESSONS = window.DEVICE_AX3000GZ_LESSONS || [];

window.DEVICE_AX3000GZ_LESSONS.push({
  id: 'LAB_AX3000GZ_06',
  title: 'Bài 6: Cấu hình DDNS',
  subtitle: 'Đăng ký tên miền động để truy cập từ Internet',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình dịch vụ tên miền động DDNS theo các thông số:',
    '- Provider: <span class="val">No-IP</span>',
    '- Username: <span class="val"> binhnt3@fpt.net</span>',
    '- Password: <span class="val">fpt12345</span>',
    '- Host Name: <span class="val">test23122021.ddns.net</span>',
  ],
  practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/ddns/dynamicDDNS',
  grading: {
    description: 'Kiểm tra Dynamic DDNS configuration',
    rules: [
      {
        id: 'ddns_username',
        name: 'DDNS Username',
        selector: 'input[name="username"], input[name*="user"]',
        expected: 'binhnt3@fpt.net',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'ddns_hostname',
        name: 'DDNS Host Name',
        selector: 'input[name="hostname"], input[name*="host"]',
        expected: 'test23122021.ddns.net',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
