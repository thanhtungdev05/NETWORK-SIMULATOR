/**
 * devices/vigor2927/data.js — Dữ liệu & Kịch bản thực hành cho Vigor2927
 */

window.DEVICE_VIGOR2927 = {
  id: 'vigor2927',
  name: 'Vigor2927',
  shortName: 'Vigor2927',
  port: 8080,
  folder: 'sim_vigor2927',
  serverBat: 'Chay-server.bat',
  needsServer: false,
  loginUrl: '/sim_vigor2927/weblogin.htm',
  categories: [
    {
      title: 'HỌC TẬP',
      lessons: [
        {
          id: 'vg2927-bai1',
          title: 'Bài 1: Khám phá Vigor2927',
          subtitle: 'Đăng nhập và xem trạng thái',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Đăng nhập vào thiết bị và xem trạng thái thiết bị',
            '- Username: <span class="val">admin</span>',
            '- Password: <span class="val">admin</span>',
          ],
          practiceUrl: '/sim_vigor2927/weblogin.htm',
          grading: {
            description: 'Kiểm tra đăng nhập',
            rules: []
          }
        }
      ]
    }
  ]
};
