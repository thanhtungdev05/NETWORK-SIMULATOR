/**
 * devices/ax3000gz/lessons/bai9.js
 * Bài 9: Cấu hình Chặn MAC trên AX3000GZ
 */

window.DEVICE_AX3000GZ_LESSONS = window.DEVICE_AX3000GZ_LESSONS || [];

window.DEVICE_AX3000GZ_LESSONS.push({
  id: 'ax3gz-bai9',
  title: 'Bài 9: Cấu hình Chặn MAC',
  subtitle: 'Lọc và quản lý quyền truy cập qua địa chỉ MAC',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình chặn/cho phép địa chỉ MAC truy cập mạng:',
    '- MAC Filter Mode: <span class="val">Blacklist / Deny</span>',
    '- MAC Address: <span class="val">AA:BB:CC:DD:EE:FF</span>',
  ],
  practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/security/filterCriteria',
  grading: {
    description: 'Kiểm tra MAC Filter configuration',
    rules: [
      {
        id: 'mac_addr',
        name: 'Địa chỉ MAC',
        selector: 'input[name="mac"], input[name*="mac"], #mac',
        expected: 'AA:BB:CC:DD:EE:FF',
        type: 'case_insensitive',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
