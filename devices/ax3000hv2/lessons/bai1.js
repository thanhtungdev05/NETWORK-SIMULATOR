/**
 * devices/ax3000hv2/lessons/bai1.js
 * Bài 1: Cấu hình PPPoE trên AX3000H v2
 */

window.DEVICE_AX3000HV2_LESSONS = window.DEVICE_AX3000HV2_LESSONS || [];

window.DEVICE_AX3000HV2_LESSONS.push({
  id: 'LAB_AX3000HV2_01',
  title: 'Bài 1: Cấu hình PPPoE',
  subtitle: 'Thiết lập kết nối Internet PPPoE cho AX3000H v2',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình kết nối WAN/Internet trên thiết bị và thiết lập kết nối PPPoE theo các thông số được cung cấp dưới đây:',
    '- Username: <span class="val">fpt</span>',
    '- Password: <span class="val">fpt12345</span>',
  ],
  practiceUrl: '/sim_ax3000hv2/cgi-bin/index.asp?page=home_wan.asp',
  clearFields: [
    'input[name="pppUserName"]',
    'input[name="pppPassword"]'
  ],
  grading: {
    description: 'Kiểm tra cấu hình PPPoE trên AX3000H v2',
    rules: [
      {
        id: 'wan_username',
        name: 'PPPoE Username',
        selector: 'input[name="wan_PPPUsername"], input[name="pppUserName"], input[name="username"]',
        expected: 'fpt',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'wan_password',
        name: 'PPPoE Password',
        selector: 'input[name="wan_PPPPassword"], input[name="pppPassword"], input[name="password"]',
        expected: 'fpt12345',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
