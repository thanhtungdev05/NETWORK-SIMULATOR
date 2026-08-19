/**
 * devices/ax3000gz/lessons/bai8.js
 * Bài 8: Cấu hình Port Forwarding trên AX3000GZ
 */

window.DEVICE_AX3000GZ_LESSONS = window.DEVICE_AX3000GZ_LESSONS || [];

window.DEVICE_AX3000GZ_LESSONS.push({
  id: 'LAB_AX3000GZ_08',
  title: 'Bài 8: Cấu hình Port Forwarding',
  subtitle: 'Mở cổng NAT để máy trong LAN nhận kết nối từ ngoài',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình Mở Port trên thiết bị theo các thông số được cung cấp dưới đây:',
    '- Start External Port: <span class="val">3389</span>',
    '- End External Port: <span class="val">3389</span>',
    '- IP Address: <span class="val">192.168.1.254</span>',
    '- Start Internal Port: <span class="val">3389</span>',
    '- End Internal Port: <span class="val">3389</span>',
  ],
  practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/security/forwards',
  grading: {
    description: 'Kiểm tra Port Forwarding rules trên AX3000GZ',
    rules: [
      {
        id: 'ext_port',
        name: 'External Port',
        selector: 'input[name="ext_port"], input[name*="external"]',
        expected: '3389',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'int_ip',
        name: 'Internal IP',
        selector: 'input[name="int_ip"], input[name*="internal_ip"]',
        expected: '192.168.1.254',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
