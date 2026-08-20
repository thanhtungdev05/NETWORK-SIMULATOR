/**
 * devices/ax3000s/lessons/bai1.js
 * Bài 1: Cấu hình PPPoE trên AX3000S
 */

window.DEVICE_AX3000S_LESSONS = window.DEVICE_AX3000S_LESSONS || [];

window.DEVICE_AX3000S_LESSONS.push({
  id: 'LAB_AX3000S_01',
  title: 'Bài 1-Cấu hình PPPoE',
  subtitle: 'Thiết lập kết nối Internet PPPoE cho AX3000S',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình kết nối WAN/Internet trên thiết bị và thiết lập kết nối PPPoE theo các thông số được cung cấp dưới đây:',
    '- Username: <span class="val">hnfdl-123456-789</span>',
    '- Password: <span class="val">d123456</span>',
  ],
  practiceUrl: '/sim_ax3000s/app.html#wancfg',
  clearFields: [
    'input[name="userName"]',
    'input[name="uPsd"]'
  ],
  grading: {
    description: 'Kiểm tra WAN Configuration trên AX3000S',
    rules: [
      {
        id: 'ppp_user',
        name: 'PPPoE Username',
        selector: 'input[name="userName"], #userName',
        expected: 'hnfdl-123456-789',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'ppp_pwd',
        name: 'PPPoE Password',
        selector: 'input[name="uPsd"], #uPsd',
        expected: 'd123456',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
