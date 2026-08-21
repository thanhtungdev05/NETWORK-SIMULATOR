/**
 * devices/be15000/lessons/bai3.js
 * Bài 3 - Chẩn đoán mạng trên BE15000
 */

window.DEVICE_BE15000_LESSONS = window.DEVICE_BE15000_LESSONS || [];

window.DEVICE_BE15000_LESSONS.push({
  id: 'be15-bai3',
  title: 'Bài 3 - Chẩn đoán mạng',
  subtitle: 'Sử dụng Ping và Traceroute kiểm tra kết nối',
  instructions: [
    'Chọn menu <b>Network Diagnostics</b>',
    '<b>Ping Test:</b>',
    '- Target: <span class="val">8.8.8.8</span>',
    '- Packets: <span class="val">4</span>',
    '- Bấm <b>Start</b>',
    '<b>Traceroute:</b>',
    '- Target: <span class="val">google.com</span>',
    '- Bấm <b>Trace</b> và xem đường đi gói tin',
  ],
  practiceUrl: '/sim_be15000/page/networkDiag',
  grading: {
    description: 'Kiểm tra thao tác Network Diagnostics',
    rules: [
      {
        id: 'diag_target',
        name: 'Target Host / IP',
        selector: 'input[name*="Target"], #Target',
        expected: '8.8.8.8',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
