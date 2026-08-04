/**
 * devices/ax3000hv2/data.js — Dữ liệu & Kịch bản chấm thao tác cho AX3000H v2
 */

window.DEVICE_AX3000HV2 = {
  id: 'ax3000hv2',
  name: 'AX3000H v2',
  shortName: 'AX3000Hv2',
  port: 8092,
  folder: 'sim_ax3000hv2',
  serverBat: 'Chay-server.bat',
  needsServer: false,
  loginUrl: 'http://127.0.0.1:8092/cgi-bin/login.asp',
  categories: [
    {
      title: 'HỌC TẬP',
      lessons: [
        {
          id: 'ax3hv2-bai1',
          title: 'Bài 1 - Cấu hình PPPoE',
          subtitle: 'Thiết lập kết nối Internet PPPoE cho AX3000H v2',
          instructions: [
            'Truy cập <b>192.168.1.1</b> và đăng nhập',
            'Chọn <b>Basic Setup → Internet</b>',
            '- Connection Type: <span class="val">PPPoE</span>',
            '- Username: <span class="val">Theo thông tin nhà mạng FPT</span>',
            '- Password: <span class="val">Mật khẩu PPPoE</span>',
            '- Always On: <span class="val">Enable</span>',
            'Bấm <b>Apply</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8092/cgi-bin/home_wan.asp',
          grading: {
            description: 'Kiểm tra cấu hình PPPoE trên AX3000H v2',
            rules: []
          }
        },
        {
          id: 'ax3hv2-bai2',
          title: 'Bài 2 - Cấu hình WiFi 2.4G/5G',
          subtitle: 'Thiết lập mạng không dây dual-band',
          instructions: [
            'Truy cập <b>192.168.1.1</b> và đăng nhập',
            'Chọn <b>Wireless → Basic Settings</b>',
            '- Network Name (SSID): <span class="val">FPT_AX3000H_Home</span>',
            '- Security Mode: <span class="val">WPA2/WPA3 Mixed</span>',
            '- Password: <span class="val">Tối thiểu 8 ký tự</span>',
            '- Repeat cho băng tần 5GHz',
            'Bấm <b>Apply</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8092/cgi-bin/home_wireless.asp',
          grading: {
            description: 'Kiểm tra Wireless dual-band settings',
            rules: []
          }
        },
        {
          id: 'ax3hv2-bai3',
          title: 'Bài 3 - Cấu hình LAN',
          subtitle: 'Quản lý IP LAN và DHCP Server',
          instructions: [
            'Chọn <b>Local Network → LAN Settings</b>',
            '- Router IP: <span class="val">192.168.1.1</span>',
            '- DHCP: <span class="val">Enable</span>',
            '- DHCP Range: <span class="val">192.168.1.100 → 192.168.1.200</span>',
            '- DNS: <span class="val">8.8.8.8, 8.8.4.4</span>',
            'Bấm <b>Apply</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8092/cgi-bin/home_lan.asp',
          grading: {
            description: 'Kiểm tra LAN Router IP & DHCP Range',
            rules: []
          }
        },
        {
          id: 'ax3hv2-bai4',
          title: 'Bài 4 - Mở Port NAT',
          subtitle: 'Cấu hình Virtual Server để mở port',
          instructions: [
            'Chọn <b>Advanced → NAT → Virtual Server</b>',
            'Bấm <b>Add</b>',
            '- Protocol: <span class="val">TCP</span>',
            '- WAN Port: <span class="val">3389</span>',
            '- LAN IP: <span class="val">192.168.1.50</span>',
            '- LAN Port: <span class="val">3389</span> (RDP)',
            'Bấm <b>Apply</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8092/cgi-bin/adv_nat_top.asp',
          grading: {
            description: 'Kiểm tra Virtual Server NAT settings',
            rules: []
          }
        },
        {
          id: 'ax3hv2-bai5',
          title: 'Bài 5 - Cấu hình DDNS',
          subtitle: 'Thiết lập tên miền động để truy cập từ xa',
          instructions: [
            'Chọn <b>Advanced → DDNS</b>',
            '- Enable DDNS: <span class="val">Yes</span>',
            '- Service: <span class="val">DynDNS / No-IP</span>',
            '- Hostname: <span class="val">home.ddns.net</span>',
            '- Credentials: Nhập tài khoản dịch vụ',
            'Bấm <b>Apply</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8092/cgi-bin/access_ddns.asp',
          grading: {
            description: 'Kiểm tra DDNS Configuration',
            rules: []
          }
        },
        {
          id: 'ax3hv2-bai6',
          title: 'Bài 6 - Remote Management',
          subtitle: 'Cấu hình quản lý thiết bị từ xa',
          instructions: [
            'Chọn <b>Advanced → Remote Management</b>',
            '- Remote Management: <span class="val">Enable</span>',
            '- Port: <span class="val">8080</span>',
            '- Allowed IP: <span class="val">Any hoặc IP cụ thể</span>',
            '⚠️ Lưu ý bảo mật: chỉ cho phép IP tin cậy',
            'Bấm <b>Apply</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8092/cgi-bin/access_cwmp.asp',
          grading: {
            description: 'Kiểm tra Remote Management settings',
            rules: []
          }
        },
        {
          id: 'ax3hv2-bai7',
          title: 'Bài 7 - Backup/Restore',
          subtitle: 'Sao lưu cấu hình thiết bị AX3000H v2',
          instructions: [
            'Chọn <b>Maintenance → Backup/Restore</b>',
            '<b>Backup:</b> Bấm <b>Save Settings</b>',
            '<b>Restore:</b> Browse → chọn file → Bấm <b>Restore</b>',
            '<b>Reset:</b> Bấm <b>Factory Defaults</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8092/cgi-bin/tools_system.asp',
          grading: {
            description: 'Kiểm tra thao tác Backup/Restore',
            rules: []
          }
        },
        {
          id: 'ax3hv2-bai8',
          title: 'Bài 8 - Cấu hình Firewall',
          subtitle: 'Bật và cấu hình tường lửa bảo vệ mạng',
          instructions: [
            'Chọn <b>Advanced → Firewall</b>',
            '- SPI Firewall: <span class="val">Enable</span>',
            '- Block Anonymous Internet Requests: <span class="val">Enable</span>',
            '- Filter Multicast: <span class="val">Enable</span>',
            'Bấm <b>Apply</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8092/cgi-bin/adv_firewall.asp',
          grading: {
            description: 'Kiểm tra SPI Firewall & Filter rules',
            rules: []
          }
        },
        {
          id: 'ax3hv2-bai9',
          title: 'Bài 9 - Chẩn đoán mạng',
          subtitle: 'Sử dụng Ping và Traceroute để kiểm tra kết nối',
          instructions: [
            'Chọn <b>Maintenance → Diagnostics</b>',
            '<b>Ping:</b>',
            '- Destination: <span class="val">8.8.8.8</span>',
            '- Bấm <b>Start</b>',
            '<b>Traceroute:</b>',
            '- Destination: <span class="val">google.com</span>',
            '- Bấm <b>Start</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8092/cgi-bin/tools_test.asp',
          grading: {
            description: 'Kiểm tra Network Diagnostics tool usage',
            rules: []
          }
        },
        {
          id: 'ax3hv2-bai10',
          title: 'Bài 10 - Nâng cấp Firmware',
          subtitle: 'Cập nhật firmware lên phiên bản mới nhất',
          instructions: [
            'Chọn <b>Maintenance → Firmware Upgrade</b>',
            '- Tải firmware mới từ trang hỗ trợ FPT',
            '- Bấm <b>Browse</b> và chọn file firmware (.bin)',
            '- Bấm <b>Upgrade</b>',
            '⚠️ Không tắt nguồn trong quá trình nâng cấp',
            '- Thiết bị tự reboot sau khi hoàn tất',
          ],
          practiceUrl: 'http://127.0.0.1:8092/cgi-bin/tools_update.asp',
          grading: {
            description: 'Kiểm tra Firmware Upgrade process',
            rules: []
          }
        },
      ],
    },
  ],
};
