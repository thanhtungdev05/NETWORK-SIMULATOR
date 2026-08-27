/**
 * Bài 6: Cấu hình Port Forwarding trên ONT AC1000F
 */

window.DEVICE_AC1000F_LESSONS = window.DEVICE_AC1000F_LESSONS || [];

window.DEVICE_AC1000F_LESSONS.push({
  id: 'LAB_AC1000F_06',
  title: 'Bài 6 - Cấu hình Port Forwarding',
  subtitle: 'Mở cổng dịch vụ từ Internet vào thiết bị trong mạng LAN',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Tạo quy tắc Port Forwarding theo các thông số sau:',
    '- Start External Port: <span class="val">3389</span>',
    '- End External Port: <span class="val">3389</span>',
    '- IP Address: <span class="val">192.168.1.254</span>',
    '- Start Internal Port: <span class="val">3389</span>',
    '- End Internal Port: <span class="val">3389</span>'
  ],
  practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=adv_nat_top.asp',
  grading: {
    description: 'Kiểm tra quy tắc Port Forwarding',
    customGrading: function (allDocs) {
      var doc = null;
      for (var i = 0; i < allDocs.length; i++) {
        if (allDocs[i].URL.toLowerCase().indexOf('adv_nat_top.asp') !== -1) {
          doc = allDocs[i];
          break;
        }
      }

      function getVal(selector) {
        if (!doc) return '';
        try {
          var el = doc.querySelector(selector);
          return el ? el.value.trim() : '';
        } catch (e) {
          return '';
        }
      }

      function getSelectText(selector) {
        if (!doc) return '';
        try {
          var el = doc.querySelector(selector);
          return el && el.selectedIndex >= 0 ? el.options[el.selectedIndex].text.trim() : '';
        } catch (e) {
          return '';
        }
      }

      var rules = [
        { id: 'nat_type', name: 'IPv4 NAT Type', expected: 'Virtual Server', actual: getSelectText('select[name="NATtyleChange"]') },
        { id: 'external_start', name: 'Start External Port', expected: '3389', actual: getVal('input[name="start_port1"]') },
        { id: 'external_end', name: 'End External Port', expected: '3389', actual: getVal('input[name="end_port1"]') },
        { id: 'ip_mode', name: 'Local IP Address', expected: 'Manually Enter IP Address', actual: getSelectText('select[name="Virsvr_IP_select"]') },
        { id: 'ip_address', name: 'IP Address', expected: '192.168.1.254', actual: getVal('input[name="Addr1"]') },
        { id: 'internal_start', name: 'Start Internal Port', expected: '3389', actual: getVal('input[name="local_sport"]') },
        { id: 'internal_end', name: 'End Internal Port', expected: '3389', actual: getVal('input[name="local_eport"]') }
      ];

      var passedCount = 0;
      var details = rules.map(function (rule) {
        var passed = rule.actual === rule.expected;
        if (passed) passedCount++;
        return {
          id: rule.id,
          name: rule.name,
          expected: rule.expected,
          actual: rule.actual || '(Chưa nhập / Chưa chọn)',
          passed: passed
        };
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
