/**
 * devices/ax3000gz/data.js — Dữ liệu & Kịch bản chấm thao tác cho AX3000GZ
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
          title: 'Bài 1 - Cấu hình WAN Interface',
          subtitle: 'Thiết lập kết nối Internet WAN cho AX3000GZ',
          instructions: [
            'Truy cập <b>/sim_ax3000gz</b> và đăng nhập',
            'Chọn <b>Internet → WAN → Interface</b>',
            '- Connection Type: <span class="val">PPPoE hoặc DHCP</span>',
            '- PPPoE User: <span class="val">Theo thông tin nhà mạng</span>',
            '- VLAN ID: <span class="val">Theo thông số kỹ thuật</span>',
            'Bấm <b>Apply</b> để lưu',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/wan/interface',
          grading: {
            description: 'Kiểm tra WAN Interface trên AX3000GZ',
            rules: []
          }
        },
        {
          id: 'ax3gz-bai2',
          title: 'Bài 2 - Cấu hình WiFi',
          subtitle: 'Thiết lập WiFi 2.4GHz và 5GHz cho AX3000GZ',
          instructions: [
            'Chọn <b>Local Network → WLAN → WLAN Basic</b>',
            '- SSID 2.4GHz: <span class="val">FPT_Home_2.4G</span>',
            '- SSID 5GHz: <span class="val">FPT_Home_5G</span>',
            '- Security: <span class="val">WPA2-Personal</span>',
            '- Passphrase: <span class="val">Nhập mật khẩu mạnh</span>',
            'Bấm <b>Apply</b>',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/localnetwork/WLAN/WLANbasic',
          grading: {
            description: 'Kiểm tra cấu hình WLAN Basic',
            rules: []
          }
        },
        {
          id: 'ax3gz-bai3',
          title: 'Bài 3 - WLAN Advanced',
          subtitle: 'Cấu hình nâng cao cho WiFi (kênh, băng thông)',
          instructions: [
            'Chọn <b>Local Network → WLAN → WLAN Advanced</b>',
            '- Channel 2.4GHz: <span class="val">1, 6 hoặc 11</span>',
            '- Channel Width 2.4GHz: <span class="val">40MHz</span>',
            '- Channel 5GHz: <span class="val">Auto</span>',
            '- Channel Width 5GHz: <span class="val">80MHz / 160MHz</span>',
            '- TX Power: <span class="val">100%</span>',
            'Bấm <b>Apply</b>',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/localnetwork/WLAN/WLANAdvanced',
          grading: {
            description: 'Kiểm tra WLAN Advanced settings',
            rules: []
          }
        },
        {
          id: 'ax3gz-bai4',
          title: 'Bài 4 - Port Forwarding',
          subtitle: 'Mở cổng NAT để máy trong LAN nhận kết nối từ ngoài',
          instructions: [
            'Chọn <b>Internet → Security → Forwards</b>',
            'Bấm <b>Add Rule</b>',
            '- Protocol: <span class="val">TCP</span>',
            '- WAN Port: <span class="val">8080</span>',
            '- LAN IP: <span class="val">192.168.1.100</span>',
            '- LAN Port: <span class="val">80</span>',
            'Bấm <b>Apply</b>',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/security/forwards',
          grading: {
            description: 'Kiểm tra Forwards NAT rules',
            rules: []
          }
        },
        {
          id: 'ax3gz-bai5',
          title: 'Bài 5 - Cấu hình DDNS',
          subtitle: 'Đăng ký tên miền động để truy cập từ Internet',
          instructions: [
            'Chọn <b>Internet → DDNS → Dynamic DDNS</b>',
            '- Provider: <span class="val">No-IP</span>',
            '- Domain: <span class="val">myrouter.ddns.net</span>',
            '- Account/Password: <span class="val">Tài khoản No-IP</span>',
            'Bấm <b>Apply</b> và kiểm tra trạng thái cập nhật',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/ddns/dynamicDDNS',
          grading: {
            description: 'Kiểm tra Dynamic DDNS configuration',
            rules: []
          }
        },
        {
          id: 'ax3gz-bai6',
          title: 'Bài 6 - DMZ Configuration',
          subtitle: 'Cấu hình vùng DMZ cho máy chủ công khai',
          instructions: [
            'Chọn <b>Internet → Security → DMZ</b>',
            '- DMZ: <span class="val">Enable</span>',
            '- DMZ Host IP: <span class="val">192.168.1.200</span>',
            '⚠️ Máy DMZ sẽ nhận toàn bộ traffic từ WAN',
            'Chỉ dùng cho máy chủ chuyên dụng, không phải PC thường',
            'Bấm <b>Apply</b>',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/security/DMZ',
          grading: {
            description: 'Kiểm tra DMZ Host IP',
            rules: []
          }
        },
        {
          id: 'ax3gz-bai7',
          title: 'Bài 7 - Band Steering',
          subtitle: 'Tự động phân bổ thiết bị sang băng tần tối ưu',
          instructions: [
            'Chọn <b>Local Network → WLAN → Band Steering</b>',
            '- Band Steering: <span class="val">Enable</span>',
            '- RSSI Threshold: <span class="val">-70 dBm</span>',
            '- Steering Method: <span class="val">Auto</span>',
            'Band Steering giúp thiết bị 5GHz không bị "dính" ở 2.4GHz',
            'Bấm <b>Apply</b>',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/localnetwork/WLAN/BandSteering',
          grading: {
            description: 'Kiểm tra Band Steering enablement',
            rules: []
          }
        },
        {
          id: 'ax3gz-bai8',
          title: 'Bài 8 - Backup/Restore',
          subtitle: 'Sao lưu và khôi phục cấu hình thiết bị',
          instructions: [
            'Chọn <b>Management → System → Backup/Restore</b>',
            '<b>Export:</b> Bấm <b>Backup Configuration</b>',
            '<b>Import:</b> Chọn file → Bấm <b>Restore</b>',
            '<b>Reset:</b> Bấm <b>Factory Default</b>',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/management/system/backuprestore',
          grading: {
            description: 'Kiểm tra Backup/Restore operations',
            rules: []
          }
        },
        {
          id: 'ax3gz-bai9',
          title: 'Bài 9 - Schedule Reboot',
          subtitle: 'Lên lịch tự động khởi động lại định kỳ',
          instructions: [
            'Chọn <b>Management → System → Schedule Reboot</b>',
            '- Enable: <span class="val">Bật</span>',
            '- Frequency: <span class="val">Weekly</span>',
            '- Day: <span class="val">Sunday</span>',
            '- Time: <span class="val">03:00 AM</span>',
            'Bấm <b>Apply</b>',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/management/system/schedulereboot',
          grading: {
            description: 'Kiểm tra Schedule Reboot configuration',
            rules: []
          }
        },
        {
          id: 'ax3gz-bai10',
          title: 'Bài 10 - Chặn Web (URL Filter)',
          subtitle: 'Lọc và hạn chế truy cập website cho người dùng',
          instructions: [
            'Chọn <b>Internet → Security → Filter Criteria</b>',
            'Bấm <b>Add</b> để thêm quy tắc lọc',
            '- Filter Type: <span class="val">URL Keyword</span>',
            '- Keyword: <span class="val">Nhập từ khóa cần chặn</span>',
            '- Schedule: <span class="val">Always Active</span>',
            'Bấm <b>Apply</b>',
          ],
          practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/security/filterCriteria',
          grading: {
            description: 'Kiểm tra URL Filter Criteria',
            rules: []
          }
        },
      ],
    },
  ],
};
