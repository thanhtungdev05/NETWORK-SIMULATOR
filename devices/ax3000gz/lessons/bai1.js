/**
 * devices/ax3000gz/lessons/bai1.js
 * Bài 1: Cấu hình ONT trên AX3000GZ
 */

window.DEVICE_AX3000GZ_LESSONS = window.DEVICE_AX3000GZ_LESSONS || [];

window.DEVICE_AX3000GZ_LESSONS.push({
  id: 'LAB_AX3000GZ_01',
  title: 'Bài 1 - Cấu hình ONT',
  subtitle: 'Thiết lập kết nối WAN/ONT trên AX3000GZ',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình kết nối WAN/ONT trên thiết bị và thiết lập kết nối PPPoE theo các thông số được cung cấp dưới đây:',
    '- Username: <span class="val">fpt</span>',
    '- Password: <span class="val">fpt12345</span>',
  ],
  practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/wan/interface',
  clearFields: [
    '[id="widget.cbid.network.wan.username"]',
    '[id="widget.cbid.network.wan.password"]'
  ],
  grading: {
    description: 'Kiểm tra WAN/ONT Interface trên AX3000GZ',
    rules: [
      {
        id: 'wan_username',
        name: 'PPPoE Username',
        selector: '[id="widget.cbid.network.wan.username"]',
        expected: 'fpt',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'wan_password',
        name: 'PPPoE Password',
        selector: '[id="widget.cbid.network.wan.password"]',
        expected: 'fpt12345',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
