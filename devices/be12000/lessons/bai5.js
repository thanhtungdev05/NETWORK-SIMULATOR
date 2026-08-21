/**
 * devices/be12000/lessons/bai5.js
 * Bài 5 - Quản lý Tài Khoản & Mật Khẩu trên BE12000
 */

window.DEVICE_BE12000_LESSONS = window.DEVICE_BE12000_LESSONS || [];

window.DEVICE_BE12000_LESSONS.push({
  id: 'LAB_BE12000_05',
  title: 'Bài 5 - Quản lý Tài Khoản & Mật Khẩu',
  subtitle: 'Thay đổi mật khẩu đăng nhập admin',
  instructions: [
    'Chọn menu <b>Management > Account Management</b>',
    '- Old Password: <span class="val">admin</span>',
    '- New Password: <span class="val">Mật khẩu mới</span>',
    'Bấm <b>Apply</b> để thay đổi',
  ],
  practiceUrl: '/sim_be12000/login',
  grading: {
    description: 'Kiểm tra Account Management trên BE12000',
    rules: []
  },
  guidePopups: [
    {
      selector: 'a#MM_management, #MM_management',
      text: 'Bước 1: Chọn Management & Diagnosis',
      position: 'bottom'
    },
    {
      selector: 'a[href*="accountMgr"], #accountMgr',
      text: 'Bước 2: Chọn Account Management',
      position: 'right'
    }
  ]
});
