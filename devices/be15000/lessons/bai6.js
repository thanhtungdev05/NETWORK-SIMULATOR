/**
 * devices/be15000/lessons/bai6.js
 * Bài 6 - Bảng MAC trên BE15000
 */

window.DEVICE_BE15000_LESSONS = window.DEVICE_BE15000_LESSONS || [];

window.DEVICE_BE15000_LESSONS.push({
  id: 'be15-bai6',
  title: 'Bài 6 - Bảng MAC',
  subtitle: 'Xem danh sách địa chỉ MAC đã học trên switch',
  instructions: [
    'Chọn menu <b>MAC Table</b>',
    '- Xem MAC address của thiết bị trên từng cổng',
    '- Lọc theo VLAN hoặc Port',
    '- Aging time: <span class="val">300 giây mặc định</span>',
    '- Bấm <b>Refresh</b> để cập nhật',
  ],
  practiceUrl: '/sim_be15000/sim_be15000/www/pages/macTable.html',
  grading: {
    description: 'Kiểm tra MAC Table inspection',
    rules: []
  },
  guidePopups: []
});
