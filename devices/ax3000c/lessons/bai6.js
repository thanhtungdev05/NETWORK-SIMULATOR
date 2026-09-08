/**
 * devices/ax3000c/lessons/bai6.js
 * Bài 6: Cấu hình Port Forwarding trên AX3000C
 */

window.DEVICE_AX3000C_LESSONS = window.DEVICE_AX3000C_LESSONS || [];

window.DEVICE_AX3000C_LESSONS.push({
  id: 'LAB_AX3000CV2_06',
  title: 'Cấu hình Port Forwarding',
  subtitle: 'Cấu hình Port Forwarding',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình Mở Port trên thiết bị theo các thông số được cung cấp dưới đây.',
    '- Rule Name: <span class="val">Camera</span>',
    '- Protocol: <span class="val">TCP+UDP</span>',
    '- External Port: <span class="val">8080</span>',
    '- Internal IP: <span class="val">192.168.100.55</span>',
    '- Internal Port: <span class="val">80</span>'
  ],
  practiceUrl: '/sim_ax3000c/#/network/portfwd',
  grading: {
    description: 'Kiểm tra Port Forwarding Rules trên AX3000C',
    rules: [
      {
        id: 'rule_name',
        name: 'Rule Name',
        selector: 'table tr td:nth-child(1) input',
        expected: 'Camera',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'protocol',
        name: 'Protocol',
        selector: 'table tr td:nth-child(2) select',
        expected: 'TCP+UDP',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'ext_port',
        name: 'External Port',
        selector: 'table tr td:nth-child(3) input',
        expected: '8080',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'int_ip',
        name: 'Internal IP',
        selector: 'table tr td:nth-child(4) input',
        expected: '192.168.100.55',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'int_port',
        name: 'Internal Port',
        selector: 'table tr td:nth-child(5) input',
        expected: '80',
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
      hideOnPage: 'portfwd'
    },
    {
      selector: 'li.el-submenu.is-opened li.el-submenu:not(.is-opened) .el-submenu__title:contains("Access")',
      text: 'Chọn Access',
      position: 'right',
      hideOnPage: 'portfwd'
    },
    {
      selector: 'li.el-submenu.is-opened li.el-submenu.is-opened li.el-menu-item:contains("Port")',
      text: 'Chọn Port Forwarding',
      position: 'right',
      hideOnPage: 'portfwd'
    },
    {
      selector: 'button[onclick="simAdd()"]',
      text: 'Bước 1: chọn Add để thêm rule',
      position: 'bottom',
      page: 'portfwd'
    },
    {
      selector: 'table tr td:nth-child(1) input',
      text: 'Bước 2: nhập Rule name ví dụ: Camera',
      position: 'bottom',
      page: 'portfwd'
    },
    {
      selector: 'table tr td:nth-child(2) select',
      text: 'Bước 3: chọn Protocol TCP+UDP',
      position: 'bottom',
      page: 'portfwd'
    },
    {
      selector: 'table tr td:nth-child(3) input',
      text: 'Bước 4: nhập External port ví dụ: 8080',
      position: 'bottom',
      page: 'portfwd'
    },
    {
      selector: 'table tr td:nth-child(4) input',
      text: 'Bước 5: nhập Internal IP ví dụ: 192.168.100.55',
      position: 'bottom',
      page: 'portfwd'
    },
    {
      selector: 'table tr td:nth-child(5) input',
      text: 'Bước 6: nhập Internal port ví dụ: 80',
      position: 'bottom',
      page: 'portfwd'
    },
    {
      selector: 'button.apply[onclick="simState.save()"]',
      text: 'Bước 7: chọn Apply',
      position: 'right',
      page: 'portfwd'
    }
  ]
});
