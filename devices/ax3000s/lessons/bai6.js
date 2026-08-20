/**
 * devices/ax3000s/lessons/bai6.js
 * Bài 6: Cấu hình Port Forwarding trên AX3000S
 */

window.DEVICE_AX3000S_LESSONS = window.DEVICE_AX3000S_LESSONS || [];

window.DEVICE_AX3000S_LESSONS.push({
  id: 'LAB_AX3000S_06',
  title: 'Bài 6-Cấu hình Port Forwarding',
  subtitle: 'Mở Port (Port Forwarding / Virtual Server)',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình Mở Port trên thiết bị theo các thông số được cung cấp dưới đây:',
    '- Name: <span class="val">NAT FPT</span>',
    '- Protocol: <span class="val">TCP, UDP hoặc TCP/UDP</span>',
    '- External Port (WAN): <span class="val">8080</span>',
    '- Internal IP: <span class="val">192.168.1.100 (AX3000C v2: 192.168.100.100)</span>',
    '- Internal Port: <span class="val">8080</span>',
  ],
  practiceUrl: '/sim_ax3000s/app.html#portforward',
  clearFields: [
    'input[name="cusSrvName"]',
    'input[name="ex_port"]'
  ],
  grading: {
    description: 'Kiểm tra Port Forwarding rule trên AX3000S',
    rules: [
      {
        id: 'rule_name',
        name: 'Tên Rule',
        selector: 'input[name="cusSrvName"], #cusSrvName',
        expected: 'NAT FPT',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'ext_port',
        name: 'External Port',
        selector: 'input[name="ex_port"], #ex_port',
        expected: '8080',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
