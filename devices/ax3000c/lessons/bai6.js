/**
 * devices/ax3000c/lessons/bai6.js
 * Bài 6: Cấu hình Port Forwarding trên AX3000C
 */

window.DEVICE_AX3000C_LESSONS = window.DEVICE_AX3000C_LESSONS || [];

window.DEVICE_AX3000C_LESSONS.push({
  id: 'LAB_AX3000C_06',
  title: 'Cấu hình Port Forwarding',
  subtitle: 'Cấu hình Port Forwarding',
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
        selector: 'table tr td:nth-child(3) input',
        expected: '8080',
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
      selector: 'table tr td:nth-child(3) input',
      text: 'Bước 2: nhập External port ví dụ: 8080',
      position: 'bottom',
      page: 'portfwd'
    },
    {
      selector: 'table tr td:nth-child(5) input',
      text: 'Bước 3: nhập Internal port ví dụ: 80',
      position: 'bottom',
      page: 'portfwd'
    },
    {
      selector: 'button.apply[onclick="simState.save()"]',
      text: 'Bước 4: chọn Apply',
      position: 'right',
      page: 'portfwd'
    }
  ]
});
