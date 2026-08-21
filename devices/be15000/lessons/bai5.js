/**
 * devices/be15000/lessons/bai5.js
 * Bài 5 - Bảng ARP trên BE15000
 */

window.DEVICE_BE15000_LESSONS = window.DEVICE_BE15000_LESSONS || [];

window.DEVICE_BE15000_LESSONS.push({
  id: 'be15-bai5',
  title: 'Bài 5 - Bảng ARP',
  subtitle: 'Xem và quản lý bảng ARP của thiết bị',
  instructions: [
    'Chọn menu <b>ARP Table</b>',
    '- Xem danh sách IP ↔ MAC mapping',
    '- Xác định thiết bị nào đang dùng IP nào',
    '- Phát hiện xung đột IP (IP Conflict)',
    '- Bấm <b>Refresh</b> để cập nhật danh sách',
  ],
  practiceUrl: '/sim_be15000/page/arpTable',
  grading: {
    description: 'Kiểm tra ARP Table inspection',
    rules: []
  },
  guidePopups: []
});
