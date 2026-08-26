/**
 * devices/ac1000hi/lessons/bai1.js
 * Bài 1: Cấu hình PPPoE trên ONT AC1000HI
 */

window.DEVICE_AC1000HI_LESSONS = window.DEVICE_AC1000HI_LESSONS || [];

var index = window.DEVICE_AC1000HI_LESSONS.findIndex(function(l) { return l.id === 'LAB_AC1000HI_01'; });
var lessonObj = {
  id: 'LAB_AC1000HI_01',
  title: 'Bài 1 - Cấu hình PPPoE',
  subtitle: 'Cấu hình PPPoE',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình kết nối WAN/Internet trên thiết bị và thiết lập kết nối PPPoE theo các thông số được cung cấp dưới đây:',
    '- Username: <span class="val">Sgfdl-210208-218</span>',
    '- Password: <span class="val">fpt12345</span>'
  ],
  practiceUrl: '/sim_ac1000hi/cgi-bin/index.asp?page=home_wan.asp',
    // Clear old localStorage when starting a new session
    onSimLoad: function(iframeWindow) {
      try {
        var loc = (iframeWindow.location.href || '').toLowerCase();
        if (loc.indexOf('home_wan') === -1) {
          localStorage.removeItem('ftc_sim_wan');
        }
      } catch(e) {}
    },


  clearFields: [
    'input[name="wan_PPPUsername"]',
    'input[name="wan_PPPPassword"]'
  ],

  grading: {
    description: 'Kiểm tra thông số Username và Password PPPoE',
    customGrading: function(allDocs) {
      var doc = null;
      for (var i = 0; i < allDocs.length; i++) {
        if (allDocs[i].URL.toLowerCase().indexOf('home_wan.asp') !== -1) {
          doc = allDocs[i];
          break;
        }
      }
      
      function getVal(selector) {
        if (!doc) return '';
        try {
          var el = doc.querySelector(selector);
          if (el) return el.value.trim();
        } catch(e) {}
        return '';
      }
      
      var rules = [
        { id: '1', name: 'Username', expected: 'Sgfdl-210208-218', actual: getVal('input[name="wan_PPPUsername"]') },
        { id: '2', name: 'Password', expected: 'fpt12345', actual: getVal('input[name="wan_PPPPassword"]') }
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
