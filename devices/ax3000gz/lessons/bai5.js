/**
 * devices/ax3000gz/lessons/bai5.js
 * Bài 5: Cấu hình IGMP trên AX3000GZ
 */

window.DEVICE_AX3000GZ_LESSONS = window.DEVICE_AX3000GZ_LESSONS || [];

window.DEVICE_AX3000GZ_LESSONS.push({
  id: 'LAB_AX3000GZ_05',
  title: 'Bài 5: Cấu hình IGMP',
  subtitle: 'Cấu hình IGMP Snooping / Proxy cho truyền hình IPTV',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình IGMP Proxy/Snooping hỗ trợ dịch vụ truyền hình:',
    '- Enable: <span class="val">On</span>',
  ],
  practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/multicast',
  clearFields: [
    'input[name="cbid.json.multicastWifi.Enable"]'
  ],
  grading: {
    description: 'Kiểm tra cấu hình IGMP trên AX3000GZ',
    rules: [
      {
        id: 'igmp_enable',
        name: 'IGMP Enable',
        selector: 'input[name="cbid.json.multicastWifi.Enable"]:checked',
        expected: 'true',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
