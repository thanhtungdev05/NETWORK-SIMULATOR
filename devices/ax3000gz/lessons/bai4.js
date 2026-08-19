/**
 * devices/ax3000gz/lessons/bai4.js
 * Bài 4: Cấu hình Mesh WiFi trên AX3000GZ
 */

window.DEVICE_AX3000GZ_LESSONS = window.DEVICE_AX3000GZ_LESSONS || [];

window.DEVICE_AX3000GZ_LESSONS.push({
  id: 'LAB_AX3000GZ_04',
  title: 'Bài 4: Cấu hình Mesh WiFi',
  subtitle: 'Thiết lập và quản lý mạng Mesh WiFi',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình tính năng Mesh WiFi liên kết các thiết bị trong hệ thống:',
    '- Roaming Limit(2.4G): <span class="val">-65</span>',
    '- Roaming Limit(5G): <span class="val">-65</span>',
  ],
  practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/localnetwork/WLAN/WLANbasic',
  grading: {
    description: 'Kiểm tra Mesh WiFi settings',
    rules: [
      {
        id: 'roaming_24g',
        name: 'Roaming Limit 2.4G',
        selector: 'input[name="roaming_24g"], input[name*="roaming_24"]',
        expected: '-65',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'roaming_5g',
        name: 'Roaming Limit 5G',
        selector: 'input[name="roaming_5g"], input[name*="roaming_5"]',
        expected: '-65',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
