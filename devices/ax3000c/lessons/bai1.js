/**
 * devices/ax3000c/lessons/bai1.js
 * Bài 1: Cấu hình PPPoE trên AX3000C
 */

window.DEVICE_AX3000C_LESSONS = window.DEVICE_AX3000C_LESSONS || [];

window.DEVICE_AX3000C_LESSONS.push({
  id: 'LAB_AX3000CV2_01',
  title: 'Bài 1-Cấu hình PPPoE',
  subtitle: 'Thiết lập kết nối WAN/Internet với tài khoản PPPoE',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình kết nối WAN/Internet trên thiết bị và thiết lập kết nối PPPoE theo các thông số được cung cấp dưới đây:',
    '- Username: <span class="val">Sgfdl-123456-789</span>',
    '- Password: <span class="val">d123456</span>',
  ],
  practiceUrl: '/sim_ax3000c/#/home',
  clearFields: [
    '.grp[data-t="PPPoE"] input[type="text"]',
    '#pppw'
  ],
  grading: {
    description: 'Kiểm tra cấu hình PPPoE trên AX3000C',
    rules: [
      {
        id: 'pppoe_user',
        name: 'PPPoE Username',
        selector: '.grp[data-t="PPPoE"] input[type="text"], input[name="username"], #username',
        expected: 'Sgfdl-123456-789',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'pppoe_pwd',
        name: 'PPPoE Password',
        selector: '#pppw, .grp[data-t="PPPoE"] input[type="password"], input[name="password"]',
        expected: 'd123456',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: [
    {
      selector: '.el-submenu:not(.is-opened) .el-submenu__title:contains("Network")',
      text: 'Chọn Network',
      position: 'right',
      hideOnPage: 'wan'
    },
    {
      selector: 'li.el-submenu.is-opened li.el-submenu:not(.is-opened) .el-submenu__title:contains("WAN")',
      text: 'Chọn WAN',
      position: 'right',
      hideOnPage: 'wan'
    },
    {
      selector: 'li.el-submenu.is-opened li.el-submenu.is-opened .el-menu-item:contains("WAN")',
      text: 'Chọn WAN',
      position: 'right',
      hideOnPage: 'wan'
    },
    {
      selector: 'select#ctype, select[name="proto"]',
      text: 'Bước 1: Chọn PPPOE',
      position: 'right',
      page: 'wan'
    },
    {
      selector: '.grp[data-t="PPPoE"] input[type="text"], input[name="username"], #username',
      text: 'Bước 2: nhập tên VD: sgfdl-123456-789',
      position: 'right',
      page: 'wan'
    },
    {
      selector: '#pppw, .grp[data-t="PPPoE"] input[type="password"], input[name="password"]',
      text: 'Bước 3: Nhập mật khẩu VD: d123456',
      position: 'right',
      page: 'wan'
    },
    {
      selector: 'button.apply, button.btn.apply, button[onclick*="save"], input[type="submit"], #save, .btn-save',
      text: 'Bước 4: Chọn SAVE',
      position: 'right',
      page: 'wan'
    }
  ]
});
