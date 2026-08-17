/**
 * devices/ax3000s/lessons/bai7.js
 * Bài 7: Cấu hình Mesh wifi trên AX3000S
 */

window.DEVICE_AX3000S_LESSONS = window.DEVICE_AX3000S_LESSONS || [];

window.DEVICE_AX3000S_LESSONS.push({
  id: 'ax3s-bai7',
  title: 'Bài 7-Cấu hình Mesh wifi',
  subtitle: 'Thiết lập và quản lý mạng Mesh WiFi',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình tính năng Mesh WiFi liên kết các thiết bị trong hệ thống:',
    '- Role: <span class="val">Controller</span>',
  ],
  practiceUrl: '/sim_ax3000s/app.html#wlanBasicSetting2g',
  grading: {
    description: 'Kiểm tra Mesh WiFi settings trên AX3000S',
    rules: [
      {
        id: 'mesh_role',
        name: 'Mesh Role',
        selector: 'select[name="role"], select[name*="mesh"], #mesh_role',
        expected: 'Controller',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
