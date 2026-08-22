/**
 * devices/ac1000f/lessons/bai4.js
 * Bài 4: Cấu hình Mở Port trên ONT AC1000F
 */

window.DEVICE_AC1000F_LESSONS = window.DEVICE_AC1000F_LESSONS || [];

window.DEVICE_AC1000F_LESSONS.push({
  id: 'LAB_AC1000F_06',
  title: 'Cấu hình Port Forwarding',
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
  practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=adv_nat_top.asp',

  // Ràng buộc điều kiện chấm đúng
  grading: {
    description: 'Kiểm tra cấu hình Mở Port (7 tiêu chí)',
    customGrading: function(allDocs) {
      var doc = null;
      for (var i = 0; i < allDocs.length; i++) {
        if (allDocs[i].URL.toLowerCase().indexOf('adv_nat_top.asp') !== -1) {
          doc = allDocs[i];
          break;
        }
      }
      
      // Hàm tiện ích lấy value
      function getVal(selector) {
        if (!doc) return '';
        try {
          var el = doc.querySelector(selector);
          if (el) return el.value.trim();
        } catch(e) {}
        return '';
      }
      
      // Hàm tiện ích lấy text của thẻ select
      function getSelectText(selector) {
        if (!doc) return '';
        try {
          var el = doc.querySelector(selector);
          if (el && el.selectedIndex >= 0) return el.options[el.selectedIndex].text.trim();
        } catch(e) {}
        return '';
      }

      var rules = [
        { id: '1', name: 'IPv4 NAT Type', expected: 'Virtual Server', actual: getSelectText('select[name="NATtyleChange"]') },
        { id: '2', name: 'Start External Port', expected: '3389', actual: getVal('input[name="start_port1"]') },
        { id: '3', name: 'End External Port', expected: '3389', actual: getVal('input[name="end_port1"]') },
        { id: '4', name: 'Local IP Address', expected: 'Manually Enter IP Address', actual: getSelectText('select[name="Virsvr_IP_select"]') },
        { id: '5', name: 'IP Address', expected: '192.168.1.254', actual: getVal('input[name="Addr1"]') },
        { id: '6', name: 'Start Internal Port', expected: '3389', actual: getVal('input[name="local_sport"]') },
        { id: '7', name: 'End Internal Port', expected: '3389', actual: getVal('input[name="local_eport"]') }
      ];

      var passedCount = 0;
      var details = [];
      rules.forEach(function(r) {
        var isMatch = (r.actual === r.expected);
        if (isMatch) passedCount++;
        details.push({
          id: r.id,
          name: r.name,
          expected: r.expected,
          actual: r.actual || '(Chưa nhập / Chưa chọn)',
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


