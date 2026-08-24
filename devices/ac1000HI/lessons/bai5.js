/**
 * devices/ac1000hi/lessons/bai5.js
 * Bài 5: Cấu hình DHCP trên ONT AC1000HI
 */

window.DEVICE_AC1000HI_LESSONS = window.DEVICE_AC1000HI_LESSONS || [];

var index = window.DEVICE_AC1000HI_LESSONS.findIndex(function(l) { return l.id === 'LAB_AC1000HI_05'; });
var lessonObj = {
  id: 'LAB_AC1000HI_05',
  title: 'Bài 5 - Cấu hình DHCP',
  subtitle: 'Cấu hình DHCP',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện thay đổi cấu hình địa chỉ IP LAN trên thiết bị theo các thông số được cung cấp dưới đây.',
    '- IP Address: <span class="val">192.168.1.1</span>',
    '- IP Subnet Mask: <span class="val">255.255.255.0</span>',
    '- Start IP: <span class="val">192.168.1.2</span>',
    '- IP Pool Count: <span class="val">253</span>',
    '- Lease Time: <span class="val">86400</span>',
  ],
  practiceUrl: '/sim_ac1000HI/cgi-bin/index.asp?page=home_lan.asp',

  clearFields: [
    'input[name="uiViewIPAddr"]',
    'input[name="uiViewNetMask"]',
    'input[name="StartIp"]',
    'input[name="PoolSize"]',
    'input[name="dhcp_LeaseTime"]',
  ],

  grading: {
    description: 'Kiểm tra cấu hình IP LAN & DHCP',
    customGrading: function(allDocs) {
      function fetchHTML(url) {
        try {
          var req = new XMLHttpRequest();
          req.open('GET', url, false);
          req.send(null);
          if (req.status === 200) {
            var parser = new DOMParser();
            return parser.parseFromString(req.responseText, 'text/html');
          }
        } catch(e) {}
        return null;
      }
      
      var doc = fetchHTML('/sim_ac1000HI/cgi-bin/home_lan.asp?_=' + new Date().getTime());
      
      function getVal(doc, selector) {
        if (!doc) return '';
        var el = doc.querySelector(selector);
        return el ? el.value.trim() : '';
      }
      
      var isDhcpEnable = false;
      if (doc) {
         var enableRadio = doc.querySelector('input[name="dhcpTypeRadio"][value="1"]');
         if (enableRadio && enableRadio.checked) isDhcpEnable = true;
      }

      var rules = [
        { id: '1', name: 'IP Address', expected: '192.168.1.1', actual: getVal(doc, 'input[name="uiViewIPAddr"]') },
        { id: '2', name: 'IP Subnet Mask', expected: '255.255.255.0', actual: getVal(doc, 'input[name="uiViewNetMask"]') },
        { id: '3', name: 'DHCP State', expected: 'Enable', actual: isDhcpEnable ? 'Enable' : 'Disable' },
        { id: '4', name: 'Start IP', expected: '192.168.1.2', actual: getVal(doc, 'input[name="StartIp"]') },
        { id: '5', name: 'IP Pool Count', expected: '253', actual: getVal(doc, 'input[name="PoolSize"]') },
        { id: '6', name: 'Lease Time', expected: '86400', actual: getVal(doc, 'input[name="dhcp_LeaseTime"]') }
      ];

      var passedCount = 0;
      var details = [];
      rules.forEach(function(r) {
        var actualVal = (r.actual || '').toString().trim();
        var expectVal = (r.expected || '').toString().trim();
        var isMatch = (actualVal === expectVal);
        
        if (isMatch) passedCount++;
        details.push({
          id: r.id,
          name: r.name,
          expected: r.expected,
          actual: r.actual || '(Trống)',
          passed: isMatch
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
};

if (index !== -1) {
  window.DEVICE_AC1000HI_LESSONS[index] = lessonObj;
} else {
  window.DEVICE_AC1000HI_LESSONS.push(lessonObj);
}

