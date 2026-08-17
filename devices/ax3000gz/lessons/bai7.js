/**
 * devices/ax3000gz/lessons/bai7.js
 * Bài 7: Cấu hình SNTP trên AX3000GZ
 */

window.DEVICE_AX3000GZ_LESSONS = window.DEVICE_AX3000GZ_LESSONS || [];

window.DEVICE_AX3000GZ_LESSONS.push({
  id: 'ax3gz-bai7',
  title: 'Bài 7: Cấu hình SNTP',
  subtitle: 'Đồng bộ thời gian hệ thống qua máy chủ SNTP',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình máy chủ đồng bộ thời gian SNTP:',
    '- Server IP/Domain: <span class="val">pool.ntp.org</span>',
    '- Time Zone: <span class="val">GMT+07:00</span>',
  ],
  practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/management/system/backuprestore',
  grading: {
    description: 'Kiểm tra cấu hình SNTP trên AX3000GZ',
    rules: [
      {
        id: 'sntp_server',
        name: 'SNTP Server',
        selector: 'input[name="sntp_server"], input[name*="ntp"]',
        expected: 'pool.ntp.org',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
