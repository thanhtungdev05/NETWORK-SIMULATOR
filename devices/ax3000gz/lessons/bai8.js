/**
 * devices/ax3000gz/lessons/bai8.js
 * Bài 8: Cấu hình Port Forwarding trên AX3000GZ
 */

window.DEVICE_AX3000GZ_LESSONS = window.DEVICE_AX3000GZ_LESSONS || [];

window.DEVICE_AX3000GZ_LESSONS.push({
  id: 'LAB_AX3000GZ_08',
  title: 'Bài 8: Cấu hình Port Forwarding',
  subtitle: 'Mở cổng NAT để máy trong LAN nhận kết nối từ ngoài',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình Mở Port trên thiết bị theo các thông số được cung cấp dưới đây:',
    '- Enable: <span class="val">On</span>',
    '- Protocol: <span class="val">TCP/UDP</span>',
    '- WAN Host IP Address: <span class="val">21.143.157.184</span>',
    '- LAN Host: <span class="val">192.168.1.254</span>',
    '- WAN Port: <span class="val">8080</span>',
    '- LAN Host Port: <span class="val">8080</span>'
  ],
  practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/security/forwards',
  clearFields: [
    '[id="modal_field_name"]',
    '[id="modal_field_proto"]',
    '[id="modal_field_src_ip"]',
    '[id="modal_field_dest_ip"]',
    '[id="modal_field_src_dport"]',
    '[id="modal_field_dest_port"]'
  ],
  grading: {
    description: 'Kiểm tra Port Forwarding rules trên AX3000GZ',
    rules: [
      {
        id: 'pf_enabled',
        name: 'Enable Status',
        selector: '[id="modal_field_enabled"] input[value="1"]',
        expected: '1',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'pf_proto',
        name: 'Protocol',
        selector: '[id="modal_field_proto"]',
        expected: 'tcp udp',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'pf_wan_ip',
        name: 'WAN Host IP Address',
        selector: '[id="modal_field_src_ip"]',
        expected: '21.143.157.184',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'pf_lan_ip',
        name: 'LAN Host',
        selector: '[id="modal_field_dest_ip"]',
        expected: '192.168.1.254',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'pf_wan_port',
        name: 'WAN Port',
        selector: '[id="modal_field_src_dport"]',
        expected: '8080',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'pf_lan_port',
        name: 'LAN Host Port',
        selector: '[id="modal_field_dest_port"]',
        expected: '8080',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
