/**
 * devices/ac1000f/lessons/bai3.js
 * Bài 3: Cấu hình Wi-Fi IoT trên ONT AC1000F
 */

(function () {
  window.DEVICE_AC1000F_LESSONS = window.DEVICE_AC1000F_LESSONS || [];

  window.DEVICE_AC1000F_LESSONS.push({
    id: 'LAB_AC1000F_03',
    title: 'Cấu hình wifi IoT',
    subtitle: 'Cấu hình wifi IoT',
    instructions: [
      '<b>Yêu cầu:</b>',
      'Cấu hình mạng dành cho các thiết bị IoT trên băng tần <b>2.4G</b> theo thông số:',
      '- SSID Name: <span class="val">FPT Telecom-7EA8</span>',
      '- WPA Key: <span class="val">00032934</span>',
      '<br><b>Lưu ý:</b>',
      '1. Vào mục Network → Wireless 2.4G',
      '2. Đặt Tên Wifi và Mật khẩu theo yêu cầu',
      '3. Bấm <b>Save & Apply</b>',
      '→ Giữ nguyên các thông số mặc định của băng tần 2.4G. Không cần cấu hình 5G.'
    ],
    practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=home_wireless.asp',
    // Xóa localStorage wifi cũ khi bắt đầu phiên mới
    onSimLoad: function(iframeWindow) {
      try {
        var loc = (iframeWindow.location.href || '').toLowerCase();
        if (loc.indexOf('home_wireless') === -1) {
          localStorage.removeItem('ftc_sim_wifi24');
        }
      } catch(e) {}
    },

    clearFields: [
      'input[name="ESSID"]',
      'input[name="PreSharedKey1"]',
      'input[name="PreSharedKey2"]',
      'input[name="PreSharedKey3"]'
    ],

    grading: {
      description: 'Kiểm tra cấu hình Wi-Fi IoT (2.4G)',

      customGrading: function (allDocs) {
        var data24 = null;
        var is24Saved = false;
        try {
          var raw24 = localStorage.getItem('ftc_sim_wifi24');
          if (raw24) {
            data24 = JSON.parse(raw24);
            is24Saved = true;
          }
        } catch (e) { }

        for (var i = 0; i < allDocs.length; i++) {
          try {
            var url = allDocs[i].URL.toLowerCase();
            if (url.indexOf('home_wireless.asp') !== -1) {
              data24 = _captureFormData(allDocs[i]);
            }
          } catch (e) { }
        }

        var allDetails = [];
        var totalRules = 0, passedRules = 0;

        function g(data, name) {
          return data && data[name] ? String(data[name]).trim() : '';
        }

        function getKey(data) {
          if (!data) return '';
          var auth = g(data, 'WEP_Selection');
          if (auth === 'WPA2PSK') return g(data, 'PreSharedKey1');
          if (auth === 'WPAPSK') return g(data, 'PreSharedKey2');
          if (auth === 'WPAPSKWPA2PSK') return g(data, 'PreSharedKey3');
          return g(data, 'PreSharedKey3') || g(data, 'PreSharedKey1') || g(data, 'PreSharedKey2') || g(data, 'PreSharedKey');
        }

        function addRule(id, name, expected, actual, passed) {
          totalRules++;
          if (passed) passedRules++;
          allDetails.push({
            id: id,
            name: name,
            expected: expected,
            actual: actual || '(Trống)',
            passed: passed,
            message: passed ? 'Chính xác' : 'Sai'
          });
        }

        allDetails.push({ id: '_h24', name: '━━ CẤU HÌNH WI-FI IoT (2.4G) ━━', expected: '', actual: '', passed: true, message: '', _isHeader: true });
        if (data24) {
          var ap24 = g(data24, 'wlan_APenable');
          addRule('24_ap', '[2.4G] Radio', 'Enable', ap24 === '1' ? 'Enable' : 'Disable', ap24 === '1' && is24Saved);

          var ssid24 = g(data24, 'ESSID') || g(data24, 'ssid');
          addRule('24_ssid', '[2.4G] SSID Name', 'FPT Telecom-7EA8', ssid24, ssid24 === 'FPT Telecom-7EA8' && is24Saved);

          var key24 = getKey(data24);
          addRule('24_key', '[2.4G] WPA Passphrase', '00032934', key24, key24 === '00032934' && is24Saved);
          
          if (!is24Saved) {
            totalRules++;
            allDetails.push({ id: 'hint_24', name: '⚠ Chưa lưu cấu hình', expected: 'Bấm Save & Apply để lưu cấu hình', actual: 'Chưa lưu', passed: false, _isHint: true });
          }
        } else {
          totalRules++;
          allDetails.push({ id: 'hint_24', name: '⚠ Chưa cấu hình Wi-Fi', expected: 'Vào Wireless 2.4G → cấu hình → bấm Save', actual: 'Chưa lưu', passed: false, _isHint: true });
        }

        var score = totalRules === 0 ? 0 : Math.round((passedRules / totalRules) * 100);
        return {
          passed: passedRules > 0 && passedRules === totalRules,
          score: score,
          passedCount: passedRules,
          totalRules: totalRules,
          details: allDetails
        };
      }
    }
  });

  // Helper: lấy dữ liệu form từ một document
  function _captureFormData(doc) {
    try {
      var form = doc.WLAN || doc.forms[0];
      if (!form) return null;
      var data = {};
      for (var i = 0; i < form.elements.length; i++) {
        var el = form.elements[i];
        if (!el.name) continue;
        if (el.type === 'radio' || el.type === 'checkbox') {
          if (el.checked) data[el.name] = el.value;
        } else {
          data[el.name] = el.value;
        }
      }
      return data;
    } catch (e) { return null; }
  }

})();
