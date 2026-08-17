/**
 * devices/be12000/lessons/bai7.js
 * Bài 7 - Khởi Động Lại & Khôi Phục Cài Đặt Gốc trên BE12000
 */

window.DEVICE_BE12000_LESSONS = window.DEVICE_BE12000_LESSONS || [];

window.DEVICE_BE12000_LESSONS.push({
  id: 'be12-bai7',
  title: 'Bài 7 - Khởi Động Lại & Khôi Phục Cài Đặt Gốc',
  subtitle: 'Reboot thiết bị hoặc Reset Factory',
  instructions: [
    'Chọn menu <b>Management > Reboot & Reset</b>',
    '- Reboot: Bấm <b>Restart</b>',
    '- Factory Reset: Bấm <b>Restore Factory Default</b>',
  ],
  practiceUrl: '/sim_be12000/login',
  grading: {
    description: 'Kiểm tra Reboot & Reset trên BE12000',
    rules: []
  },
  guidePopups: [
    {
      selector: 'a#MM_management, #MM_management',
      text: 'Bước 1: Chọn Management & Diagnosis',
      position: 'bottom'
    },
    {
      selector: 'a[href*="rebootAndReset"], #rebootAndReset',
      text: 'Bước 2: Chọn System Management > Reboot & Reset',
      position: 'right'
    }
  ]
});
