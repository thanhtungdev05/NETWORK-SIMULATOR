/**
 * devices/ax3000s/data.js — Dữ liệu & Kịch bản chấm thao tác cho AX3000S
 */

window.DEVICE_AX3000S = {
  id: 'ax3000s',
  name: 'AX3000S',
  shortName: 'AX3000S',
  port: 8098,
  folder: 'sim_ax3000s',
  serverBat: 'Chay-server-8098.bat',
  needsServer: false,
  loginUrl: 'http://127.0.0.1:8098/login.html',
  categories: [
    {
      title: 'HỌC TẬP',
      lessons: [
        {
          id: 'ax3s-bai1',
          title: 'Bài 1 - Cấu hình WAN',
          subtitle: 'Thiết lập kết nối Internet cho AX3000S (LuCI)',
          instructions: [
            'Truy cập <b>192.168.1.1</b> và đăng nhập bằng tài khoản <b>admin / admin</b>',
            'Chọn <b>Network → WAN Configuration</b>',
            '- Protocol: <span class="val">PPPoE</span>',
            '- Username/Password: <span class="val">Nhập thông tin FPT cung cấp</span>',
            '- VLAN ID: <span class="val">Nhập ID VLAN (mặc định 33)</span>',
            'Bấm <b>Save & Apply</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8098/app.html#wancfg',
          grading: {
            description: 'Kiểm tra WAN Configuration trên AX3000S',
            rules: []
          }
        },
        {
          id: 'ax3s-bai2',
          title: 'Bài 2 - Cấu hình WiFi',
          subtitle: 'Thiết lập mạng WiFi trên AX3000S (LuCI)',
          instructions: [
            'Chọn <b>WLAN → 2.4G/5G Band → Basic Setting</b>',
            '- ESSID: <span class="val">Nhập tên mạng WiFi mới</span>',
            '- Security Mode: <span class="val">WPA2-PSK / WPA3-PSK</span>',
            '- Pre-Shared Key: <span class="val">Nhập mật khẩu WiFi (≥ 8 ký tự)</span>',
            'Bấm <b>Save & Apply</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8098/app.html#wlanBasicSetting2g',
          grading: {
            description: 'Kiểm tra WLAN Basic Setting 2.4G/5G',
            rules: []
          }
        },
        {
          id: 'ax3s-bai3',
          title: 'Bài 3 - Cấu hình LAN/DHCP',
          subtitle: 'Quản lý mạng nội bộ và dải IP DHCP',
          instructions: [
            'Chọn <b>Network → LAN Configuration → IPv4 Configuration</b>',
            '- IPv4 Address: <span class="val">192.168.1.1</span>',
            '- Subnet Mask: <span class="val">255.255.255.0</span>',
            '- DHCP Server: <span class="val">Enable</span>',
            '- Start IP / End IP: <span class="val">192.168.1.100 - 192.168.1.200</span>',
            'Bấm <b>Save & Apply</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8098/app.html#lancfgv4',
          grading: {
            description: 'Kiểm tra LAN Configuration IPv4',
            rules: []
          }
        },
        {
          id: 'ax3s-bai4',
          title: 'Bài 4 - Port Forwarding',
          subtitle: 'Mở port để dịch vụ trong LAN nhận kết nối',
          instructions: [
            'Chọn <b>Advanced → NAT → Port Forwarding</b>',
            'Bấm <b>Add</b>',
            '- Name: <span class="val">WebServer</span>',
            '- Protocol: <span class="val">TCP</span>',
            '- External Port: <span class="val">8080</span>',
            '- Internal IP: <span class="val">192.168.1.100</span>',
            '- Internal Port: <span class="val">80</span>',
            'Bấm <b>Save & Apply</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8098/app.html#portforward',
          grading: {
            description: 'Kiểm tra Port Forwarding rule',
            rules: []
          }
        },
        {
          id: 'ax3s-bai5',
          title: 'Bài 5 - Cấu hình DDNS',
          subtitle: 'Đăng ký và dùng tên miền động trên AX3000S',
          instructions: [
            'Chọn <b>Advanced → Dynamic DNS</b>',
            '- Enable: <span class="val">Yes</span>',
            '- Service Provider: <span class="val">No-IP / DynDNS</span>',
            '- Hostname: <span class="val">myax3000s.ddns.net</span>',
            '- Username/Password: <span class="val">Tài khoản DDNS</span>',
            'Bấm <b>Save & Apply</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8098/app.html#ddns',
          grading: {
            description: 'Kiểm tra Dynamic DNS settings',
            rules: []
          }
        },
        {
          id: 'ax3s-bai6',
          title: 'Bài 6 - Remote Web Access',
          subtitle: 'Cho phép truy cập giao diện quản trị từ WAN',
          instructions: [
            'Chọn <b>Security → ACL</b>',
            '- Enable ACL: <span class="val">Yes</span>',
            '- Service: <span class="val">HTTP / HTTPS</span>',
            '- Interface: <span class="val">WAN</span>',
            'Bấm <b>Save & Apply</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8098/app.html#acl',
          grading: {
            description: 'Kiểm tra ACL Remote Web Access',
            rules: []
          }
        },
        {
          id: 'ax3s-bai7',
          title: 'Bài 7 - Backup/Restore',
          subtitle: 'Sao lưu và khôi phục cấu hình AX3000S',
          instructions: [
            'Chọn <b>System → Backup & Restore</b>',
            '<b>Backup:</b> Bấm <b>Backup Settings</b> để tải file cấu hình',
            '<b>Restore:</b> Chọn file cấu hình → Bấm <b>Restore Settings</b>',
            '<b>Reset:</b> Bấm <b>Restore Defaults</b> để đưa thiết bị về mặc định',
          ],
          practiceUrl: 'http://127.0.0.1:8098/app.html#skgRestore',
          grading: {
            description: 'Kiểm tra thao tác Backup & Restore',
            rules: []
          }
        },
        {
          id: 'ax3s-bai8',
          title: 'Bài 8 - WiFi Timer',
          subtitle: 'Lên lịch tắt/bật WiFi theo thời gian',
          instructions: [
            'Chọn <b>WLAN → Advance → Scheduler</b>',
            '- Enable Scheduler: <span class="val">Yes</span>',
            '- Days: <span class="val">Thứ 2 - Thứ 6</span>',
            '- Time Range: <span class="val">07:00 - 23:00</span>',
            'Bấm <b>Save & Apply</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8098/app.html#scheduler',
          grading: {
            description: 'Kiểm tra WLAN Scheduler settings',
            rules: []
          }
        },
        {
          id: 'ax3s-bai9',
          title: 'Bài 9 - Reboot Timer',
          subtitle: 'Lên lịch tự động khởi động lại thiết bị',
          instructions: [
            'Chọn <b>System → Reboot</b>',
            '- Scheduled Reboot: <span class="val">Enable</span>',
            '- Day of week: <span class="val">Sunday</span>',
            '- Time: <span class="val">03:00 AM</span>',
            'Bấm <b>Save & Apply</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8098/app.html#skgReboot',
          grading: {
            description: 'Kiểm tra Scheduled Reboot settings',
            rules: []
          }
        },
        {
          id: 'ax3s-bai10',
          title: 'Bài 10 - Chặn Website',
          subtitle: 'Cấu hình lọc URL để hạn chế truy cập web',
          instructions: [
            'Chọn <b>Security → Parental Control → URL Filter</b>',
            '- Mode: <span class="val">Blacklist</span>',
            '- URL / Keyword: <span class="val">facebook.com, tiktok.com</span>',
            'Bấm <b>Add</b> → <b>Save & Apply</b>',
          ],
          practiceUrl: 'http://127.0.0.1:8098/app.html#urlfilter',
          grading: {
            description: 'Kiểm tra Parental Control URL Filter',
            rules: []
          }
        },
      ],
    },
  ],
};
