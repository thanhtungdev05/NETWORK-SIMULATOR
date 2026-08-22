/**
 * devices/ax3000s/lessons/bai2.js
 * Bài 2: Cấu hình WIFI trên AX3000S
 */

window.DEVICE_AX3000S_LESSONS = window.DEVICE_AX3000S_LESSONS || [];

window.DEVICE_AX3000S_LESSONS.push({
  id: 'LAB_AX3000S_02',
  title: 'Cấu hình wifi',
  subtitle: 'Cấu hình wifi',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình các thông số mạng Wi-Fi theo đúng yêu cầu dưới đây:',
    '- SSID Name: <span class="val">FPT Telecom</span>',
    '- WPA Key: <span class="val">19006600</span>',
  ],
  practiceUrl: '/sim_ax3000s/app.html#wlanBasicSetting2g',
  clearFields: [
    'input[name="Txt_SSID"]',
    'input[name="Pwd_WpaPsk"]'
  ],
  grading: {
    description: 'Kiểm tra WLAN Basic Setting 2.4G/5G trên AX3000S',
    customGrading: function(allDocs) {
      let doc5g = null;
      for (const d of allDocs) {
        if (d.location && d.location.href.toLowerCase().includes('wlanbasicsetting5g')) {
          doc5g = d;
          break;
        }
      }
      
      if (!doc5g) {
        return {
          passed: false,
          score: 0,
          details: [
            {
              id: 'wifi_5g_saved',
              name: 'Cấu hình và lưu 5G',
              expected: 'Đã hoàn thành và lưu cấu hình WLAN 5G',
              actual: 'Chưa chuyển sang trang WLAN 5G',
              passed: false,
              message: 'Hãy chọn sang mục WLAN 5G và lưu cấu hình'
            }
          ]
        };
      }

      const ssidEl = doc5g.querySelector('#Txt_SSID');
      const pwdEl = doc5g.querySelector('#Pwd_WpaPsk');
      const ssidVal = ssidEl ? ssidEl.value.trim() : '';
      const pwdVal = pwdEl ? pwdEl.value.trim() : '';
      const isSaved = !!doc5g._ftcIsSaved;

      const ssidPassed = ssidVal === 'FPT Telecom';
      const pwdPassed = pwdVal === '19006600';
      const savedPassed = isSaved;

      const passed = ssidPassed && pwdPassed && savedPassed;
      const score = (ssidPassed ? 30 : 0) + (pwdPassed ? 30 : 0) + (savedPassed ? 40 : 0);

      const details = [
        {
          id: 'wifi_ssid_5g',
          name: 'Tên Wi-Fi (SSID) 5G',
          expected: 'FPT Telecom',
          actual: ssidVal || '(Trống)',
          passed: ssidPassed,
          message: ssidPassed ? 'Chính xác' : `Mong muốn: "FPT Telecom", Thực tế: "${ssidVal || 'Trống'}"`
        },
        {
          id: 'wifi_key_5g',
          name: 'Mật khẩu Wi-Fi (WPA Key) 5G',
          expected: '19006600',
          actual: pwdVal || '(Trống)',
          passed: pwdPassed,
          message: pwdPassed ? 'Chính xác' : `Mong muốn: "19006600", Thực tế: "${pwdVal || 'Trống'}"`
        },
        {
          id: 'wifi_saved_5g',
          name: 'Bấm Save để lưu cấu hình 5G',
          expected: 'Đã bấm Save',
          actual: isSaved ? 'Đã bấm Save' : 'Chưa bấm Save',
          passed: savedPassed,
          message: isSaved ? 'Chính xác' : 'Chưa bấm Save để lưu cấu hình'
        }
      ];

      return {
        passed: passed,
        score: score,
        passedCount: (ssidPassed ? 1 : 0) + (pwdPassed ? 1 : 0) + (savedPassed ? 1 : 0),
        totalRules: 3,
        details: details
      };
    }
  },
  guidePopups: []
});
