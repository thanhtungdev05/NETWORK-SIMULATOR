/**
 * devices/be12000/lessons/bai3.js
 * Bài 3 - Trạng thái WAN Ethernet trên BE12000
 */

window.DEVICE_BE12000_LESSONS = window.DEVICE_BE12000_LESSONS || [];

window.DEVICE_BE12000_LESSONS.push({
  id: 'LAB_BE12000_03',
  title: 'Bài 3 - Trạng thái WAN Ethernet',
  subtitle: 'Xem thông tin và trạng thái kết nối WAN',
  instructions: [
    'Chọn menu <b>Internet > Status > WAN</b>',
    '- Kiểm tra trạng thái kết nối Internet',
    '- Xem địa chỉ IP WAN, Gateway, DNS',
    '- Kiểm tra uptime và gói tin gửi/nhận',
  ],
  practiceUrl: '/sim_be12000/login',
  grading: {
    description: 'Kiểm tra Ethernet WAN Status',
    rules: []
  },
  guidePopups: [
    {
      selector: 'a#MM_internet, #MM_internet',
      text: 'Bước 1: Chọn Internet',
      position: 'bottom'
    },
    {
      selector: 'a[href*="ethWanStatus"], #ethWanStatus',
      text: 'Bước 2: Chọn Status > WAN',
      position: 'right'
    }
  ]
});
