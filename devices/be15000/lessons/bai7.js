/**
 * devices/be15000/lessons/bai7.js
 * Bài 7 - Nâng cấp Firmware trên BE15000
 */

window.DEVICE_BE15000_LESSONS = window.DEVICE_BE15000_LESSONS || [];

window.DEVICE_BE15000_LESSONS.push({
  id: 'be15-bai7',
  title: 'Bài 7 - Nâng cấp Firmware',
  subtitle: 'Cập nhật firmware lên phiên bản mới',
  instructions: [
    'Chọn menu <b>Firmware Upgrade</b>',
    '- Tải file firmware .bin từ trang hỗ trợ',
    '- Bấm <b>Browse</b> chọn file firmware',
    '- Bấm <b>Upgrade</b> để bắt đầu',
    '⚠️ Không ngắt nguồn trong lúc nâng cấp!',
    '- Thiết bị tự khởi động lại sau khi xong',
  ],
  practiceUrl: '/sim_be15000/sim_be15000/www/pages/firmwareUpgr.html',
  grading: {
    description: 'Kiểm tra Firmware Upgrade process',
    rules: []
  },
  guidePopups: []
});
