/**
 * devices/ac1000f/lessons/bai3.js
 * Bài 3: CẤU HÌNH IP LAN trên ONT AC1000F
 */

window.DEVICE_AC1000F_LESSONS = window.DEVICE_AC1000F_LESSONS || [];

window.DEVICE_AC1000F_LESSONS.push({
  id: 'LAB_AC1000F_03',
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

  // Xóa trắng các ô nhập liệu khi bài lab mở (học viên phải tự nhập)
  clearFields: [
    'input[name="uiViewIPAddr"]',
    'input[name="uiViewNetMask"]',
    'input[name="StartIp"]',
    'input[name="EndIp"]',
    'input[name="dhcp_LeaseTime"]',
  ],

  // Ràng buộc điều kiện chấm đúng
  grading: {
    description: 'Kiểm tra cấu hình IP LAN (15 tiêu chí)',
    customGrading: function (allDocs) {
      var doc = null;
      for (var i = 0; i < allDocs.length; i++) {
        if (allDocs[i].URL.toLowerCase().indexOf('home_lan.asp') !== -1) {
          doc = allDocs[i];
          break;
        }
      }

      // Hàm tiện ích
      function getVal(selector) {
        if (!doc) return '';
        try {
          var el = doc.querySelector(selector);
          if (el) return el.value.trim();
        } catch (e) { }
        return '';
      }

      function getRadio(name) {
        if (!doc) return '';
        try {
          var el = doc.querySelector('input[name="' + name + '"]:checked');
          if (el) return el.value;
        } catch (e) { }
        return '';
      }

      var rules = [
        { id: '1', name: 'IP Address', expected: '192.168.1.1', actual: getVal('input[name="uiViewIPAddr"]') },
        { id: '2', name: 'IP Subnet Mask', expected: '255.255.255.0', actual: getVal('input[name="uiViewNetMask"]') },
        { id: '3', name: 'Limit NAT Session', expected: 'Disable', actual: getRadio('Limit_natsession') === '0' ? 'Disable' : 'Enable' },
        { id: '4', name: 'Isolate all clients', expected: 'Disable', actual: getRadio('isolate_client') === 'No' ? 'Disable' : 'Enable' },
        { id: '5', name: 'DHCP', expected: 'Enable', actual: getRadio('dhcpTypeRadio') === '1' ? 'Enable' : 'Disable' },
        { id: '6', name: 'Start IP', expected: '192.168.1.2', actual: getVal('input[name="StartIp"]') },
        { id: '7', name: 'End IP', expected: '192.168.1.254', actual: getVal('input[name="EndIp"]') },
        { id: '8', name: 'Lease Time', expected: '86400', actual: getVal('input[name="dhcp_LeaseTime"]') },
        { id: '9', name: 'IP Address', expected: 'Rỗng', actual: getVal('input[name="IpAddr"]') === '' ? 'Rỗng' : getVal('input[name="IpAddr"]') },
        { id: '10', name: 'MAC Address', expected: 'Rỗng', actual: getVal('input[name="MACAddr"]') === '' ? 'Rỗng' : getVal('input[name="MACAddr"]') },
        { id: '11', name: 'IPv6 Global Address', expected: 'Rỗng', actual: getVal('input[name="uiViewIPv6Addr"]') === '' ? 'Rỗng' : getVal('input[name="uiViewIPv6Addr"]') },
        { id: '12', name: 'DHCPv6 Server', expected: 'Disable', actual: getRadio('dhcp6sEnableRadio') === '1' ? 'Enable' : 'Disable' },
        { id: '13', name: 'DHCPv6 Mode', expected: 'Manually', actual: getRadio('dhcp6sModeRadio') === '0' ? 'Automatically' : 'Manually' },
        { id: '14', name: 'DNS Mode', expected: 'Automatically', actual: getVal('select[name="dhcp6sdnsmode"]') === '0' ? 'Automatically' : 'Manually' }
      ];

      var passedCount = 0;
      var details = [];
      rules.forEach(function (r) {
        var isMatch = (r.actual === r.expected);
        if (isMatch) passedCount++;
        details.push({
          id: r.id,
          name: r.name,
          expected: r.expected,
          actual: r.actual || '(Chưa nhập)',
          passed: isMatch,
          message: isMatch ? 'Chính xác' : ('Mong muốn: "' + r.expected + '", Thực tế: "' + (r.actual || 'Trống') + '"')
        });
      });

      return {
        passed: passedCount === rules.length,
        score: Math.round((passedCount / rules.length) * 100),
        passedCount: passedCount,
        totalRules: rules.length,
        details: details
      };
    }
  }
});


