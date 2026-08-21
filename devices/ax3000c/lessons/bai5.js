/**
 * devices/ax3000c/lessons/bai5.js
 * Bài 5: Cấu hình NAT Port trên AX3000C
 */

window.DEVICE_AX3000C_LESSONS = window.DEVICE_AX3000C_LESSONS || [];

window.DEVICE_AX3000C_LESSONS.push({
  id: 'LAB_AX3000CV2_05',
  title: 'Bài 5-Cấu hình NAT Port',
  subtitle: 'Mở Port (Port Forwarding) trên thiết bị',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình Mở Port trên thiết bị theo các thông số được cung cấp dưới đây.',
    '- External Port: <span class="val">8080</span>',
    '- Internal Port: <span class="val">80</span>',
  ],
  practiceUrl: '/sim_ax3000c/#/network/portfwd',
  grading: {
    description: 'Kiểm tra Port Forwarding Rules trên AX3000C',
    rules: [
      {
        id: 'ext_port',
        name: 'External Port',
        selector: 'table tr td:nth-child(3) input, input[placeholder*="8080"]',
        expected: '8080',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'int_port',
        name: 'Internal Port',
        selector: 'table tr td:nth-child(5) input, input[placeholder*="80"]',
        expected: '80',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: [
    {
      selector: '.el-submenu__title:contains("Network")',
      text: 'Chọn Network',
      position: 'right',
      hideOnPage: 'portfwd'
    },
    {
      selector: '.el-submenu__title:contains("Access")',
      text: 'Chọn Access',
      position: 'right',
      hideOnPage: 'portfwd'
    },
    {
      selector: '.el-menu-item:contains("Port Forwarding"), [index*="/network/portfwd"]',
      text: 'Chọn Port Forwarding',
      position: 'right',
      hideOnPage: 'portfwd'
    },
    {
      selector: '.sw input[type="checkbox"], .sw, table input[type="checkbox"]',
      text: 'Bước 1: chọn Enable',
      position: 'left',
      page: 'portfwd'
    },
    {
      selector: 'table select, td select',
      text: 'Bước 2: chọn TCP/UDP',
      position: 'top',
      page: 'portfwd'
    },
    {
      selector: 'table tr td:nth-child(3) input, input[placeholder*="8080"]',
      text: 'Bước 3: nhập External port ví dụ: 8080',
      position: 'bottom',
      page: 'portfwd'
    },
    {
      selector: 'table tr td:nth-child(4) select, table tr td:nth-child(4) input, input[placeholder*="192.168.100"]',
      text: 'Bước 4: chọn thiết bị ví dụ: 192.168.100.20',
      position: 'top',
      page: 'portfwd'
    },
    {
      selector: 'table tr td:nth-child(5) input, input[placeholder*="80"]',
      text: 'Bước 5: nhập Internal port ví dụ: 80',
      position: 'bottom',
      page: 'portfwd'
    },
    {
      selector: 'button.apply, button.btn.apply, button[onclick*="save"], input[type="submit"]',
      text: 'Bước 6: chọn Apply',
      position: 'right',
      page: 'portfwd'
    }
  ]
});
