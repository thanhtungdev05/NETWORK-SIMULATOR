/**
 * devices/ac1000f/lessons/bai5.js
 * Bài 5: Cấu hình DNS
 */

window.DEVICE_AC1000F_LESSONS = window.DEVICE_AC1000F_LESSONS || [];

window.DEVICE_AC1000F_LESSONS.push({
  id: 'ac1-bai5',
  title: 'Bài 5: Cấu hình DNS',
  subtitle: 'Cấu hình máy chủ DDNS',
  instructions: [
    '<b>Yêu cầu:</b> Thực hiện cấu hình máy chủ DDNS trên thiết bị với các thông số sau:',
    '- Tên Host: <span class="val">ac1000f.ddns.net</span>',
    '- Username: <span class="val">truongconghau04111994@gmail.com</span>',
    '- Password: <span class="val">fpt12345</span>',
  ],
  practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=access_ddns.asp',

  // Ràng buộc điều kiện chấm đúng Ä‘Ãºng
    grading: {
    description: 'Kiểm tra cấu hình DDNS',
    customGrading: function(allDocs) {
      var doc = null;
      for (var i = 0; i < allDocs.length; i++) {
        if (allDocs[i].URL.toLowerCase().indexOf('access_ddns.asp') !== -1) {
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
      
      function getSelectText(selector) {
        if (!doc) return '';
        try {
          var el = doc.querySelector(selector);
          if (el && el.selectedIndex >= 0) return el.options[el.selectedIndex].text.trim();
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
      
      var dyDns = getRadioVal('Enable_DyDNS');
      var dyDnsText = dyDns === 'Yes' ? 'Enable' : (dyDns === 'No' ? 'Disable' : 'Chưa chọn');
      
      var provider = getSelectText('select[name="ddns_ServerName"]');
      
      var wildcard = getRadioVal('Enable_Wildcard');
      var wildcardText = wildcard === 'Yes' ? 'Enable' : (wildcard === 'No' ? 'Disable' : 'Chưa chọn');
      
      var rules = [
        { id: '1', name: 'Dynamic DNS', expected: 'Enable', actual: dyDnsText },
        { id: '2', name: 'Service Provider', expected: 'WWW.noip.com', actual: provider },
        { id: '3', name: 'My Host Name', expected: 'ac1000f.ddns.net', actual: getVal('input[name="sysDNSHost"]') },
        { id: '4', name: 'Username', expected: 'truongconghau04111994@gmail.com', actual: getVal('input[name="sysDNSUser"]') },
        { id: '5', name: 'Password', expected: 'ftc12345', actual: getVal('input[name="sysDNSPassword"]') },
        { id: '6', name: 'Wildcard support', expected: 'Disable', actual: wildcardText }
      ];

      var passedCount = 0;
      var details = [];
      rules.forEach(function(r) {
        var actualVal = (r.actual || '').toString().trim();
        var expectVal = (r.expected || '').toString().trim();
        
        var isMatch = false;
        if (r.id === '5') {
          // Password: case-sensitive
          isMatch = (actualVal === expectVal);
        } else {
          // Others: case-insensitive
          isMatch = (actualVal.toLowerCase() === expectVal.toLowerCase());
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



