/**
 * devices/be15000/lessons/bai8.js
 * Bài 8 - Quản lý Log trên BE15000
 */

window.DEVICE_BE15000_LESSONS = window.DEVICE_BE15000_LESSONS || [];

window.DEVICE_BE15000_LESSONS.push({
  id: 'be15-bai8',
  title: 'Bài 8 - Quản lý Log',
  subtitle: 'Xem và phân tích nhật ký hệ thống',
  instructions: [
    'Chọn menu <b>Log Management</b>',
    '- Xem log theo mức độ: Error, Warning, Info',
    '- Lọc log theo thời gian',
    '- Tìm kiếm log theo từ khóa',
    '- Download log: Bấm <b>Export</b>',
    '- Xóa log cũ: Bấm <b>Clear</b>',
  ],
  practiceUrl: '/sim_be15000/sim_be15000/www/pages/logMgr.html',
  grading: {
    description: 'Kiểm tra Log Management',
    rules: []
  },
  guidePopups: []
});
