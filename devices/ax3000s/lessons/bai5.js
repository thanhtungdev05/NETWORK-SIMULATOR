/**
 * devices/ax3000s/lessons/bai5.js
 * Bài 5: Cấu hình địa chỉ IP LAN trên AX3000S
 */

window.DEVICE_AX3000S_LESSONS = window.DEVICE_AX3000S_LESSONS || [];

window.DEVICE_AX3000S_LESSONS.push({
  id: 'LAB_AX3000S_05',
  title: 'Bài 5-Cấu hình địa chỉ IP LAN',
  subtitle: 'Thay đổi địa chỉ IP LAN và dải DHCP Pool',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện thay đổi cấu hình địa chỉ IP LAN trên thiết bị theo các thông số được cung cấp dưới đây:',
    '- IP Address: <span class="val">192.168.1.1</span>',
    '- IP Subnet Mask: <span class="val">255.255.255.0</span>',
    '- Start IP: <span class="val">192.168.1.2</span>',
    '- IP Pool Count: <span class="val">253</span>',
    '- Lease Time: <span class="val">2 minute or 1 hour</span>',
  ],
  practiceUrl: '/sim_ax3000s/app.html#lancfgv4',
  clearFields: [
    'input[name="ethIpAddress"]',
    'input[name="ethSubnetMask"]',
    'input[name="dhcpEthStart"]'
  ],
  grading: {
    description: 'Kiểm tra LAN Configuration IPv4 trên AX3000S',
    rules: [
      {
        id: 'lan_ip',
        name: 'IP Address',
        selector: 'input[name="ethIpAddress"], #ethIpAddress',
        expected: '192.168.1.1',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'lan_mask',
        name: 'Subnet Mask',
        selector: 'input[name="ethSubnetMask"], #ethSubnetMask',
        expected: '255.255.255.0',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'dhcp_start',
        name: 'Start IP',
        selector: 'input[name="dhcpEthStart"], #dhcpEthStart',
        expected: '192.168.1.2',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
