/**
 * devices/ax3000c/lessons/bai5.js
 * Bài 5: Cấu hình đổi IP LAN trên AX3000C
 */

window.DEVICE_AX3000C_LESSONS = window.DEVICE_AX3000C_LESSONS || [];

window.DEVICE_AX3000C_LESSONS.push({
  id: 'LAB_AX3000C_05',
  title: 'Cấu hình DHCP',
  subtitle: 'Cấu hình DHCP',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện thay đổi cấu hình địa chỉ IP LAN trên thiết bị theo các thông số được cung cấp dưới đây.',
    '- Router LAN IPv4 Address: <span class="val">192.168.100.1</span>',
    '- Subnet mask: <span class="val">255.255.255.0</span>',
    '- DHCP start address: <span class="val">192.168.100.2</span>',
    '- DHCP end address: <span class="val">192.168.100.249</span>',
  ],
  practiceUrl: '/sim_ax3000c/#/network/lan',
  grading: {
    description: 'Kiểm tra IP LAN và dải DHCP Pool trên AX3000C',
    rules: [
      {
        id: 'lan_ip',
        name: 'Router LAN IP Address',
        selector: '.card .bd .row:nth-child(1) input, input[value="192.168.100.1"]',
        expected: '192.168.100.1',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'subnet_mask',
        name: 'Subnet Mask',
        selector: '.card .bd .row:nth-child(2) input, input[value="255.255.255.0"]',
        expected: '255.255.255.0',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'dhcp_start',
        name: 'DHCP Start Address',
        selector: '.card .bd .row:nth-child(3) input, input[value="192.168.100.2"]',
        expected: '192.168.100.2',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'dhcp_end',
        name: 'DHCP End Address',
        selector: '.card .bd .row:nth-child(4) input, input[value="192.168.100.249"]',
        expected: '192.168.100.249',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: [
    {
      selector: 'li.el-submenu:not(.is-opened) .el-submenu__title:contains("Network")',
      text: 'Chọn Network',
      position: 'right',
      hideOnPage: 'lan'
    },
    {
      selector: 'li.el-submenu.is-opened li.el-submenu:not(.is-opened) .el-submenu__title:contains("LAN")',
      text: 'Chọn LAN',
      position: 'right',
      hideOnPage: 'lan'
    },
    {
      selector: 'li.el-submenu.is-opened li.el-submenu.is-opened li.el-menu-item:contains("LAN"), li.el-submenu.is-opened li.el-menu-item:contains("LAN")',
      text: 'Chọn LAN',
      position: 'right',
      hideOnPage: 'lan'
    },
    {
      selector: '.card .bd .row:nth-child(1) input, input[value="192.168.100.1"]',
      text: 'Bước 1: đặt IP cho Router ví dụ: 192.168.100.1',
      position: 'right',
      page: 'lan'
    },
    {
      selector: '.card .bd .row:nth-child(2) input, input[value="255.255.255.0"]',
      text: 'Bước 2: đặt Subnet mask ví dụ: 255.255.255.0',
      position: 'right',
      page: 'lan'
    },
    {
      selector: '.card .bd .row:nth-child(3) input, input[value="192.168.100.2"]',
      text: 'Bước 3: Kiểm tra IP động đầu tiên đã tự nhảy thành 192.168.100.2',
      position: 'right',
      page: 'lan'
    },
    {
      selector: '.card .bd .row:nth-child(4) input, input[value="192.168.100.249"]',
      text: 'Bước 4: Kiểm tra IP động sau cùng đã tự nhảy thành 192.168.100.249',
      position: 'right',
      page: 'lan'
    },
    {
      selector: 'button.apply, button.btn.apply, button[onclick*="save"], input[type="submit"]',
      text: 'Bước 5: chọn Apply',
      position: 'right',
      page: 'lan'
    }
  ]
});
