/**
 * devices/ax3000gz/lessons/bai7.js
 * Bài 7: Cấu hình SNTP trên AX3000GZ
 */

window.DEVICE_AX3000GZ_LESSONS = window.DEVICE_AX3000GZ_LESSONS || [];

window.DEVICE_AX3000GZ_LESSONS.push({
  id: 'LAB_AX3000GZ_07',
  title: 'Bài 7: Cấu hình SNTP',
  subtitle: 'Đồng bộ thời gian hệ thống qua máy chủ SNTP',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình máy chủ đồng bộ thời gian SNTP:',
    '- Time Zone: <span class="val">GMT+07:00</span> (chọn Asia/Ho Chi Minh)',
    '- NTP server candidates: <span class="val">vn.pool.ntp.org</span> và <span class="val">asia.pool.ntp.org</span>',
  ],
  practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/sntp',
  clearFields: [
    '[id="widget.cbid.system.cfg01e48a.zonename"]'
  ],
  grading: {
    description: 'Kiểm tra cấu hình SNTP trên AX3000GZ',
    rules: [
      {
        id: 'sntp_server',
        name: 'NTP Server candidates',
        selector: '[id="cbid.system.cfg01e48a.server"] input[value="vn.pool.ntp.org"], [id="cbid.system.cfg01e48a.server"] input[value="asia.pool.ntp.org"]',
        expected: ['vn.pool.ntp.org', 'asia.pool.ntp.org'],
        type: 'any_of',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
