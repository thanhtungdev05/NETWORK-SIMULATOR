/**
 * devices/ax3000gz/lessons/bai3.js
 * Bài 3: Cấu hình WiFi IoT trên AX3000GZ
 */

window.DEVICE_AX3000GZ_LESSONS = window.DEVICE_AX3000GZ_LESSONS || [];

var idx = window.DEVICE_AX3000GZ_LESSONS.findIndex(function (l) { return l.id === 'LAB_AX3000GZ_03'; });
var lessonObj = {
  id: 'LAB_AX3000GZ_03',
  title: 'Bài 3 - Cấu hình Wi-Fi IoT',
  subtitle: 'Cấu hình Wi-Fi IoT',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình một mạng Wi-Fi riêng biệt dành riêng cho các thiết bị IoT (Smart Home, Camera, v.v.). Cấu hình các thông số mạng Wi-Fi IoT trên băng tần 2.4G theo đúng yêu cầu dưới đây:',
    '- SSID Name: <span class="val">FPT IoT</span>',
    '- WPA Key: <span class="val">fptiot123</span>',
  ],
  practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/localnetwork/WLAN/WLANbasic',
  clearFields: [
    '[id="modal_field_SSID"]',
    '[id="modal_field_KeyPassphrase"] input'
  ],
  grading: {
    description: 'Kiểm tra SSID và WPA Key (IoT) trên AX3000GZ',
    rules: [
      {
        id: 'wlan_ssid_iot',
        name: 'Tên Wi-Fi IoT (SSID)',
        selector: '[id="modal_field_SSID"]',
        expected: 'FPT IoT',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'wlan_key_iot',
        name: 'Mật khẩu Wi-Fi IoT (WPA Key)',
        selector: '[id="modal_field_KeyPassphrase"] input',
        expected: 'fptiot123',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: [
    {
      selector: '#topmenu a[href*="localnetwork"]',
      text: 'Chọn Local Network',
      position: 'bottom',
      hideOnPage: 'localnetwork'
    },
    {
      selector: '#sidebarmenu a[href*="/localnetwork/WLAN"]',
      text: 'Chọn WLAN',
      position: 'right',
      hideOnPage: 'wlan'
    },
    {
      selector: '.tabs a[href*="WLANbasic"]',
      text: 'Chọn tab WLAN Basic',
      position: 'bottom',
      hideOnPage: 'wlanbasic'
    },
    {
      selector: '#wlan_ssid_config_text',
      text: 'Bước 1: Bấm vào "WLAN SSID Configuration" để mở rộng bảng cấu hình',
      position: 'right',
      page: 'wlan'
    },
    {
      selector: '#cbi-json-WLANSSID1 .cbi-button-edit',
      text: 'Bước 2: Chọn Edit ở dòng SSID2(2.4G)',
      position: 'left',
      page: 'wlan'
    },
    {
      selector: '[id="modal_field_SSID"]',
      text: 'Bước 3: Nhập SSID Name: FPT IoT',
      position: 'right',
      page: 'wlan'
    },
    {
      selector: '[id="modal_field_KeyPassphrase"] input',
      text: 'Bước 4: Nhập WPA Passphrase: fptiot123',
      position: 'right',
      page: 'wlan'
    },
    {
      selector: '#modal_overlay .cbi-button-save, .modal .cbi-button-save',
      text: 'Bước 5: Chọn Apply để lưu cấu hình',
      position: 'top',
      page: 'wlan'
    }
  ]
};

if (idx !== -1) {
  window.DEVICE_AX3000GZ_LESSONS[idx] = lessonObj;
} else {
  window.DEVICE_AX3000GZ_LESSONS.push(lessonObj);
}
