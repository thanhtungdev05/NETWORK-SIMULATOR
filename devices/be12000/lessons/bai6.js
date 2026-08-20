/**
 * devices/be12000/lessons/bai6.js
 * Bài 6 - Cấu hình SNTP Đồng Bộ Thời Gian trên BE12000
 */

window.DEVICE_BE12000_LESSONS = window.DEVICE_BE12000_LESSONS || [];

window.DEVICE_BE12000_LESSONS.push({
  id: 'LAB_BE12000_06',
  title: 'Bài 6 - Cấu hình SNTP Đồng Bộ Thời Gian',
  subtitle: 'Thiết lập máy chủ thời gian NTP',
  instructions: [
    'Chọn menu <b>Internet > SNTP</b>',
    '- Server 1: <span class="val">time.google.com</span>',
    '- Timezone: <span class="val">GMT+7</span>',
    'Bấm <b>Apply</b>',
  ],
  practiceUrl: '/sim_be12000/login',
  grading: {
    description: 'Kiểm tra SNTP Configuration trên BE12000',
    rules: [
      {
        id: 'sntp_server',
        name: 'NTP Server',
        selector: 'input[name*="Server"], #Server',
        expected: 'time.google.com',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: [
    {
      selector: 'a#MM_internet, #MM_internet',
      text: 'Bước 1: Chọn Internet',
      position: 'bottom'
    },
    {
      selector: 'a[href*="sntp"], #sntp',
      text: 'Bước 2: Chọn SNTP',
      position: 'right'
    }
  ]
});
