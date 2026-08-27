/**
 * devices/vigor2927/lessons/bai1.js
 * Bài 1: Khám phá Vigor2927
 */

window.DEVICE_VIGOR2927_LESSONS = window.DEVICE_VIGOR2927_LESSONS || [];

window.DEVICE_VIGOR2927_LESSONS.push({
  id: 'vg2927-bai1',
  title: 'Cấu hình wifi',
  subtitle: 'Cấu hình wifi',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Đăng nhập vào thiết bị và xem trạng thái thiết bị',
    '- Username: <span class="val">admin</span>',
    '- Password: <span class="val">admin</span>',
  ],
  practiceUrl: '/sim_vigor2927/weblogin.htm',
  grading: {
    description: 'Kiểm tra đăng nhập Vigor2927',
    rules: []
  },
  guidePopups: [
    {
      selector: '#menu',
      text: 'Khám phá menu bên trái',
      position: 'right'
    }
  ]
});
