/**
 * devices/ax3000c/data.js — Dữ liệu & Kịch bản đề bài cho AX3000C
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
          title: 'Bài 1-Cấu hình PPPoE',
          subtitle: 'Thiết lập kết nối WAN/Internet với tài khoản PPPoE',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình kết nối WAN/Internet trên thiết bị và thiết lập kết nối PPPoE theo các thông số được cung cấp dưới đây:',
            '- Username: <span class="val">Sgfdl-123456-789</span>',
            '- Password: <span class="val">d123456</span>',
          ],
          practiceUrl: '/sim_ax3000c/#/home',
          grading: {
            description: 'Kiểm tra cấu hình PPPoE trên AX3000C',
            rules: []
          }
        },
        {
          id: 'ax3c-bai2',
          title: 'Bài 2-Cấu hình WiFi',
          subtitle: 'Kích hoạt Band Steering và thiết lập Wi-Fi',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình mạng Wi-Fi Band Steering trên thiết bị. Kích hoạt tính năng Band Steering và cấu hình các thông số mạng Wi-Fi theo đúng yêu cầu dưới đây:',
            '- SSID Name: <span class="val">FPT Telecom</span>',
            '- WPA Key: <span class="val">fpt12345</span>',
          ],
          practiceUrl: '/sim_ax3000c/#/network/wifi',
          grading: {
            description: 'Kiểm tra SSID và WPA Key',
            rules: []
          }
        },
        {
          id: 'ax3c-bai3',
          title: 'Bài 3-Cấu hình đổi IP LAN',
          subtitle: 'Thay đổi địa chỉ IP LAN và dải DHCP Pool',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện thay đổi cấu hình địa chỉ IP LAN trên thiết bị theo các thông số được cung cấp dưới đây.',
            '- Router LAN IPv4 Address: <span class="val">192.168.100.1</span>',
            '- Subnet mask: <span class="val">255.255.255.0</span>',
            '- DHCP start address: <span class="val">192.168.100.2</span>',
            '- DHCP end address: <span class="val">192.168.100.249</span>',
          ],
          practiceUrl: '/sim_ax3000c/#/network/dhcp',
          grading: {
            description: 'Kiểm tra IP LAN và dải DHCP Pool',
            rules: []
          }
        },
        {
          id: 'ax3c-bai4',
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
          practiceUrl: '/sim_ax3000c/#/network/dhcp',
          grading: {
            description: 'Kiểm tra cấu hình DNS Server',
            rules: []
          }
        },
        {
          id: 'ax3c-bai5',
          title: 'Bài 5-Cấu hình NAT Port',
          subtitle: 'Mở Port (Port Forwarding) trên thiết bị',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình Mở Port trên thiết bị theo các thông số được cung cấp dưới đây.',
            '- External Port: <span class="val">8080</span>',
            '- Internal Port: <span class="val">80</span>',
          ],
          practiceUrl: '/sim_ax3000c/#/network/portfwd',
          grading: {
            description: 'Kiểm tra Port Forwarding Rules',
            rules: []
          }
        },
      ],
    },
  ],
};

