/**
 * devices/ax3000c/data.js — Dữ liệu & Kịch bản chấm thao tác cho AX3000C
 */

window.DEVICE_AX3000C = {
  id: 'ax3000c',
  name: 'AX3000C',
  shortName: 'AX3000C',
  port: 8080,
  folder: 'sim_ax3000c',
  serverBat: 'chay_server.bat',
  needsServer: false,
  loginUrl: '/sim_ax3000c/#/login',
  resetSessionUrl: '/sim_ax3000c/sim-reset-session',
  categories: [
    {
      title: 'HỌC TẬP',
      lessons: [
        {
          id: 'ax3c-bai1',
          title: 'Bài 1 - Cấu hình WAN/Internet',
          subtitle: 'Thiết lập kết nối Internet cho AX3000C',
          instructions: [
            'Truy cập <b>/sim_ax3000c</b> và đăng nhập',
            'Chọn <b>Network → Internet → WAN Interface</b>',
            '- WAN Mode: <span class="val">PPPoE / DHCP tùy yêu cầu</span>',
            '- VLAN ID: <span class="val">Theo thông số nhà mạng</span>',
            'Điền đầy đủ thông tin PPPoE nếu được yêu cầu',
            'Bấm <b>Apply</b> để lưu',
          ],
          practiceUrl: '/sim_ax3000c/#/network/wan',
          grading: {
            description: 'Kiểm tra cấu hình WAN Interface trên AX3000C',
            rules: []
          }
        },
        {
          id: 'ax3c-bai2',
          title: 'Bài 2 - Cấu hình WiFi',
          subtitle: 'Thiết lập SSID, bảo mật WiFi 2.4G/5G',
          instructions: [
            'Truy cập <b>/sim_ax3000c</b> và đăng nhập',
            'Chọn <b>Local Network → WLAN → WLAN Basic</b>',
            '- SSID 2.4G: <span class="val">FPT_Nha_Toi_2G</span>',
            '- SSID 5G: <span class="val">FPT_Nha_Toi_5G</span>',
            '- Security: <span class="val">WPA2/WPA3</span>',
            '- Password: <span class="val">Tối thiểu 8 ký tự</span>',
            'Bấm <b>Apply</b> để kích hoạt',
          ],
          practiceUrl: '/sim_ax3000c/#/network/wifi',
          grading: {
            description: 'Kiểm tra SSID và WPA Key 2.4G/5G',
            rules: []
          }
        },
        {
          id: 'ax3c-bai3',
          title: 'Bài 3 - Cấu hình LAN & DHCP',
          subtitle: 'Quản lý dải IP LAN và máy chủ DHCP',
          instructions: [
            'Truy cập <b>/sim_ax3000c</b> và đăng nhập',
            'Chọn <b>Local Network → LAN → DHCP Status</b>',
            '- LAN IP: <span class="val">192.168.1.1</span>',
            '- DHCP Pool Start: <span class="val">192.168.1.100</span>',
            '- DHCP Pool End: <span class="val">192.168.1.200</span>',
            '- Lease Time: <span class="val">24 giờ</span>',
            'Bấm <b>Apply</b> để lưu',
          ],
          practiceUrl: '/sim_ax3000c/#/network/dhcp',
          grading: {
            description: 'Kiểm tra cấu hình DHCP Pool',
            rules: []
          }
        },
        {
          id: 'ax3c-bai4',
          title: 'Bài 4 - Cấu hình Port Forwarding',
          subtitle: 'Mở port NAT để máy trong mạng nhận kết nối ngoài',
          instructions: [
            'Chọn <b>Network → Security → Port Forwarding</b>',
            'Bấm <b>Add</b> để tạo rule',
            '- Protocol: <span class="val">TCP</span>',
            '- WAN Port Range: <span class="val">8443 - 8443</span>',
            '- LAN Host IP: <span class="val">192.168.1.100</span>',
            '- LAN Port: <span class="val">443</span>',
            'Bấm <b>Apply</b>',
          ],
          practiceUrl: '/sim_ax3000c/#/network/portfwd',
          grading: {
            description: 'Kiểm tra Port Forwarding Rules',
            rules: []
          }
        },
        {
          id: 'ax3c-bai5',
          title: 'Bài 5 - Cấu hình DDNS',
          subtitle: 'Đăng ký và cấu hình tên miền động',
          instructions: [
            'Chọn <b>Network → Internet → DDNS</b>',
            '- DDNS Service: <span class="val">No-IP / DynDNS</span>',
            '- Hostname: <span class="val">yourname.ddns.net</span>',
            '- Username/Password: <span class="val">Tài khoản dịch vụ DDNS</span>',
            '- Update Interval: <span class="val">30 phút</span>',
            'Bấm <b>Apply</b> để kích hoạt',
          ],
          practiceUrl: '/sim_ax3000c/#/network/ddns',
          grading: {
            description: 'Kiểm tra thiết lập DDNS',
            rules: []
          }
        },
        {
          id: 'ax3c-bai6',
          title: 'Bài 6 - Cấu hình Remote Service',
          subtitle: 'Bật quản lý thiết bị từ xa qua mạng WAN',
          instructions: [
            'Chọn <b>Network → Security → Remote Service</b>',
            '- Remote HTTP: <span class="val">Enable</span>',
            '- Remote Port: <span class="val">8888</span>',
            '- Allow Source: <span class="val">Any / Specific IP</span>',
            'Bấm <b>Apply</b> để lưu cấu hình',
          ],
          practiceUrl: '/sim_ax3000c/#/system/remote',
          grading: {
            description: 'Kiểm tra Remote Service HTTP',
            rules: []
          }
        },
        {
          id: 'ax3c-bai7',
          title: 'Bài 7 - Backup/Restore',
          subtitle: 'Sao lưu và khôi phục cấu hình hệ thống',
          instructions: [
            'Chọn <b>Management → System → Backup/Restore</b>',
            '<b>Backup:</b> Bấm <b>Export Configuration</b> → lưu file',
            '<b>Restore:</b> Bấm <b>Browse</b> → chọn file backup → <b>Import</b>',
            '<b>Factory Reset:</b> Bấm <b>Restore Default</b>',
            '- Thiết bị sẽ reboot tự động sau khi restore',
          ],
          practiceUrl: '/sim_ax3000c/#/system/upgrade',
          grading: {
            description: 'Kiểm tra thao tác System Backup/Restore',
            rules: []
          }
        },
        {
          id: 'ax3c-bai8',
          title: 'Bài 8 - Firewall & Bảo mật',
          subtitle: 'Cấu hình tường lửa bảo vệ mạng nội bộ',
          instructions: [
            'Chọn <b>Network → Security → Firewall</b>',
            '- Firewall Level: <span class="val">Medium (khuyến nghị)</span>',
            '- Block WAN Ping: <span class="val">Enable</span>',
            '- SYN Flood Protection: <span class="val">Enable</span>',
            'Cấu hình thêm trong tab <b>Filter Criteria</b> nếu cần',
            'Bấm <b>Apply</b> để áp dụng',
          ],
          practiceUrl: '/sim_ax3000c/#/network/firewall',
          grading: {
            description: 'Kiểm tra Firewall Settings',
            rules: []
          }
        },
        {
          id: 'ax3c-bai9',
          title: 'Bài 9 - Chẩn đoán mạng',
          subtitle: 'Dùng công cụ Ping/Traceroute để kiểm tra kết nối',
          instructions: [
            'Chọn <b>Management → Diagnostics → Network Diagnostics</b>',
            '<b>Ping Test:</b>',
            '- Host: <span class="val">8.8.8.8</span>',
            '- Count: <span class="val">4</span>',
            '- Bấm <b>Start</b> để kiểm tra',
            '<b>Traceroute:</b>',
            '- Host: <span class="val">google.com</span>',
            '- Bấm <b>Start</b> và xem kết quả',
          ],
          practiceUrl: '/sim_ax3000c/#/network/diagnostics',
          grading: {
            description: 'Kiểm tra thao tác Chẩn đoán mạng',
            rules: []
          }
        },
        {
          id: 'ax3c-bai10',
          title: 'Bài 10 - Quản lý Log',
          subtitle: 'Xem và phân tích nhật ký hoạt động của thiết bị',
          instructions: [
            'Chọn <b>Management → Log</b>',
            '- Xem toàn bộ log hệ thống',
            '- Lọc theo mức độ: <span class="val">Error / Warning / Info</span>',
            '- Export log: Bấm <b>Download</b> để lưu file',
            '- Xóa log: Bấm <b>Clear All</b>',
          ],
          practiceUrl: '/sim_ax3000c/#/network/systemlog',
          grading: {
            description: 'Kiểm tra System Log management',
            rules: []
          }
        },
      ],
    },
  ],
};
