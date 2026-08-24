/**
 * devices/ac1000hi/lessons/bai4.js
 * Bài 4: Cấu hình DNS (DDNS) trên ONT AC1000HI
 */

window.DEVICE_AC1000HI_LESSONS = window.DEVICE_AC1000HI_LESSONS || [];

var index = window.DEVICE_AC1000HI_LESSONS.findIndex(function(l) { return l.id === 'LAB_AC1000HI_04'; });
var lessonObj = {
  id: 'LAB_AC1000HI_04',
  title: 'Bài 4 - Cấu hình DNS',
  subtitle: 'Cấu hình DNS',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình máy chủ DDNS trên thiết bị với các thông số sau:',
    '- Tên Host: <span class="val">ac1000HI.ddns.net</span>',
    '- Username: <span class="val">truongconghau04111994@gmail.com</span>',
    '- Password: <span class="val">fpt12345</span>'
  ],
  practiceUrl: '/sim_ac1000hi/cgi-bin/index.asp?page=access_ddns.asp',

  clearFields: [
    'input[name="sysDNSHost"]',
    'input[name="sysDNSUser"]',
    'input[name="sysDNSPassword"]'
  ],

  grading: {
    description: 'Kiểm tra thông số cấu hình DDNS',
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
      
      var doc = fetchHTML('/sim_ac1000HI/cgi-bin/access_ddns.asp?_=' + new Date().getTime());
      
      function getVal(doc, selector) {
        if (!doc) return '';
        var el = doc.querySelector(selector);
        if (!el) return '';
        if (el.type === 'radio' || el.type === 'checkbox') return el.checked ? el.value : '';
        return el.value.trim();
      }
      
      var isEnable = false;
      if (doc) {
         var enableRadio = doc.querySelector('input[name="Enable_DyDNS"][value="Yes"]');
         if (enableRadio && enableRadio.checked) isEnable = true;
      }

      var rules = [
        { id: '1', name: 'Enable DDNS', expected: 'Yes', actual: isEnable ? 'Yes' : 'No' },
        { id: '2', name: 'Tên Host', expected: 'ac1000HI.ddns.net', actual: getVal(doc, 'input[name="sysDNSHost"]') },
        { id: '3', name: 'Username', expected: 'truongconghau04111994@gmail.com', actual: getVal(doc, 'input[name="sysDNSUser"]') },
        { id: '4', name: 'Password', expected: 'fpt12345', actual: getVal(doc, 'input[name="sysDNSPassword"]') }
      ];

      var passedCount = 0;
      var details = [];
      rules.forEach(function(r) {
        var actualVal = (r.actual || '').toString().trim();
        var expectVal = (r.expected || '').toString().trim();
        var isMatch = (actualVal === expectVal) || (actualVal.toLowerCase() === expectVal.toLowerCase());
        
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


