/**
 * devices/ax3000s/lessons/bai4.js
 * Bài 4: Cấu hình DNS trên AX3000S
 */

window.DEVICE_AX3000S_LESSONS = window.DEVICE_AX3000S_LESSONS || [];

window.DEVICE_AX3000S_LESSONS.push({
  id: 'LAB_AX3000S_04',
  title: 'Bài 4-Cấu hình DNS',
  subtitle: 'Cấu hình máy chủ DNS của FPT và Google',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình DNS trên thiết bị và cấu hình các máy chủ DNS theo yêu cầu sau:',
    '- DNS Server 1: <span class="val">210.245.31.220</span> (DNS của FPT)',
    '- DNS Server 2: <span class="val">8.8.8.8</span> (DNS của Google)',
    '<i>Gợi ý IP DNS FPT: 210.245.31.220, 210.245.31.221, 210.31.1.253, 210.31.1.254</i>',
    '<i>Gợi ý IP DNS Google: 8.8.8.8, 8.8.4.4</i>',
  ],
  practiceUrl: '/sim_ax3000s/app.html#lancfgv4',
  clearFields: [
    'input[name="dnsPrimary"]',
    'input[name="dnsSecondary"]'
  ],
  grading: {
    description: 'Kiểm tra cấu hình DNS Server trên AX3000S',
    rules: [
      {
        id: 'dns_1',
        name: 'DNS Server 1',
        selector: 'input[name="dnsPrimary"], #dnsPrimary',
        expected: '210.245.31.220',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'dns_2',
        name: 'DNS Server 2',
        selector: 'input[name="dnsSecondary"], #dnsSecondary',
        expected: '8.8.8.8',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
