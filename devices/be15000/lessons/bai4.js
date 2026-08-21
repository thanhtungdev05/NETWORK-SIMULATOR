/**
 * devices/be15000/lessons/bai4.js
 * Bài 4 - Quản lý tài khoản trên BE15000
 */

window.DEVICE_BE15000_LESSONS = window.DEVICE_BE15000_LESSONS || [];

window.DEVICE_BE15000_LESSONS.push({
  id: 'be15-bai4',
  title: 'Bài 4 - Quản lý tài khoản',
  subtitle: 'Thay đổi mật khẩu đăng nhập và quản lý user',
  instructions: [
    'Chọn menu <b>Account Management</b>',
    '- Current Password: <span class="val">Mật khẩu hiện tại</span>',
    '- New Password: <span class="val">Mật khẩu mới (8+ ký tự)</span>',
    '- Confirm Password: <span class="val">Nhập lại mật khẩu mới</span>',
    'Bấm <b>Apply</b>',
    '⚠️ Sau khi đổi sẽ cần đăng nhập lại',
  ],
  practiceUrl: '/sim_be15000/page/accountMgr',
  grading: {
    description: 'Kiểm tra thao tác đổi mật khẩu Account Management',
    rules: []
  },
  guidePopups: []
});
