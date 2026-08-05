/**
 * devices/ac1000f/data.js — Dữ liệu & Kịch bản chấm thao tác cho ONT AC1000F
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
          title: 'Bài 1 - Cấu hình PPPoE',
          subtitle: 'Chọn phương thức bắt đầu thực hành trên AC1000F',
          instructions: [
            'Truy cập <b>192.168.1.1</b>; đăng nhập bằng user/pass in trên nhãn',
            'Chọn thẻ <b>Interface Setup → Internet</b>',
            'Bạn giữ nguyên các lựa chọn và thông số không hướng dẫn',
            '- Connection Type: <span class="val">PPPoE</span>',
            '- 802.1q: <span class="val">Untag</span>',
            '- VLAN ID: <span class="val">0</span>',
            '- Multi VLAN Option: <span class="val">-1</span>',
            '- NAT Status: <span class="val">Enable</span>',
            '- PPPoE Connection Mode: <span class="val">Always On</span>',
            '- TCP MTU Option: <span class="val">0</span>',
            '- Add Client Mac Option: <span class="val">Disable</span>',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=home_wan.asp',
          grading: {
            description: 'Kiểm tra cấu hình PPPoE trên AC1000F',
            rules: []
          }
        },
        {
          id: 'ac1-bai2',
          title: 'Bài 2 - Cấu hình WiFi',
          subtitle: 'Thiết lập mạng WiFi 2.4GHz và 5GHz trên AC1000F',
          instructions: [
            'Truy cập <b>192.168.1.1</b> và đăng nhập',
            'Chọn thẻ <b>Wireless → Basic Settings</b>',
            '- SSID: <span class="val">Nhập tên mạng WiFi</span>',
            '- Channel: <span class="val">Auto</span>',
            '- Security Mode: <span class="val">WPA2-PSK</span>',
            '- Pre-Shared Key: <span class="val">Nhập mật khẩu ≥ 8 ký tự</span>',
            'Bấm <b>Apply</b> để lưu cấu hình',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=home_wireless.asp',
          grading: {
            description: 'Kiểm tra SSID và WPA2-PSK key',
            rules: []
          }
        },
        {
          id: 'ac1-bai3',
          title: 'Bài 3 - Cấu hình IP LAN',
          subtitle: 'Thay đổi địa chỉ IP LAN mặc định của thiết bị',
          instructions: [
            'Truy cập <b>192.168.1.1</b> và đăng nhập',
            'Chọn thẻ <b>Advanced Setup → LAN</b>',
            '- IP Address: <span class="val">192.168.10.1</span>',
            '- Subnet Mask: <span class="val">255.255.255.0</span>',
            '- DHCP Server: <span class="val">Enable</span>',
            '- Start IP: <span class="val">192.168.10.100</span>',
            '- End IP: <span class="val">192.168.10.200</span>',
            'Bấm <b>Apply</b> — thiết bị sẽ reboot sau khi đổi IP',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=home_lan.asp',
          grading: {
            description: 'Kiểm tra IP LAN và dải DHCP Pool',
            rules: []
          }
        },
        {
          id: 'ac1-bai4',
          title: 'Bài 4 - Cấu hình mở Port',
          subtitle: 'Mở port để thiết bị trong LAN nhận kết nối từ WAN',
          instructions: [
            'Truy cập <b>192.168.1.1</b> và đăng nhập',
            'Chọn <b>Advanced Setup → NAT → Virtual Servers</b>',
            'Bấm <b>Add</b> để thêm rule mới',
            '- Rule Index: <span class="val">1</span>',
            '- Application: <span class="val">Custom</span>',
            '- Protocol: <span class="val">TCP</span>',
            '- WAN Port: <span class="val">8888</span>',
            '- LAN IP Address: <span class="val">192.168.1.100</span>',
            '- LAN Port: <span class="val">80</span>',
            'Bấm <b>Apply</b> để lưu',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=adv_nat_top.asp',
          grading: {
            description: 'Kiểm tra Port Forwarding Virtual Servers',
            rules: []
          }
        },
        {
          id: 'ac1-bai5',
          title: 'Bài 5 - Cấu hình DDNS',
          subtitle: 'Cấu hình tên miền động để truy cập từ Internet',
          instructions: [
            'Truy cập <b>192.168.1.1</b> và đăng nhập',
            'Chọn <b>Access Management → DDNS</b>',
            '- Active: <span class="val">Yes</span>',
            '- Service Provider: <span class="val">DynDNS</span>',
            '- Hostname: <span class="val">yourname.dyndns.org</span>',
            '- Username: <span class="val">Tài khoản DynDNS</span>',
            '- Password: <span class="val">Mật khẩu DynDNS</span>',
            'Bấm <b>Apply</b> để kích hoạt',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=access_ddns.asp',
          grading: {
            description: 'Kiểm tra cấu hình DDNS',
            rules: []
          }
        },
        {
          id: 'ac1-bai6',
          title: 'Bài 6 - Cấu hình Remote Web',
          subtitle: 'Cho phép quản lý thiết bị từ xa qua WAN',
          instructions: [
            'Truy cập <b>192.168.1.1</b> và đăng nhập',
            'Chọn <b>Access Management → ACL</b>',
            '- ACL Rule Index: <span class="val">1</span>',
            '- Active: <span class="val">Yes</span>',
            '- Service: <span class="val">HTTP</span>',
            '- Source IP: <span class="val">Any</span>',
            '- Interface: <span class="val">WAN</span>',
            'Bấm <b>Apply</b> để lưu quy tắc',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=access_cwmp.asp',
          grading: {
            description: 'Kiểm tra quy tắc ACL Remote Web',
            rules: []
          }
        },
        {
          id: 'ac1-bai7',
          title: 'Bài 7 - Backup/Restore',
          subtitle: 'Sao lưu và phục hồi cấu hình thiết bị',
          instructions: [
            'Truy cập <b>192.168.1.1</b> và đăng nhập',
            'Chọn <b>Maintenance → System → Settings</b>',
            '<b>Backup:</b> Bấm <b>Backup Settings</b> → lưu file .cfg',
            '<b>Restore:</b> Bấm <b>Browse</b> → chọn file .cfg → bấm <b>Restore Settings</b>',
            '- Thiết bị sẽ tự khởi động lại sau khi restore',
            '<b>Factory Reset:</b> Bấm <b>Restore Default Settings</b>',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=tools_system.asp',
          grading: {
            description: 'Kiểm tra thao tác Backup/Restore',
            rules: []
          }
        },
        {
          id: 'ac1-bai8',
          title: 'Bài 8 - Cấu hình WiFi Timer',
          subtitle: 'Lên lịch tắt/bật WiFi theo thời gian định sẵn',
          instructions: [
            'Truy cập <b>192.168.1.1</b> và đăng nhập',
            'Chọn <b>Maintenance → WiFi Timer</b>',
            '- Active: <span class="val">Yes</span>',
            '- Schedule: Chọn ngày trong tuần',
            '- On Time: <span class="val">07:00</span>',
            '- Off Time: <span class="val">23:00</span>',
            'Bấm <b>Apply</b> để kích hoạt lịch WiFi',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=tools_wifitimer.asp',
          grading: {
            description: 'Kiểm tra WiFi Timer schedule',
            rules: []
          }
        },
        {
          id: 'ac1-bai9',
          title: 'Bài 9 - Cấu hình Reboot Timer',
          subtitle: 'Lên lịch khởi động lại thiết bị tự động',
          instructions: [
            'Truy cập <b>192.168.1.1</b> và đăng nhập',
            'Chọn <b>Maintenance → Reboot Timer</b>',
            '- Active: <span class="val">Yes</span>',
            '- Day: <span class="val">Sunday</span>',
            '- Time: <span class="val">03:00</span>',
            'Bấm <b>Apply</b> để lên lịch tự động reboot',
          ],
          practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=tools_reboottimer.asp',
          grading: {
            description: 'Kiểm tra Reboot Timer settings',
            rules: []
          }
        },
        {
          id: 'ac1-bai10',
          title: 'Bài 10 - Cấu hình chặn Web',
          subtitle: 'Lọc và chặn các trang web không mong muốn',
          instructions: [
            'Truy cập <b>192.168.1.1</b> và đăng nhập',
            'Chọn <b>Access Management → URL Filter</b>',
            '- Active: <span class="val">Yes</span>',
            '- Action: <span class="val">Blocked</span>',
            '- URL: <span class="val">Nhập domain cần chặn (vd: facebook.com)</span>',
            '- Schedule: <span class="val">Always</span>',
            'Bấm <b>Add</b> → <b>Apply</b> để lưu',
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
