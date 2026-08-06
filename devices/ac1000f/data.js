/**
 * devices/ac1000f/data.js — Dữ liệu & Kịch bản đề bài cho ONT AC1000F
 */

window.DEVICE_AC1000F = {
  id: 'ac1000f',
  name: 'ONT AC1000F',
  shortName: 'AC1000F',
  port: 8080,
  folder: 'sim_ac1000f',
  serverBat: 'Chay-server-8081.bat',
  needsServer: false, // server2.py chạy riêng trên cổng 8081
  loginUrl: '/sim_ac1000f/cgi-bin/login.asp',
  categories: [
    {
      title: 'HỌC TẬP',
      lessons: [
        {
          id: 'ac1-bai1',
          title: 'Bài 1: Cấu hình PPPoE',
          subtitle: 'Thiết lập kết nối WAN/Internet với tài khoản PPPoE',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình kết nối WAN/Internet trên thiết bị và thiết lập kết nối PPPoE theo các thông số được cung cấp dưới đây:',
            '- Username: <span class="val">Sgfdl-210208-218</span>',
            '- Password: <span class="val">fpt12345</span>',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=home_wan.asp',
          grading: {
            description: 'Kiểm tra cấu hình PPPoE trên AC1000F',
            rules: []
          }
        },
        {
          id: 'ac1-bai2',
          title: 'Bài 2: Cấu hình mạng Wi-Fi',
          subtitle: 'Kích hoạt Band Steering và thiết lập Wi-Fi',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình mạng Wi-Fi Band Steering trên thiết bị. Kích hoạt tính năng Band Steering và cấu hình các thông số mạng Wi-Fi theo đúng yêu cầu dưới đây:',
            '- SSID Name: <span class="val">FPT Telecom-7EA8</span>',
            '- WPA Key: <span class="val">00032934</span>',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=home_wireless.asp',
          grading: {
            description: 'Kiểm tra SSID và WPA Key',
            rules: []
          }
        },
        {
          id: 'ac1-bai3',
          title: 'Bài 3: CẤU HÌNH IP LAN',
          subtitle: 'Thay đổi địa chỉ IP LAN và DHCP Pool',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện thay đổi cấu hình địa chỉ IP LAN trên thiết bị theo các thông số được cung cấp dưới đây.',
            '- IP Address: <span class="val">192.168.1.1</span>',
            '- IP Subnet Mask: <span class="val">255.255.255.0</span>',
            '- Start IP: <span class="val">192.168.1.2</span>',
            '- End IP: <span class="val">192.168.1.254</span>',
            '- Lease Time: <span class="val">86400</span>',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=home_lan.asp',
          grading: {
            description: 'Kiểm tra IP LAN và dải DHCP Pool',
            rules: []
          }
        },
        {
          id: 'ac1-bai4',
          title: 'Bài 4: Cấu hình Mở Port',
          subtitle: 'Mở Port (Port Forwarding) trên thiết bị',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình Mở Port trên thiết bị theo các thông số được cung cấp dưới đây.',
            '- Start External Port: <span class="val">3389</span>',
            '- End External Port: <span class="val">3389</span>',
            '- IP Address: <span class="val">192.168.1.254</span>',
            '- Start Internal Port: <span class="val">3389</span>',
            '- End Internal Port: <span class="val">3389</span>',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=adv_nat_top.asp',
          grading: {
            description: 'Kiểm tra Port Forwarding Virtual Servers',
            rules: []
          }
        },
        {
          id: 'ac1-bai5',
          title: 'Bài 5: Cấu hình DNS',
          subtitle: 'Cấu hình máy chủ DNS của FPT và Google',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện cấu hình DNS trên thiết bị và cấu hình các máy chủ DNS theo yêu cầu sau:',
            '- My Host Name: <span class="val">ac1000f.ddns.net</span>',
            '- Username: <span class="val">truongconghau04111994@gmail.com</span>',
            '- Password: <span class="val">fpt12345</span>',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=home_lan.asp',
          grading: {
            description: 'Kiểm tra cấu hình DNS Server',
            rules: []
          }
        },
        {
          id: 'ac1-bai6',
          title: 'Bài 6: Cấu hình Remote Web',
          subtitle: 'Cấu hình quản lý thiết bị từ xa qua Web',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện Cấu hình Remote Web trên thiết bị theo các thông số được cung cấp dưới đây:',
            '- Username: <span class="val">admin99</span>',
            '- Password: <span class="val">ftc12345</span>',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=access_cwmp.asp',
          grading: {
            description: 'Kiểm tra quy tắc Remote Web',
            rules: []
          }
        },
        {
          id: 'ac1-bai7',
          title: 'Bài 7: Cấu hình Backup/Restore',
          subtitle: 'Sao lưu và phục hồi cấu hình thiết bị',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện Cấu hình Backup/Restore trên thiết bị theo các bước được cung cấp dưới đây:',
            '- Chọn Maintenance => Firmware => Download',
            '- Chọn Maintenance => Firmware => Browse => Restore',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=tools_system.asp',
          grading: {
            description: 'Kiểm tra thao tác Backup/Restore',
            rules: []
          }
        },
        {
          id: 'ac1-bai8',
          title: 'Bài 8: Cấu hình WiFi Timer',
          subtitle: 'Lên lịch tắt/bật Wi-Fi tự động',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện Cấu hình WiFi Timer trên thiết bị theo các thông số được cung cấp dưới đây:',
            '- Start Time: <span class="val">08:00</span>',
            '- End Time: <span class="val">22:00</span>',
            '- Choose Date: <span class="val">Everyday</span>',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=tools_wifitimer.asp',
          grading: {
            description: 'Kiểm tra WiFi Timer schedule',
            rules: []
          }
        },
        {
          id: 'ac1-bai9',
          title: 'Bài 9: Cấu hình Reboot Timer',
          subtitle: 'Lên lịch khởi động lại thiết bị tự động',
          instructions: [
            '<b>Yêu cầu:</b>',
            'Thực hiện Cấu hình Reboot Timer trên thiết bị theo các thông số được cung cấp dưới đây:',
            '- Reboot Time: <span class="val">03:00</span>',
            '- Choose Date: <span class="val">Sunday</span>',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=tools_reboottimer.asp',
          grading: {
            description: 'Kiểm tra Reboot Timer settings',
            rules: []
          }
        },
        {
          id: 'ac1-bai10',
          title: 'Bài 10: Cấu hình chặn Web',
          subtitle: 'Thiết lập quy tắc lọc và chặn truy cập Web',
          instructions: [
            '<b>Thực hiện Cấu hình chặn Web trên thiết bị theo các thông số được cung cấp dưới đây:</b>',
            '- URL(host): <span class="val">facebook.com</span>',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=access_URLfilter.asp',
          grading: {
            description: 'Kiểm tra URL Filter rules',
            rules: []
          }
        },
      ],
    },
  ],
};

