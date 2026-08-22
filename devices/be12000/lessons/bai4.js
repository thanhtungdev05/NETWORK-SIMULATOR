/**
 * devices/be12000/lessons/bai1.js
 * Bài 1 - Quản lý LAN IPv4 trên BE12000
 */

window.DEVICE_BE12000_LESSONS = window.DEVICE_BE12000_LESSONS || [];

window.DEVICE_BE12000_LESSONS.push({
  id: 'LAB_BE12000_04',
  title: 'Cấu hình DNS',
  subtitle: 'Cấu hình DNS',
  instructions: [
    'Truy cập <b>/sim_be12000</b> và đăng nhập',
    'Chọn menu <b>Local Network > LAN > IPv4</b>',
    '- IP Address: <span class="val">192.168.1.1</span>',
    '- Subnet Mask: <span class="val">255.255.255.0</span>',
    '- DHCP Enable: <span class="val">Yes</span>',
    'Bấm <b>Apply</b> để lưu',
  ],
  practiceUrl: '/sim_be12000/login',
  grading: {
    description: 'Kiểm tra LAN IPv4 Management trên BE12000',
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
  guidePopups: [
    {
      selector: 'a#MM_localnet, #MM_localnet',
      text: 'Bước 1: Chọn Local Network',
      position: 'bottom'
    },
    {
      selector: 'a[href*="lanMgrIpv4"], #lanMgrIpv4',
      text: 'Bước 2: Chọn LAN > IPv4',
      position: 'right'
    },
    {
      selector: 'input[name*="IPAddress"], #IPAddress',
      text: 'Bước 3: Nhập IP Address (192.168.1.1)',
      position: 'right'
    },
    {
      selector: 'input[type="submit"], input[value="Apply"], #Btn_Apply',
      text: 'Bước 4: Bấm Apply để lưu',
      position: 'bottom'
    }
  ]
});
