/**
 * devices/ax3000gz/lessons/bai5.js
 * Bài 5: Cấu hình DHCP trên AX3000GZ
 */

window.DEVICE_AX3000GZ_LESSONS = window.DEVICE_AX3000GZ_LESSONS || [];

window.DEVICE_AX3000GZ_LESSONS.push({
  id: 'LAB_AX3000GZ_05',
  title: 'Bài 5 - Cấu hình DHCP',
  subtitle: 'Cấu hình DHCP',
  instructions: [
    '<b>Yêu cầu:</b> Thực hiện thay đổi cấu hình DHCP trên thiết bị theo các thông số:',
    '- IP Address: <span class="val">192.168.1.1</span>',
    '- IP Subnet Mask: <span class="val">255.255.255.0</span>',
    '- DHCP Server: <span class="val">On</span>',
    '- Start IP: <span class="val">192.168.1.2</span>',
    '- End IP: <span class="val">192.168.1.254</span>',
    '- Lease Time: <span class="val">86400</span>'
  ],
  practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/localnetwork/lan',
  clearFields: [
    '[id="widget.cbid.network.lan.ipaddr"]',
    '[id="widget.cbid.network.lan.netmask"]',
    '[id="widget.cbid.network.lan.start"]',
    '[id="widget.cbid.network.lan.end"]',
    '[id="widget.cbid.network.lan.leasetime"]'
  ],
  grading: {
    description: 'Kiểm tra cấu hình DHCP trên AX3000GZ',
    rules: [
      {
        id: 'dhcp_enable',
        name: 'DHCP Server Enable',
        selector: '[id="widget.cbid.network.lan.ignore.0"]',
        expected: 'true',
        type: 'radio',
        required: true
      },
      {
        id: 'dhcp_ip',
        name: 'LAN IP Address',
        selector: '[id="widget.cbid.network.lan.ipaddr"]',
        expected: '192.168.1.1',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'dhcp_mask',
        name: 'Subnet Mask',
        selector: '[id="widget.cbid.network.lan.netmask"]',
        expected: '255.255.255.0',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'dhcp_start',
        name: 'Start IP Address',
        selector: '[id="widget.cbid.network.lan.start"]',
        expected: '192.168.1.2',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'dhcp_end',
        name: 'End IP Address',
        selector: '[id="widget.cbid.network.lan.end"]',
        expected: '192.168.1.254',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'dhcp_lease',
        name: 'Lease Time',
        selector: '[id="widget.cbid.network.lan.leasetime"]',
        expected: '86400',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: [
    {
      selector: '#topmenu a[href*="localnetwork"]',
      text: 'Chọn Local Network',
      position: 'bottom',
      hideOnPage: 'localnetwork'
    },
    {
      selector: '#sidebarmenu a[href*="/localnetwork/lan"]',
      text: 'Chọn LAN',
      position: 'right',
      page: 'localnetwork',
      hideOnPage: 'lan'
    },
    {
      selector: '#cbi-network h3',
      text: 'Chọn DHCP Server',
      position: 'right',
      page: 'lan'
    },
    {
      selector: 'label[for="widget.cbid.network.lan.ignore.1"] + span',
      text: 'Chọn Enable: On',
      position: 'right',
      page: 'lan'
    },
    {
      selector: '[id="widget.cbid.network.lan.ipaddr"]',
      text: 'Nhập LAN IP Address: 192.168.1.1',
      position: 'right',
      page: 'lan'
    },
    {
      selector: '[id="widget.cbid.network.lan.netmask"]',
      text: 'Nhập Subnet Mask: 255.255.255.0',
      position: 'right',
      page: 'lan'
    },
    {
      selector: '[id="widget.cbid.network.lan.start"]',
      text: 'Nhập Start IP: 192.168.1.2',
      position: 'right',
      page: 'lan'
    },
    {
      selector: '[id="widget.cbid.network.lan.end"]',
      text: 'Nhập End IP: 192.168.1.254',
      position: 'right',
      page: 'lan'
    },
    {
      selector: '[id="widget.cbid.network.lan.leasetime"]',
      text: 'Nhập Lease Time: 86400',
      position: 'right',
      page: 'lan'
    },
    {
      selector: '.cbi-page-actions .cbi-button-save',
      text: 'Chọn Apply để lưu cấu hình',
      position: 'top',
      page: 'lan'
    }
  ]
});
