/**
 * devices/ax3000s/lessons/bai5.js
 * Bài 5: Cấu hình DNS trên AX3000S
 */

window.DEVICE_AX3000S_LESSONS = window.DEVICE_AX3000S_LESSONS || [];

const lessonObj5 = {
  id: 'LAB_AX3000S_05',
  title: 'Bài 5 - Cấu hình DNS',
  subtitle: 'Cấu hình máy chủ phân giải tên miền (DNS)',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình DNS trên thiết bị và cấu hình các máy chủ DNS theo yêu cầu sau:',
    '- DNS Server 1: <span class="val">210.245.31.220</span> (DNS của FPT)',
    '- DNS Server 2: <span class="val">8.8.8.8</span> (DNS của Google)',
    '<br>',
    '<i>Gợi ý IP DNS FPT: 210.245.31.220, 210.245.31.221 (Nam), 210.31.1.253, 21.31.1.254 (Bắc)</i>',
    '<i>Gợi ý IP DNS Google: 8.8.8.8, 8.8.4.4 (GG)</i>',
    '<i>Gợi ý IP DNS Cloudflare: 1.1.1.1 (CF)</i>'
  ],
  practiceUrl: '/sim_ax3000s/app.html#lancfgv4',
  clearFields: [
    '#dnsPrimary',
    '#dnsSecondary'
  ],
  grading: {
    description: 'Kiểm tra cấu hình máy chủ DNS',
    rules: [
      {
        id: 'dns_mode',
        name: 'IPv4 DNS Mode',
        selector: '#dnsmode2',
        expected: ['1', 'on', 'true', 'ON'],
        type: 'any_of',
        trim: true,
        required: true,
        errorMessage: 'Bạn cần chọn chế độ DNS là Static'
      },
      {
        id: 'dns_primary',
        name: 'Primary DNS',
        selector: '#dnsPrimary',
        expected: '210.245.31.220',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'dns_secondary',
        name: 'Secondary DNS',
        selector: '#dnsSecondary',
        expected: '8.8.8.8',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
};

const existingIndex5 = window.DEVICE_AX3000S_LESSONS.findIndex(l => l.id === 'LAB_AX3000S_05');
if (existingIndex5 !== -1) {
    window.DEVICE_AX3000S_LESSONS[existingIndex5] = lessonObj5;
} else {
    window.DEVICE_AX3000S_LESSONS.push(lessonObj5);
}
