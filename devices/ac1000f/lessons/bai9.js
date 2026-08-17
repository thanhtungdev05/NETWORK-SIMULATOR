/**
 * devices/ac1000f/lessons/bai9.js
 * Bài 9: Cấu hình Reboot Timer
 */

window.DEVICE_AC1000F_LESSONS = window.DEVICE_AC1000F_LESSONS || [];

window.DEVICE_AC1000F_LESSONS.push({
  id: 'LAB_AC1000F_09',
  title: 'Bài 9: Cấu hình Reboot Timer',
  subtitle: 'Lên lịch khởi động lại thiết bị tự động',
    instructions: [
    '<b>Yêu cầu:</b> Cài đặt thời gian tự động khởi động lại (Reboot) thiết bị vào lúc:',
    '- Reboot Time: <span class="val">3:00</span>',
    '- Choose Date: <span class="val">Không được để trống phải chọn</span>'
  ],
  practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=tools_reboottimer.asp',

  // Ràng buộc điều kiện chấm đúng Ä‘Ãºng
    grading: {
    description: 'Kiểm tra lên lịch Reboot',
    customGrading: function(allDocs) {
      var doc = null;
      for (var i = 0; i < allDocs.length; i++) {
        if (allDocs[i].URL.toLowerCase().indexOf('tools_reboottimer.asp') !== -1) {
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
      
      function hasCheckedDate() {
        if (!doc) return false;
        var days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        for(var i = 0; i < days.length; i++) {
          var cb = doc.querySelector('input[name="' + days[i] + '"]');
          if(cb && cb.checked) return true;
        }
        return false;
      }
      
      var rtimer = getRadioVal('reboottimer_enable');
      var rtimerText = rtimer === '1' ? 'Enable' : (rtimer === '0' ? 'Disable' : 'Chưa chọn');
      var dateVal = hasCheckedDate() ? 'Không được để trống phải chọn' : 'Trống';
      
      var rules = [
        { id: '1', name: 'Reboot Timer Status', expected: 'Enable', actual: rtimerText },
        { id: '2', name: 'Reboot Time', expected: '3:00', actual: getVal('input[name="time"]') },
        { id: '3', name: 'Choose Date', expected: 'Không được để trống phải chọn', actual: dateVal }
      ];

      var passedCount = 0;
      var details = [];
      rules.forEach(function(r) {
        var actualVal = (r.actual || '').toString().trim();
        var expectVal = (r.expected || '').toString().trim();
        
        var isMatch = (actualVal.toLowerCase() === expectVal.toLowerCase());
        
        // Flexible check for 03:00 vs 3:00
        if (!isMatch && r.id === '2') {
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



