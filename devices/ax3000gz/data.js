/**
 * devices/ax3000gz/data.js — Dữ liệu & Kịch bản đề bài cho AX3000GZ
 */

window.DEVICE_AX3000GZ = {
  id: 'ax3000gz',
  name: 'AX3000GZ',
  shortName: 'AX3000GZ',
  port: 8080,
  folder: 'sim_ax3000gz',
  serverBat: 'chay_server.bat',
  needsServer: false,
  loginUrl: '/sim_ax3000gz/cgi-bin/luci/login',
  categories: [
    {
      title: 'HỌC TẬP',
      lessons: [
        {
          id: 'ax3gz-bai1',
          title: 'Bài 1: Cấu hình ONT',
          subtitle: 'Thiết lập kết nối WAN/ONT trên AX3000GZ',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình kết nối WAN/ONT trên thiết bị và thiết lập kết nối PPPoE theo các thông số được cung cấp dưới đây:',
            '- Username: <span class="val">fpt</span>',
            '- Password: <span class="val">fpt12345</span>',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/wan/interface',
          grading: {
            description: 'Kiểm tra WAN/ONT Interface trên AX3000GZ',
            rules: []
          }
        },
        {
          id: 'ax3gz-bai2',
          title: 'Bài 2: Cấu hình WiFi',
          subtitle: 'Thiết lập Wi-Fi 2.4GHz và 5GHz cho AX3000GZ',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình các thông số mạng Wi-Fi theo đúng yêu cầu dưới đây:',
            '- SSID Name: <span class="val">FPT Telecom</span>',
            '- WPA Key: <span class="val">fpt12345</span>',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/localnetwork/WLAN/WLANbasic',
          grading: {
            description: 'Kiểm tra SSID và WPA Key',
            rules: []
          }
        },
        {
          id: 'ax3gz-bai3',
          title: 'Bài 3: Tính năng BandSteering',
          subtitle: 'Kích hoạt và cấu hình tính năng Band Steering',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình tính năng Band Steering tự động phân bổ băng tần:',
            '- RSSI Threshold(2.4g): <span class="val">-65</span>',
            '- RSSI Threshold(5g): <span class="val">-65</span>',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/localnetwork/WLAN/BandSteering',
          grading: {
            description: 'Kiểm tra Band Steering',
            rules: []
          }
        },
        {
          id: 'ax3gz-bai4',
          title: 'Bài 4: Cấu hình Mesh WiFi',
          subtitle: 'Thiết lập và quản lý mạng Mesh WiFi',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình tính năng Mesh WiFi liên kết các thiết bị trong hệ thống:',
            '- Roaming Limit(2.4G): <span class="val">-65</span>',
            '- Roaming Limit(5G): <span class="val">-65</span>',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/localnetwork/WLAN/WLANbasic',
          grading: {
            description: 'Kiểm tra Mesh WiFi settings',
            rules: []
          }
        },
        {
          id: 'ax3gz-bai5',
          title: 'Bài 5: Cấu hình IGMP',
          subtitle: 'Cấu hình IGMP Snooping / Proxy cho truyền hình IPTV',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình IGMP Proxy/Snooping hỗ trợ dịch vụ truyền hình:',
            '- Enable: <span class="val">On</span>',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/wan/interface',
          grading: {
            description: 'Kiểm tra cấu hình IGMP',
            rules: []
          }
        },
        {
          id: 'ax3gz-bai6',
          title: 'Bài 6: Cấu hình DDNS',
          subtitle: 'Đăng ký tên miền động để truy cập từ Internet',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình dịch vụ tên miền động DDNS theo các thông số:',
            '- Provider: <span class="val">No-IP</span>',
            '- Username: <span class="val"> binhnt3@fpt.net</span>',
            '- Password: <span class="val">fpt12345</span>',
            '- Host Name: <span class="val">test23122021.ddns.net</span>',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/ddns/dynamicDDNS',
          grading: {
            description: 'Kiểm tra Dynamic DDNS configuration',
            rules: []
          }
        },
        {
          id: 'ax3gz-bai7',
          title: 'Bài 7: Cấu hình SNTP',
          subtitle: 'Đồng bộ thời gian hệ thống qua máy chủ SNTP',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình máy chủ đồng bộ thời gian SNTP:',
            '- Server IP/Domain: <span class="val">pool.ntp.org</span>',
            '- Time Zone: <span class="val">GMT+07:00</span>',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/management/system/backuprestore',
          grading: {
            description: 'Kiểm tra cấu hình SNTP',
            rules: []
          }
        },
        {
          id: 'ax3gz-bai8',
          title: 'Bài 8: Cấu hình Port Forwarding',
          subtitle: 'Mở cổng NAT để máy trong LAN nhận kết nối từ ngoài',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình Mở Port trên thiết bị theo các thông số được cung cấp dưới đây:',
            '- Start External Port: <span class="val">3389</span>',
            '- End External Port: <span class="val">3389</span>',
            '- IP Address: <span class="val">192.168.1.254</span>',
            '- Start Internal Port: <span class="val">3389</span>',
            '- End Internal Port: <span class="val">3389</span>',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/security/forwards',
          grading: {
            description: 'Kiểm tra Port Forwarding rules',
            rules: []
          }
        },
        {
          id: 'ax3gz-bai9',
          title: 'Bài 9: Cấu hình Chặn MAC',
          subtitle: 'Lọc và quản lý quyền truy cập qua địa chỉ MAC',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình chặn/cho phép địa chỉ MAC truy cập mạng:',
            '- MAC Filter Mode: <span class="val">Blacklist / Deny</span>',
            '- MAC Address: <span class="val">AA:BB:CC:DD:EE:FF</span>',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/security/filterCriteria',
          grading: {
            description: 'Kiểm tra MAC Filter configuration',
            rules: []
          }
        },
      ],
    },
  ],
};

