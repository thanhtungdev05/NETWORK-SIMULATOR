/**
 * devices/be15000/lessons/bai1.js
 * Bài 1 - Quản lý LAN IPv4 trên BE15000
 */

window.DEVICE_BE15000_LESSONS = window.DEVICE_BE15000_LESSONS || [];

window.DEVICE_BE15000_LESSONS.push({
  id: 'be15-bai1',
  title: 'Cấu hình wifi IoT',
  subtitle: 'Cấu hình wifi IoT',
  instructions: [
    'Truy cập <b>/sim_be15000</b> và đăng nhập',
    'Chọn menu <b>LAN IPv4 Management</b>',
    '- IP Address: <span class="val">192.168.1.1</span>',
    '- Subnet Mask: <span class="val">255.255.255.0</span>',
    '- DHCP Enable: <span class="val">Yes</span>',
    '- Start IP: <span class="val">192.168.1.100</span>',
    '- End IP: <span class="val">192.168.1.200</span>',
    'Bấm <b>Apply</b> để lưu',
  ],
  practiceUrl: '/sim_be15000/page/lanMgrIpv4',
  grading: {
    description: 'Kiểm tra LAN IPv4 Management trên BE15000',
    rules: [
      {
        id: 'lan_ip',
        name: 'IP Address',
        selector: 'input[name*="IPAddress"], #IPAddress',
        expected: '192.168.1.1',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'lan_mask',
        name: 'Subnet Mask',
        selector: 'input[name*="SubnetMask"], #SubnetMask',
        expected: '255.255.255.0',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
