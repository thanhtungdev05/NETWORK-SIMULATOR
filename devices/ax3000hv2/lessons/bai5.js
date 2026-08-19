/**
 * devices/ax3000hv2/lessons/bai5.js
 * Bài 5: Cấu hình LAN Based trên AX3000H v2
 */

window.DEVICE_AX3000HV2_LESSONS = window.DEVICE_AX3000HV2_LESSONS || [];

window.DEVICE_AX3000HV2_LESSONS.push({
  id: 'LAB_AX3000HV2_05',
  title: 'Bài 5: Cấu hình LAN Based',
  subtitle: 'Thay đổi địa chỉ IP LAN và dải DHCP Pool',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện thay đổi cấu hình địa chỉ IP LAN trên thiết bị theo các thông số được cung cấp dưới đây:',
    '- IP Address: <span class="val">192.168.1.1</span>',
    '- IP Subnet Mask: <span class="val">255.255.255.0</span>',
    '- Start IP: <span class="val">192.168.1.2</span>',
    '- End IP: <span class="val">192.168.1.254</span>',
    '- Lease Time: <span class="val">86400</span>',
  ],
  practiceUrl: '/sim_ax3000hv2/cgi-bin/index.asp?page=home_lan.asp',
  clearFields: [
    'input[name="uiViewIPAddr"]',
    'input[name="uiViewNetMask"]',
    'input[name="StartIp"]',
    'input[name="PoolSize"]',
    'input[name="dhcp_LeaseTime"]'
  ],
  grading: {
    description: 'Kiểm tra LAN Router IP & DHCP Range trên AX3000Hv2',
    rules: [
      {
        id: 'lan_ip',
        name: 'IP Address LAN',
        selector: 'input[name="uiViewIPAddr"], input[name="ipAddress"], #ipAddress',
        expected: '192.168.1.1',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'lan_mask',
        name: 'Subnet Mask',
        selector: 'input[name="uiViewNetMask"], input[name="subnetMask"]',
        expected: '255.255.255.0',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'dhcp_start',
        name: 'Start IP Pool',
        selector: 'input[name="StartIp"], input[name="startIP"]',
        expected: '192.168.1.2',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'dhcp_end',
        name: 'End IP Pool',
        selector: 'input[name="EndIp"], input[name="endIP"]',
        expected: '192.168.1.254',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
