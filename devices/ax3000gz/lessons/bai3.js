/**
 * devices/ax3000gz/lessons/bai3.js
 * Bài 3: Tính năng BandSteering trên AX3000GZ
 */

window.DEVICE_AX3000GZ_LESSONS = window.DEVICE_AX3000GZ_LESSONS || [];

window.DEVICE_AX3000GZ_LESSONS.push({
  id: 'LAB_AX3000GZ_03',
  title: 'Bài 3: Tính năng BandSteering',
  subtitle: 'Kích hoạt và cấu hình tính năng Band Steering',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình tính năng Band Steering tự động phân bổ băng tần:',
    '- RSSI Threshold(2.4g): <span class="val">-65</span>',
    '- RSSI Threshold(5g): <span class="val">-65</span>',
  ],
  practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/localnetwork/WLAN/BandSteering',
  clearFields: [
    '[id="widget.cbid.json.BandSteering.RssiThreshold2g"]',
    '[id="widget.cbid.json.BandSteering.RssiThreshold5g"]'
  ],
  grading: {
    description: 'Kiểm tra Band Steering trên AX3000GZ',
    rules: [
      {
        id: 'rssi_24g',
        name: 'RSSI Threshold 2.4G',
        selector: '[id="widget.cbid.json.BandSteering.RssiThreshold2g"]',
        expected: '-65',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'rssi_5g',
        name: 'RSSI Threshold 5G',
        selector: '[id="widget.cbid.json.BandSteering.RssiThreshold5g"]',
        expected: '-65',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
