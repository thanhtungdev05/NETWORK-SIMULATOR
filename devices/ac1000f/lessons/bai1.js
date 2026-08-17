/**
 * devices/ac1000f/lessons/bai1.js
 * Bài 1: Cấu hình PPPoE trên ONT AC1000F
 */

window.DEVICE_AC1000F_LESSONS = window.DEVICE_AC1000F_LESSONS || [];

window.DEVICE_AC1000F_LESSONS.push({
  id: 'LAB_AC1000F_01',
  title: 'Bài 1: Cấu hình PPPoE',
  subtitle: 'Thiết lập kết nối WAN/Internet với tài khoản PPPoE',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình kết nối WAN/Internet trên thiết bị và thiết lập kết nối PPPoE theo các thông số được cung cấp dưới đây:',
    '- Username: <span class="val">Sgfdl-210208-218</span>',
    '- Password: <span class="val">fpt12345</span>',
  ],
  practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=home_wan.asp',

  // Xóa trắng các ô nhập liệu khi bài lab mở (học viên phải tự nhập)
  clearFields: [
    'input[name="wan_PPPUsername"]',
    'input[name="wan_PPPPassword"]',
  ],

  // Ràng buộc điều kiện chấm đúng (10 tiêu chí)
  grading: {
    description: 'Kiểm tra cấu hình PPPoE trên AC1000F',
    rules: [
      {
        id: 'wanTypeRadio',
        name: 'Connection Type',
        selector: 'select[name="wanTypeRadio"]',
        expected: '2',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'wan_dot1q',
        name: '802.1q',
        selector: 'select[name="wan_dot1q"]',
        expected: 'No',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'wan_vid',
        name: 'VLAN ID',
        selector: 'input[name="wan_vid"]',
        expected: '0',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'wan_mvlan',
        name: 'Multi VLan Option',
        selector: 'input[name="wan_mvlan"]',
        expected: '-1',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'wan_NAT',
        name: 'NAT Status',
        selector: 'input[name="wan_NAT"]:checked',
        expected: 'Enable',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'wan_PPPUsername',
        name: 'PPPoE Username',
        selector: 'input[name="wan_PPPUsername"]',
        expected: 'Sgfdl-210208-218',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'wan_PPPPassword',
        name: 'PPPoE Password',
        selector: 'input[name="wan_PPPPassword"]',
        expected: 'fpt12345',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'wan_ConnectSelect',
        name: 'PPPoE Connection Mode',
        selector: 'select[name="wan_ConnectSelect"]',
        expected: 'Connect_Keep_Alive',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'wan_TCPMTU2',
        name: 'TCP MTU Option',
        selector: 'input[name="wan_TCPMTU2"]',
        expected: '0',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'EDNSMode',
        name: 'Add Client Mac Option',
        selector: 'input[name="EDNSMode"]:checked',
        expected: 'No',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  }
});


