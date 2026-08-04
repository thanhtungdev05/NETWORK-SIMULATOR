/**
 * devices/be15000/data.js — Dữ liệu & Kịch bản chấm thao tác cho BE15000
 */

window.DEVICE_BE15000 = {
  id: 'be15000',
  name: 'BE15000',
  shortName: 'BE15000',
  port: 8096,
  folder: 'sim_be15000',
  serverBat: 'chay_server.bat',
  needsServer: false,
  loginUrl: 'http://127.0.0.1:8096/login',
  categories: [
    {
      title: 'HỌC TẬP',
      lessons: [
        {
          id: 'be15-bai1',
          title: 'Bài 1 - Quản lý LAN IPv4',
          subtitle: 'Cấu hình địa chỉ IP LAN và DHCP Server',
          instructions: [
            'Truy cập <b>http://127.0.0.1:8096</b> và đăng nhập',
            'Chọn menu <b>LAN IPv4 Management</b>',
            '- IP Address: <span class="val">192.168.1.1</span>',
            '- Subnet Mask: <span class="val">255.255.255.0</span>',
            '- DHCP Enable: <span class="val">Yes</span>',
            '- Start IP: <span class="val">192.168.1.100</span>',
            '- End IP: <span class="val">192.168.1.200</span>',
            'Bấm <b>Apply</b> để lưu',
          ],
          practiceUrl: 'http://127.0.0.1:8096/page/lanMgrIpv4',
          grading: {
            description: 'Kiểm tra LAN IPv4 Management',
            rules: []
          }
        },
        {
          id: 'be15-bai2',
          title: 'Bài 2 - Trạng thái mạng cục bộ',
          subtitle: 'Xem thông tin và trạng thái mạng nội bộ',
          instructions: [
            'Chọn menu <b>Local Network Status</b>',
            '- Xem danh sách thiết bị kết nối',
            '- Kiểm tra IP, MAC, hostname từng máy',
            '- Xem trạng thái cổng LAN (tốc độ, duplex)',
            '- Xem traffic in/out từng interface',
          ],
          practiceUrl: 'http://127.0.0.1:8096/page/localNetStatus',
          grading: {
            description: 'Kiểm tra Local Network Status check',
            rules: []
          }
        },
        {
          id: 'be15-bai3',
          title: 'Bài 3 - Chẩn đoán mạng',
          subtitle: 'Sử dụng Ping và Traceroute kiểm tra kết nối',
          instructions: [
            'Chọn menu <b>Network Diagnostics</b>',
            '<b>Ping Test:</b>',
            '- Target: <span class="val">8.8.8.8</span>',
            '- Packets: <span class="val">4</span>',
            '- Bấm <b>Start</b>',
            '<b>Traceroute:</b>',
            '- Target: <span class="val">google.com</span>',
            '- Bấm <b>Trace</b> và xem đường đi gói tin',
          ],
          practiceUrl: 'http://127.0.0.1:8096/page/networkDiag',
          grading: {
            description: 'Kiểm tra thao tác Network Diagnostics',
            rules: []
          }
        },
        {
          id: 'be15-bai4',
          title: 'Bài 4 - Quản lý tài khoản',
          subtitle: 'Thay đổi mật khẩu đăng nhập và quản lý user',
          instructions: [
            'Chọn menu <b>Account Management</b>',
            '- Current Password: <span class="val">Mật khẩu hiện tại</span>',
            '- New Password: <span class="val">Mật khẩu mới (8+ ký tự)</span>',
            '- Confirm Password: <span class="val">Nhập lại mật khẩu mới</span>',
            'Bấm <b>Apply</b>',
            '⚠️ Sau khi đổi sẽ cần đăng nhập lại',
          ],
          practiceUrl: 'http://127.0.0.1:8096/page/accountMgr',
          grading: {
            description: 'Kiểm tra thao tác đổi mật khẩu Account Management',
            rules: []
          }
        },
        {
          id: 'be15-bai5',
          title: 'Bài 5 - Bảng ARP',
          subtitle: 'Xem và quản lý bảng ARP của thiết bị',
          instructions: [
            'Chọn menu <b>ARP Table</b>',
            '- Xem danh sách IP ↔ MAC mapping',
            '- Xác định thiết bị nào đang dùng IP nào',
            '- Phát hiện xung đột IP (IP Conflict)',
            '- Bấm <b>Refresh</b> để cập nhật danh sách',
          ],
          practiceUrl: 'http://127.0.0.1:8096/page/arpTable',
          grading: {
            description: 'Kiểm tra ARP Table inspection',
            rules: []
          }
        },
        {
          id: 'be15-bai6',
          title: 'Bài 6 - Bảng MAC',
          subtitle: 'Xem danh sách địa chỉ MAC đã học trên switch',
          instructions: [
            'Chọn menu <b>MAC Table</b>',
            '- Xem MAC address của thiết bị trên từng cổng',
            '- Lọc theo VLAN hoặc Port',
            '- Aging time: <span class="val">300 giây mặc định</span>',
            '- Bấm <b>Refresh</b> để cập nhật',
          ],
          practiceUrl: 'http://127.0.0.1:8080/sim_be15000/www/pages/macTable.html',
          grading: {
            description: 'Kiểm tra MAC Table inspection',
            rules: []
          }
        },
        {
          id: 'be15-bai7',
          title: 'Bài 7 - Nâng cấp Firmware',
          subtitle: 'Cập nhật firmware lên phiên bản mới',
          instructions: [
            'Chọn menu <b>Firmware Upgrade</b>',
            '- Tải file firmware .bin từ trang hỗ trợ',
            '- Bấm <b>Browse</b> chọn file firmware',
            '- Bấm <b>Upgrade</b> để bắt đầu',
            '⚠️ Không ngắt nguồn trong lúc nâng cấp!',
            '- Thiết bị tự khởi động lại sau khi xong',
          ],
          practiceUrl: 'http://127.0.0.1:8080/sim_be15000/www/pages/firmwareUpgr.html',
          grading: {
            description: 'Kiểm tra Firmware Upgrade process',
            rules: []
          }
        },
        {
          id: 'be15-bai8',
          title: 'Bài 8 - Quản lý Log',
          subtitle: 'Xem và phân tích nhật ký hệ thống',
          instructions: [
            'Chọn menu <b>Log Management</b>',
            '- Xem log theo mức độ: Error, Warning, Info',
            '- Lọc log theo thời gian',
            '- Tìm kiếm log theo từ khóa',
            '- Download log: Bấm <b>Export</b>',
            '- Xóa log cũ: Bấm <b>Clear</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8080/sim_be15000/www/pages/logMgr.html',
          grading: {
            description: 'Kiểm tra Log Management',
            rules: []
          }
        },
        {
          id: 'be15-bai9',
          title: 'Bài 9 - Khởi động lại & Reset',
          subtitle: 'Reboot thiết bị hoặc khôi phục cài đặt gốc',
          instructions: [
            'Chọn menu <b>Reboot & Reset</b>',
            '<b>Reboot:</b> Bấm <b>Restart Now</b>',
            '- Thiết bị sẽ offline khoảng 1-2 phút',
            '<b>Factory Reset:</b> Bấm <b>Restore Factory Default</b>',
            '⚠️ Toàn bộ cấu hình sẽ bị xóa!',
            '- Sau reset: IP mặc định, tài khoản mặc định',
          ],
          practiceUrl: 'http://127.0.0.1:8080/sim_be15000/www/pages/rebootAndReset.html',
          grading: {
            description: 'Kiểm tra Reboot & Reset operations',
            rules: []
          }
        },
        {
          id: 'be15-bai10',
          title: 'Bài 10 - Cấu hình SNTP',
          subtitle: 'Đồng bộ thời gian thiết bị với máy chủ NTP',
          instructions: [
            'Chọn menu <b>SNTP Configuration</b>',
            '- SNTP Enable: <span class="val">Yes</span>',
            '- Server 1: <span class="val">time.google.com</span>',
            '- Server 2: <span class="val">pool.ntp.org</span>',
            '- Timezone: <span class="val">GMT+7 (Indochina Time)</span>',
            '- Sync Interval: <span class="val">24 giờ</span>',
            'Bấm <b>Apply</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8080/sim_be15000/www/pages/sntp_lan.html',
          grading: {
            description: 'Kiểm tra SNTP Configuration',
            rules: []
          }
        },
      ],
    },
  ],
};
