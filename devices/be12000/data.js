/**
 * devices/be12000/data.js — Dữ liệu & Kịch bản thực hành cho BE12000 (ZTE F8728D)
 */

window.DEVICE_BE12000 = {
  id: 'be12000',
  name: 'BE12000',
  shortName: 'BE12000',
  port: 8080,
  folder: 'sim_be12000',
  serverBat: 'chay_server.bat',
  needsServer: false,
  loginUrl: '/sim_be12000/login',
  categories: [
    {
      title: 'HỌC TẬP',
      lessons: [
        {
          id: 'be12-bai1',
          title: 'Bài 1 - Quản lý LAN IPv4',
          subtitle: 'Cấu hình địa chỉ IP LAN và DHCP Server',
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
            description: 'Kiểm tra LAN IPv4 Management',
            rules: []
          }
        },
        {
          id: 'be12-bai2',
          title: 'Bài 2 - Cấu hình Wi-Fi MLO (Wi-Fi 7)',
          subtitle: 'Cấu hình Multi-Link Operation (MLO) trên BE12000',
          instructions: [
            'Chọn menu <b>Local Network > WLAN > MLO</b>',
            '- MLO Enable: <span class="val">On</span>',
            '- SSID Name: <span class="val">FPT_BE12000_MLO</span>',
            'Bấm <b>Apply</b> để lưu cấu hình',
          ],
          practiceUrl: '/sim_be12000/login',
          grading: {
            description: 'Kiểm tra WLAN MLO configuration',
            rules: []
          }
        },
        {
          id: 'be12-bai3',
          title: 'Bài 3 - Trạng thái WAN Ethernet',
          subtitle: 'Xem thông tin và trạng thái kết nối WAN',
          instructions: [
            'Chọn menu <b>Internet > Status > WAN</b>',
            '- Kiểm tra trạng thái kết nối Internet',
            '- Xem địa chỉ IP WAN, Gateway, DNS',
            '- Kiểm tra uptime và gói tin gửi/nhận',
          ],
          practiceUrl: '/sim_be12000/login',
          grading: {
            description: 'Kiểm tra Ethernet WAN Status',
            rules: []
          }
        },
        {
          id: 'be12-bai4',
          title: 'Bài 4 - Chẩn đoán mạng (Network Diag)',
          subtitle: 'Sử dụng công cụ Ping và Traceroute',
          instructions: [
            'Chọn menu <b>Management > Network Diagnostics</b>',
            '<b>Ping Test:</b>',
            '- Target IP/Domain: <span class="val">8.8.8.8</span>',
            '- Bấm <b>Start Ping</b>',
          ],
          practiceUrl: '/sim_be12000/login',
          grading: {
            description: 'Kiểm tra thao tác Network Diagnostics',
            rules: []
          }
        },
        {
          id: 'be12-bai5',
          title: 'Bài 5 - Quản lý Tài Khoản & Mật Khẩu',
          subtitle: 'Thay đổi mật khẩu đăng nhập admin',
          instructions: [
            'Chọn menu <b>Management > Account Management</b>',
            '- Old Password: <span class="val">admin</span>',
            '- New Password: <span class="val">Mật khẩu mới</span>',
            'Bấm <b>Apply</b> để thay đổi',
          ],
          practiceUrl: '/sim_be12000/login',
          grading: {
            description: 'Kiểm tra Account Management',
            rules: []
          }
        },
        {
          id: 'be12-bai6',
          title: 'Bài 6 - Cấu hình SNTP Đồng Bộ Thời Gian',
          subtitle: 'Thiết lập máy chủ thời gian NTP',
          instructions: [
            'Chọn menu <b>Internet > SNTP</b>',
            '- Server 1: <span class="val">time.google.com</span>',
            '- Timezone: <span class="val">GMT+7</span>',
            'Bấm <b>Apply</b>',
          ],
          practiceUrl: '/sim_be12000/login',
          grading: {
            description: 'Kiểm tra SNTP Configuration',
            rules: []
          }
        },
        {
          id: 'be12-bai7',
          title: 'Bài 7 - Khởi Động Lại & Khôi Phục Cài Đặt Gốc',
          subtitle: 'Reboot thiết bị hoặc Reset Factory',
          instructions: [
            'Chọn menu <b>Management > Reboot & Reset</b>',
            '- Reboot: Bấm <b>Restart</b>',
            '- Factory Reset: Bấm <b>Restore Factory Default</b>',
          ],
          practiceUrl: '/sim_be12000/login',
          grading: {
            description: 'Kiểm tra Reboot & Reset',
            rules: []
          }
        }
      ]
    }
  ]
};
