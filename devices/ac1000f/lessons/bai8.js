/**
 * devices/ac1000f/lessons/bai8.js
 * Bài 8: Cấu hình WiFi Timer
 */

window.DEVICE_AC1000F_LESSONS = window.DEVICE_AC1000F_LESSONS || [];

window.DEVICE_AC1000F_LESSONS.push({
  id: 'LAB_AC1000F_08',
  title: 'Bài 8 - Cấu hình WiFi Timer',
  subtitle: 'Lên lịch tắt/bật Wi-Fi tự động',
    instructions: [
    '<b>Yêu cầu:</b> Lên lịch tự động bật/tắt Wi-Fi với khoảng thời gian:',
    '- Start Time: <span class="val">8:00</span>',
    '- End Time: <span class="val">17:00</span>'
  ],
  practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=tools_wifitimer.asp',

  // Ràng buộc điều kiện chấm đúng Ä‘Ãºng
    grading: {
    description: 'Kiểm tra lên lịch WiFi',
    customGrading: function(allDocs) {
      var doc = null;
      for (var i = 0; i < allDocs.length; i++) {
        if (allDocs[i].URL.toLowerCase().indexOf('tools_wifitimer.asp') !== -1) {
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
      
      function getRadioVal(name) {
        if (!doc) return '';
        try {
          var radios = doc.querySelectorAll('input[name="' + name + '"]');
          for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) return radios[i].value;
          }
        } catch(e) {}
        return '';
      }
      
      var wtimer = getRadioVal('wifitimer_enable');
      var wtimerText = wtimer === '1' ? 'Enable' : (wtimer === '0' ? 'Disable' : 'Chưa chọn');
      
      var rules = [
        { id: '1', name: 'WiFi Timer Status', expected: 'Enable', actual: wtimerText },
        { id: '2', name: 'Start Time', expected: '8:00', actual: getVal('input[name="starttime"]') },
        { id: '3', name: 'End Time', expected: '17:00', actual: getVal('input[name="endtime"]') }
      ];

      var passedCount = 0;
      var details = [];
      rules.forEach(function(r) {
        var actualVal = (r.actual || '').toString().trim();
        var expectVal = (r.expected || '').toString().trim();
        
        // Case-insensitive
        var isMatch = (actualVal.toLowerCase() === expectVal.toLowerCase());
        
        // Flexible check for 08:00 vs 8:00
        if (!isMatch && (r.id === '2' || r.id === '3')) {
          if (actualVal.replace(/^0/, '') === expectVal.replace(/^0/, '')) {
             isMatch = true;
          }
        }
        
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
});



