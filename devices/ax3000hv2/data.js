/**
 * devices/ax3000hv2/data.js — Dữ liệu & Kịch bản đề bài cho AX3000H v2
 */

window.DEVICE_AX3000HV2 = {
  id: 'ax3000hv2',
  name: 'AX3000H v2',
  shortName: 'AX3000Hv2',
  port: 8080,
  folder: 'sim_ax3000hv2',
  serverBat: 'Chay-server.bat',
  needsServer: false,
  loginUrl: '/sim_ax3000hv2/cgi-bin/login.asp',
  categories: [
    {
      title: 'HỌC TẬP',
      lessons: [
        {
          id: 'ax3hv2-bai1',
          title: 'Bài 1: Cấu hình PPPoE',
          subtitle: 'Thiết lập kết nối Internet PPPoE cho AX3000H v2',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình kết nối WAN/Internet trên thiết bị và thiết lập kết nối PPPoE theo các thông số được cung cấp dưới đây:',
            '- Username: <span class="val">fpt</span>',
            '- Password: <span class="val">fpt12345</span>',
          ],
          practiceUrl: '/sim_ax3000hv2/cgi-bin/index.asp?page=home_wan.asp',
          grading: {
            description: 'Kiểm tra cấu hình PPPoE trên AX3000H v2',
            rules: []
          }
        },
        {
          id: 'ax3hv2-bai2',
          title: 'Bài 2: Cấu hình Wi-Fi Host',
          subtitle: 'Thiết lập mạng Wi-Fi chính (Host)',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình mạng Wi-Fi chính (Host) theo các thông số dưới đây:',
            '- SSID Name: <span class="val">FPT Telecom</span>',
            '- WPA Key: <span class="val">fpt12345</span>',
          ],
          practiceUrl: '/sim_ax3000hv2/cgi-bin/index.asp?page=home_wireless.asp',
          grading: {
            description: 'Kiểm tra SSID Host và WPA Key',
            rules: []
          }
        },
        {
          id: 'ax3hv2-bai3',
          title: 'Bài 3: Cấu hình Wi-Fi Guest',
          subtitle: 'Thiết lập mạng Wi-Fi phụ cho khách (Guest)',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình mạng Wi-Fi Guest (Khách) theo các thông số dưới đây:',
            '- SSID Name: <span class="val">FPT Telecom_Guest</span>',
            '- WPA Key: <span class="val">fpt12345</span>',
          ],
          practiceUrl: '/sim_ax3000hv2/cgi-bin/index.asp?page=home_wireless.asp',
          grading: {
            description: 'Kiểm tra SSID Guest và WPA Key',
            rules: []
          }
        },
        {
          id: 'ax3hv2-bai4',
          title: 'Bài 4: Cấu hình Wi-Fi IoT',
          subtitle: 'Thiết lập mạng Wi-Fi dành riêng cho thiết bị IoT',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình mạng Wi-Fi IoT theo các thông số dưới đây:',
            '- SSID Name: <span class="val">FPT Telecom_IoT</span>',
            '- WPA Key: <span class="val">fpt12345</span>',
          ],
          practiceUrl: '/sim_ax3000hv2/cgi-bin/index.asp?page=home_wireless.asp',
          grading: {
            description: 'Kiểm tra SSID IoT và WPA Key',
            rules: []
          }
        },
        {
          id: 'ax3hv2-bai5',
          title: 'Bài 5: Cấu hình LAN Based',
          subtitle: 'Thay đổi địa chỉ IP LAN và dải DHCP Pool',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện thay đổi cấu hình địa chỉ IP LAN trên thiết bị theo các thông số được cung cấp dưới đây:',
            '- IP Address: <span class="val">192.168.1.1</span>',
            '- IP Subnet Mask: <span class="val">255.255.255.0</span>',
            '- Start IP: <span class="val">192.168.1.2</span>',
            '- End IP: <span class="val">192.168.1.254</span>',
            '- Lease Time: <span class="val">86400</span>',
          ],
          practiceUrl: '/sim_ax3000hv2/cgi-bin/index.asp?page=home_lan.asp',
          grading: {
            description: 'Kiểm tra LAN Router IP & DHCP Range',
            rules: []
          }
        },
        {
          id: 'ax3hv2-bai6',
          title: 'Bài 6: Cấu hình DHCP Reservation',
          subtitle: 'Gán địa chỉ IP cố định (Static DHCP) cho thiết bị',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình DHCP Reservation (Gán IP cố định) theo thông số:',
            '- MAC Address: <span class="val">AA:BB:CC:DD:EE:FF</span>',
            '- IP Address: <span class="val">192.168.1.100</span>',
          ],
          practiceUrl: '/sim_ax3000hv2/cgi-bin/index.asp?page=home_lan.asp',
          grading: {
            description: 'Kiểm tra DHCP Reservation settings',
            rules: []
          }
        },
      ],
    },
  ],
};

