/**
 * devices/be12000/lessons/bai4.js
 * Bài 4 - Chẩn đoán mạng (Network Diag) trên BE12000
 */

window.DEVICE_BE12000_LESSONS = window.DEVICE_BE12000_LESSONS || [];

window.DEVICE_BE12000_LESSONS.push({
  id: 'be12-bai4',
  title: 'Bài 4 - Chẩn đoán mạng (Network Diag)',
  subtitle: 'Sử dụng công cụ Ping và Traceroute',
  instructions: [
    'Chọn menu <b>Management > Network Diagnostics</b>',
    '<b>Ping Test:</b>',
    '- Target IP/Domain: <span class="val">8.8.8.8</span>',
    '- Bấm <b>Start Ping</b>',
  ],
  practiceUrl: '/sim_be12000/login',
  grading: {
    description: 'Kiểm tra thao tác Network Diagnostics',
    rules: [
      {
        id: 'ping_target',
        name: 'Target IP',
        selector: 'input[name*="Target"], #Target',
        expected: '8.8.8.8',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: [
    {
      selector: 'a#MM_management, #MM_management',
      text: 'Bước 1: Chọn Management & Diagnosis',
      position: 'bottom'
    },
    {
      selector: 'a[href*="networkDiag"], #networkDiag',
      text: 'Bước 2: Chọn Network Diagnostics',
      position: 'right'
    }
  ]
});
