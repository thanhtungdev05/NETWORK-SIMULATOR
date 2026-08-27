/**
 * devices/ONT_be6500c/lessons/bai1.js
 * Bài 1: Cấu hình PPPoE (Đăng nhập)
 */

window.DEVICE_ONT_BE6500C_LESSONS = window.DEVICE_ONT_BE6500C_LESSONS || [];

window.DEVICE_ONT_BE6500C_LESSONS.push({
  id: 'ont_be6500c-bai1',
  title: 'Cấu hình PPPoE',
  subtitle: 'Cấu hình PPPoE',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Đăng nhập vào thiết bị và xem trạng thái thiết bị',
    '- Username: <span class="val">admin</span>',
    '- Password: <span class="val">admin</span>',
  ],
  practiceUrl: '/sim_ONT_be6500c/login.html',
  grading: {
    description: 'Kiểm tra đăng nhập ONT BE6500C',
    rules: []
  },
  guidePopups: [
    {
      selector: '#username',
      text: 'Nhập admin',
      position: 'bottom'
    },
    {
      selector: '#password',
      text: 'Nhập admin',
      position: 'bottom'
    },
    {
      selector: '.btn-login',
      text: 'Bấm Đăng nhập',
      position: 'bottom'
    }
  ]
});
