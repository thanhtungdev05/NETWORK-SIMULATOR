/**
 * devices/ax3000s/data.js — Dữ liệu & Kịch bản đề bài cho AX3000S
 */

window.DEVICE_AX3000S = {
  id: 'ax3000s',
  name: 'AX3000S',
  shortName: 'AX3000S',
  port: 8080,
  folder: 'sim_ax3000s',
  serverBat: 'Chay-server-8098.bat',
  needsServer: false,
  loginUrl: '/sim_ax3000s/login.html',
  categories: [
    {
      title: 'HỌC TẬP',
      lessons: [
        {
          id: 'ax3s-bai1',
          title: 'Bài 1-Cấu hình PPPoE',
          subtitle: 'Thiết lập kết nối Internet PPPoE cho AX3000S',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình kết nối WAN/Internet trên thiết bị và thiết lập kết nối PPPoE theo các thông số được cung cấp dưới đây:',
            '- Username: <span class="val">hnfdl-123456-789</span>',
            '- Password: <span class="val">d123456</span>',
          ],
          practiceUrl: '/sim_ax3000s/app.html#wancfg',
          grading: {
            description: 'Kiểm tra WAN Configuration trên AX3000S',
            rules: []
          }
        },
        {
          id: 'ax3s-bai2',
          title: 'Bài 2-Cấu hình WIFI',
          subtitle: 'Thiết lập mạng Wi-Fi 2.4GHz và 5GHz',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình các thông số mạng Wi-Fi theo đúng yêu cầu dưới đây:',
            '- SSID Name: <span class="val">FPT Telecom</span>',
            '- WPA Key: <span class="val">19006600</span>',
          ],
          practiceUrl: '/sim_ax3000s/app.html#wlanBasicSetting2g',
          grading: {
            description: 'Kiểm tra WLAN Basic Setting 2.4G/5G',
            rules: []
          }
        },
        {
          id: 'ax3s-bai3',
          title: 'Bài 3-Cấu hình WIFI IOT',
          subtitle: 'Thiết lập mạng Wi-Fi dành riêng cho thiết bị IoT',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình mạng Wi-Fi IoT theo các thông số dưới đây:',
            '- SSID Name: <span class="val">FPT Telecom_IoT</span>',
            '- WPA Key: <span class="val">19006600</span>',
          ],
          practiceUrl: '/sim_ax3000s/app.html#wlanBasicSetting2g',
          grading: {
            description: 'Kiểm tra SSID IoT và WPA Key',
            rules: []
          }
        },
        {
          id: 'ax3s-bai4',
          title: 'Bài 4-Cấu hình DNS',
          subtitle: 'Cấu hình máy chủ DNS của FPT và Google',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình DNS trên thiết bị và cấu hình các máy chủ DNS theo yêu cầu sau:',
            '- DNS Server 1: <span class="val">210.245.31.220</span> (DNS của FPT)',
            '- DNS Server 2: <span class="val">8.8.8.8</span> (DNS của Google)',
            '<i>Gợi ý IP DNS FPT: 210.245.31.220, 210.245.31.221, 210.31.1.253, 210.31.1.254</i>',
            '<i>Gợi ý IP DNS Google: 8.8.8.8, 8.8.4.4</i>',
          ],
          practiceUrl: '/sim_ax3000s/app.html#lancfgv4',
          grading: {
            description: 'Kiểm tra cấu hình DNS Server',
            rules: []
          }
        },
        {
          id: 'ax3s-bai5',
          title: 'Bài 5-Cấu hình địa chỉ IP LAN',
          subtitle: 'Thay đổi địa chỉ IP LAN và dải DHCP Pool',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện thay đổi cấu hình địa chỉ IP LAN trên thiết bị theo các thông số được cung cấp dưới đây:',
            '- IP Address: <span class="val">192.168.1.1</span>',
            '- IP Subnet Mask: <span class="val">255.255.255.0</span>',
            '- Start IP: <span class="val">192.168.1.2</span>',
            '- IP Pool Count: <span class="val">253</span>',
            '- Lease Time: <span class="val">2 minute or 1 hour</span>',
          ],
          practiceUrl: '/sim_ax3000s/app.html#lancfgv4',
          grading: {
            description: 'Kiểm tra LAN Configuration IPv4',
            rules: []
          }
        },
        {
          id: 'ax3s-bai6',
          title: 'Bài 6-Cấu hình Port Forwarding',
          subtitle: 'Mở Port (Port Forwarding / Virtual Server)',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình Mở Port trên thiết bị theo các thông số được cung cấp dưới đây:',
            '- Name: <span class="val">NAT FPT</span>',
            '- Protocol: <span class="val">TCP, UDP hoặc TCP/UDP</span>',
            '- External Port (WAN): <span class="val">8080</span>',
            '- Internal IP: <span class="val">192.168.1.100 (AX3000C v2: 192.168.100.100)</span>',
            '- Internal Port: <span class="val">8080</span>',
          ],
          practiceUrl: '/sim_ax3000s/app.html#portforward',
          grading: {
            description: 'Kiểm tra Port Forwarding rule',
            rules: []
          }
        },
        {
          id: 'ax3s-bai7',
          title: 'Bài 7-Cấu hình Mesh wifi',
          subtitle: 'Thiết lập và quản lý mạng Mesh WiFi',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình tính năng Mesh WiFi liên kết các thiết bị trong hệ thống:',
            '- Role: <span class="val">Controller</span>',
          ],
          practiceUrl: '/sim_ax3000s/app.html#wlanBasicSetting2g',
          grading: {
            description: 'Kiểm tra Mesh WiFi settings',
            rules: []
          }
        },
      ],
    },
  ],
};

