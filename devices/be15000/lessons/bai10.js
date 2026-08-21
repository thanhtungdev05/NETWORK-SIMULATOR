/**
 * devices/be15000/lessons/bai10.js
 * Bài 10 - Cấu hình SNTP trên BE15000
 */

window.DEVICE_BE15000_LESSONS = window.DEVICE_BE15000_LESSONS || [];

window.DEVICE_BE15000_LESSONS.push({
  id: 'be15-bai10',
  title: 'Bài 10 - Cấu hình SNTP',
  subtitle: 'Đồng bộ thời gian thiết bị với máy chủ NTP',
  instructions: [
    'Chọn menu <b>SNTP Configuration</b>',
    '- SNTP Enable: <span class="val">Yes</span>',
    '- Server 1: <span class="val">time.google.com</span>',
    '- Server 2: <span class="val">pool.ntp.org</span>',
    '- Timezone: <span class="val">GMT+7 (Indochina Time)</span>',
    '- Sync Interval: <span class="val">24 giờ</span>',
    'Bấm <b>Apply</b>',
  ],
  practiceUrl: '/sim_be15000/sim_be15000/www/pages/sntp_lan.html',
  grading: {
    description: 'Kiểm tra SNTP Configuration',
    rules: [
      {
        id: 'sntp_server1',
        name: 'Server 1',
        selector: 'input[name*="Server1"], #Server1',
        expected: 'time.google.com',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
