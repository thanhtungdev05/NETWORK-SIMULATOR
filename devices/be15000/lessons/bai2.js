/**
 * devices/be15000/lessons/bai2.js
 * Bài 2 - Trạng thái mạng cục bộ trên BE15000
 */

window.DEVICE_BE15000_LESSONS = window.DEVICE_BE15000_LESSONS || [];

window.DEVICE_BE15000_LESSONS.push({
  id: 'be15-bai2',
  title: 'Bài 2 - Trạng thái mạng cục bộ',
  subtitle: 'Xem thông tin và trạng thái mạng nội bộ',
  instructions: [
    'Chọn menu <b>Local Network Status</b>',
    '- Xem danh sách thiết bị kết nối',
    '- Kiểm tra IP, MAC, hostname từng máy',
    '- Xem trạng thái cổng LAN (tốc độ, duplex)',
    '- Xem traffic in/out từng interface',
  ],
  practiceUrl: '/sim_be15000/page/localNetStatus',
  grading: {
    description: 'Kiểm tra Local Network Status check',
    rules: []
  },
  guidePopups: []
});
