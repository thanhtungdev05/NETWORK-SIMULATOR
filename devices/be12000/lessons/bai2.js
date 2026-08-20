/**
 * devices/be12000/lessons/bai2.js
 * Bài 2 - Cấu hình Wi-Fi MLO (Wi-Fi 7) trên BE12000
 */

window.DEVICE_BE12000_LESSONS = window.DEVICE_BE12000_LESSONS || [];

window.DEVICE_BE12000_LESSONS.push({
  id: 'LAB_BE12000_02',
  title: 'Bài 2 - Cấu hình Wi-Fi MLO (Wi-Fi 7)',
  subtitle: 'Cấu hình Multi-Link Operation (MLO) trên BE12000',
  instructions: [
    'Chọn menu <b>Local Network > WLAN > MLO</b>',
    '- MLO Enable: <span class="val">On</span>',
    '- SSID Name: <span class="val">FPT_BE12000_MLO</span>',
    'Bấm <b>Apply</b> để lưu cấu hình',
  ],
  practiceUrl: '/sim_be12000/login',
  grading: {
    description: 'Kiểm tra WLAN MLO configuration trên BE12000',
    rules: [
      {
        id: 'mlo_ssid',
        name: 'SSID Name',
        selector: 'input[name*="ESSID"], #ESSID',
        expected: 'FPT_BE12000_MLO',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: [
    {
      selector: 'a#MM_localnet, #MM_localnet',
      text: 'Bước 1: Chọn Local Network',
      position: 'bottom'
    },
    {
      selector: 'a[href*="WLANMLO"], #WLANMLO',
      text: 'Bước 2: Chọn WLAN > MLO',
      position: 'right'
    },
    {
      selector: 'input[name*="ESSID"], #ESSID',
      text: 'Bước 3: Nhập SSID Name (FPT_BE12000_MLO)',
      position: 'right'
    },
    {
      selector: 'input[type="submit"], input[value="Apply"], #Btn_Apply',
      text: 'Bước 4: Bấm Apply để lưu',
      position: 'bottom'
    }
  ]
});
