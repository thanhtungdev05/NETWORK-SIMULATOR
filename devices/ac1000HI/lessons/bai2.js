/**
 * devices/ac1000hi/lessons/bai2.js
 * Bài 2: Cấu hình mạng Wi-Fi trên ONT AC1000HI
 */

window.DEVICE_AC1000HI_LESSONS = window.DEVICE_AC1000HI_LESSONS || [];

var index = window.DEVICE_AC1000HI_LESSONS.findIndex(function(l) { return l.id === 'LAB_AC1000HI_02'; });
var lessonObj = {
  id: 'LAB_AC1000HI_02',
  title: 'Bài 2 - Cấu hình Wi-Fi',
  subtitle: 'Cấu hình Wi-Fi',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Cấu hình dùng cho cả 2 băng tần <b>2.4G</b> và <b>5G</b> theo thông số:',
    '- SSID Name: <span class="val">FPT Telecom-7EA8</span>',
    '- WPA Key: <span class="val">00032934</span>',
    '<br><b>Cách làm:</b>',
    '1. Vào Wireless 2.4G > cấu hình > bấm <b>Save & Apply</b>',
    '2. Vào Wireless 5G > cấu hình > bấm <b>Save & Apply</b>',
    '  (Dữ liệu được lưu tự động khi bấm Save, chuyển trang vẫn còn.)'
  ],
  practiceUrl: '/sim_ac1000hi/cgi-bin/index.asp?page=home_wireless.asp',

  grading: {
    description: 'Kiểm tra cấu hình Wi-Fi 2.4G và 5G',
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
      
      var doc24 = fetchHTML('/sim_ac1000HI/cgi-bin/home_wireless.asp?_=' + new Date().getTime());
      var doc5g = fetchHTML('/sim_ac1000HI/cgi-bin/home_wireless_5g.asp?_=' + new Date().getTime());
      
      function getVal(doc, selector) {
        if (!doc) return '';
        var el = doc.querySelector(selector);
        return el ? el.value.trim() : '';
      }
      
      var rules = [
        { id: '1', name: '2.4G - SSID Name', expected: 'FPT Telecom-7EA8', actual: getVal(doc24, 'input[name="ESSID"]') },
        { id: '2', name: '2.4G - WPA Key', expected: '00032934', actual: getVal(doc24, 'input[name="PreSharedKey2"]') },
        { id: '3', name: '5G - SSID Name', expected: 'FPT Telecom-7EA8', actual: getVal(doc5g, 'input[name="ESSID"]') },
        { id: '4', name: '5G - WPA Key', expected: '00032934', actual: getVal(doc5g, 'input[name="PreSharedKey2"]') }
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
          actual: r.actual,
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


