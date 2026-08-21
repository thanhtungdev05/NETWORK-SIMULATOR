/**
 * devices/be15000/lessons/bai9.js
 * Bài 9 - Khởi động lại & Reset trên BE15000
 */

window.DEVICE_BE15000_LESSONS = window.DEVICE_BE15000_LESSONS || [];

window.DEVICE_BE15000_LESSONS.push({
  id: 'be15-bai9',
  title: 'Bài 9 - Khởi động lại & Reset',
  subtitle: 'Reboot thiết bị hoặc khôi phục cài đặt gốc',
  instructions: [
    'Chọn menu <b>Reboot & Reset</b>',
    '<b>Reboot:</b> Bấm <b>Restart Now</b>',
    '- Thiết bị sẽ offline khoảng 1-2 phút',
    '<b>Factory Reset:</b> Bấm <b>Restore Factory Default</b>',
    '⚠️ Toàn bộ cấu hình sẽ bị xóa!',
    '- Sau reset: IP mặc định, tài khoản mặc định',
  ],
  practiceUrl: '/sim_be15000/sim_be15000/www/pages/rebootAndReset.html',
  grading: {
    description: 'Kiểm tra Reboot & Reset operations',
    rules: []
  },
  guidePopups: []
});
