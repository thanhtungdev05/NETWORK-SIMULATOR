/**
 * devices/ac1000f/lessons/bai6.js
 * Bài 6: Cấu hình Remote Web
 */

window.DEVICE_AC1000F_LESSONS = window.DEVICE_AC1000F_LESSONS || [];

window.DEVICE_AC1000F_LESSONS.push({
  id: 'LAB_AC1000F_06',
  title: 'Bài 6 - Cấu hình Remote Web',
  subtitle: 'Cấu hình quản lý thiết bị từ xa qua Web',
  instructions: [
    '<b>Yêu cầu:</b> Cấu hình quản lý thiết bị từ xa (Remote Web) với tài khoản:',
    '- Remote Username: <span class="val">admin99</span>',
    '- Remote Password: <span class="val">ftc12345</span>',
  ],
  practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=adv_firewall.asp',

  // Ràng buộc điều kiện chấm đúng Ä‘Ãºng
    grading: {
    description: 'Kiểm tra cấu hình Remote Web',
    customGrading: function(allDocs) {
      var doc = null;
      for (var i = 0; i < allDocs.length; i++) {
        if (allDocs[i].URL.toLowerCase().indexOf('adv_firewall.asp') !== -1) {
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
      
      // 1. Firewall
      var firewall = getRadioVal('firewallEnable');
      var firewallText = firewall === '1' ? 'Enable' : (firewall === '0' ? 'Disable' : 'Chưa chọn');
      
      // 2. SPI
      var spi = getRadioVal('spiEnable');
      var spiText = spi === '1' ? 'Enable' : (spi === '0' ? 'Disable' : 'Chưa chọn');
      
      // 3. Remote Web
      var remoteWeb = getRadioVal('wanAccessLanWebRadio');
      var remoteWebText = remoteWeb === 'Yes' ? 'Enable' : (remoteWeb === 'No' ? 'Disable' : 'Chưa chọn');
      
      // 4. Remote SSH
      var remoteSsh = getRadioVal('sshradio');
      var remoteSshText = remoteSsh === '1' ? 'Enable' : (remoteSsh === '0' ? 'Disable' : 'Chưa chọn');
      
      var rules = [
        { id: '1', name: 'Firewall', expected: 'Enable', actual: firewallText },
        { id: '2', name: 'SPI', expected: 'Disable', actual: spiText },
        { id: '3', name: 'Remote Web', expected: 'Enable', actual: remoteWebText },
        { id: '4', name: 'Remote SSH', expected: 'Disable', actual: remoteSshText },
        { id: '5', name: 'Username', expected: 'admin99', actual: getVal('input[name="remote_username"]') },
        { id: '6', name: 'Password', expected: 'ftc12345', actual: getVal('input[name="remote_password"]') }
      ];

      var passedCount = 0;
      var details = [];
      rules.forEach(function(r) {
        var actualVal = (r.actual || '').toString().trim();
        var expectVal = (r.expected || '').toString().trim();
        
        var isMatch = false;
        if (r.id === '6') {
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



