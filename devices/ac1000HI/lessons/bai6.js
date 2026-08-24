/**
 * devices/ac1000hi/lessons/bai6.js
 * Bài 6: Cấu hình Port Forwarding trên ONT AC1000HI
 */

window.DEVICE_AC1000HI_LESSONS = window.DEVICE_AC1000HI_LESSONS || [];

var index = window.DEVICE_AC1000HI_LESSONS.findIndex(function(l) { return l.id === 'LAB_AC1000HI_06'; });
var lessonObj = {
  id: 'LAB_AC1000HI_06',
  title: 'Bài 6 - Cấu hình Port Forwarding',
  subtitle: 'Cấu hình Port Forwarding',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình Mở Port trên thiết bị theo các thông số được cung cấp dưới đây.',
    '- Start External Port: <span class="val">3389</span>',
    '- End External Port: <span class="val">3389</span>',
    '- IP Address: <span class="val">192.168.1.254</span>',
    '- Start Internal Port: <span class="val">3389</span>',
    '- End Internal Port: <span class="val">3389</span>',
  ],
  practiceUrl: '/sim_ac1000HI/cgi-bin/index.asp?page=adv_nat_top.asp',

  clearFields: [
    'input[name="start_port1"]',
    'input[name="end_port1"]',
    'input[name="Addr1"]',
    'input[name="local_sport"]',
    'input[name="local_eport"]'
  ],

  grading: {
    description: 'Kiểm tra cấu hình Port Forwarding (Virtual Server)',
    customGrading: function(allDocs) {
      function fetchKho() {
        try {
          var req = new XMLHttpRequest();
          req.open('GET', '/sim_ac1000HI/__sim/kho?_=' + new Date().getTime(), false);
          req.send(null);
          if (req.status === 200) {
            return JSON.parse(req.responseText);
          }
        } catch(e) {}
        return null;
      }
      
      var state = fetchKho();
      var vs = (state && state.adv_nat_top && state.adv_nat_top.virtual_servers) ? state.adv_nat_top.virtual_servers : [];
      
      // Tìm rule thỏa mãn yêu cầu (nếu user tạo nhiều rule thì chỉ cần 1 rule đúng là pass)
      var foundRule = null;
      for (var i = 0; i < vs.length; i++) {
        var r = vs[i];
        if (r && r.start_port === "3389" && r.end_port === "3389" && 
            r.ip === "192.168.1.254" && r.local_sport === "3389" && r.local_eport === "3389") {
          foundRule = r;
          break;
        }
      }
      
      // Nếu không có rule hoàn hảo, lấy rule đầu tiên do user tạo để show ra
      if (!foundRule) {
        for (var i = 0; i < vs.length; i++) {
          if (vs[i]) {
            foundRule = vs[i];
            break;
          }
        }
      }
      
      var actualStartExt = foundRule ? (foundRule.start_port !== "N/A" ? foundRule.start_port : "") : "";
      var actualEndExt = foundRule ? (foundRule.end_port !== "N/A" ? foundRule.end_port : "") : "";
      var actualIp = foundRule ? (foundRule.ip !== "N/A" ? foundRule.ip : "") : "";
      var actualStartInt = foundRule ? (foundRule.local_sport !== "N/A" ? foundRule.local_sport : "") : "";
      var actualEndInt = foundRule ? (foundRule.local_eport !== "N/A" ? foundRule.local_eport : "") : "";

      var rules = [
        { id: '1', name: 'Start External Port', expected: '3389', actual: actualStartExt },
        { id: '2', name: 'End External Port', expected: '3389', actual: actualEndExt },
        { id: '3', name: 'IP Address', expected: '192.168.1.254', actual: actualIp },
        { id: '4', name: 'Start Internal Port', expected: '3389', actual: actualStartInt },
        { id: '5', name: 'End Internal Port', expected: '3389', actual: actualEndInt }
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
