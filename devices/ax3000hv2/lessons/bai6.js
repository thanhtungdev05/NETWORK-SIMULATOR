/**
 * devices/ax3000hv2/lessons/bai6.js
 * Bài 6: Cấu hình DHCP Reservation trên AX3000H v2
 */

window.DEVICE_AX3000HV2_LESSONS = window.DEVICE_AX3000HV2_LESSONS || [];

window.DEVICE_AX3000HV2_LESSONS.push({
  id: 'ax3hv2-bai6',
  title: 'Bài 6: Cấu hình DHCP Reservation',
  subtitle: 'Gán địa chỉ IP cố định (Static DHCP) cho thiết bị',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình DHCP Reservation (Gán IP cố định) theo thông số:',
    '- MAC Address: <span class="val">AA:BB:CC:DD:EE:FF</span>',
    '- IP Address: <span class="val">192.168.1.100</span>',
  ],
  practiceUrl: '/sim_ax3000hv2/cgi-bin/index.asp?page=home_lan.asp',
  grading: {
    description: 'Kiểm tra DHCP Reservation settings',
    rules: [
      {
        id: 'res_mac',
        name: 'Địa chỉ MAC',
        selector: 'input[name="res_mac"], input[name*="mac"], #mac',
        expected: 'AA:BB:CC:DD:EE:FF',
        type: 'case_insensitive',
        trim: true,
        required: true
      },
      {
        id: 'res_ip',
        name: 'Địa chỉ IP gán',
        selector: 'input[name="res_ip"], input[name*="ip"], #ip',
        expected: '192.168.1.100',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
