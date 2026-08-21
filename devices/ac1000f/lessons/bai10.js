/**
 * devices/ac1000f/lessons/bai10.js
 * Bài 10: Cấu hình chặn Web
 */

window.DEVICE_AC1000F_LESSONS = window.DEVICE_AC1000F_LESSONS || [];

window.DEVICE_AC1000F_LESSONS.push({
  id: 'LAB_AC1000F_10',
  title: 'Bài 10 - Cấu hình chặn Web',
  subtitle: 'Thiết lập quy tắc lọc và chặn truy cập Web',
    instructions: [
    '<b>Yêu cầu:</b> Cấu hình tính năng chặn Website (URL Filter):',
    '- Filter Type Selection: <span class="val">URL Filter</span>',
    '- Active: <span class="val">Enable</span>',
    '- URL Index: <span class="val">1</span>',
    '- Individual active: <span class="val">Enable</span>',
    '- URL(host): <span class="val">facebook.com</span>'
  ],
  practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=access_ipfilter.asp',

  // Ràng buộc điều kiện chấm đúng Ä‘Ãºng
    grading: {
    description: 'Kiểm tra cấu hình chặn Web',
    customGrading: function(allDocs) {
      var doc = null;
      for (var i = 0; i < allDocs.length; i++) {
        if (allDocs[i].URL.toLowerCase().indexOf('access_urlfilter.asp') !== -1) {
          doc = allDocs[i];
          break;
        }
      }
      
      function getVal(selector) {
        if (!doc) return '';
        try {
          var el = doc.querySelector(selector);
          if (el) {
             if (el.tagName === 'SELECT') {
                 return el.options[el.selectedIndex].text.trim();
             }
             return el.value.trim();
          }
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
      
      var activeRadio = getRadioVal('RuleIndex_active');
      var activeText = activeRadio === '1' ? 'Enable' : (activeRadio === '0' ? 'Disable' : 'Chưa chọn');
      
      var singleRadio = getRadioVal('SingleRule_active');
      var singleText = singleRadio === '1' ? 'Enable' : (singleRadio === '0' ? 'Disable' : 'Chưa chọn');
      
      var rules = [
        { id: '1', name: 'Filter Type Selection', expected: 'URL Filter', actual: getVal('select[name="FILTERTYPE_index"]') },
        { id: '2', name: 'Active', expected: 'Enable', actual: activeText },
        { id: '3', name: 'URL Index', expected: '1', actual: getVal('select[name="UrlFilter_index"]') },
        { id: '4', name: 'Individual active', expected: 'Enable', actual: singleText },
        { id: '5', name: 'URL(host)', expected: 'facebook.com', actual: getVal('input[name="UrlFilter_URL"]') }
      ];

      var passedCount = 0;
      var details = [];
      rules.forEach(function(r) {
        var actualVal = (r.actual || '').toString().trim();
        var expectVal = (r.expected || '').toString().trim();
        
        var isMatch = (actualVal.toLowerCase() === expectVal.toLowerCase());
        
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



