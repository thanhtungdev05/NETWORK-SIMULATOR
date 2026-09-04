/**
 * devices/be6500c/lessons/bai4.js
 */
window.DEVICE_BE6500C_LESSONS = window.DEVICE_BE6500C_LESSONS || [];
window.DEVICE_BE6500C_LESSONS.push({
  id: 'be6500c-bai4',
  title: 'Cấu hình DNS',
  subtitle: 'Cấu hình DNS',
  instructions: [
  "<b>Yêu cầu:</b>",
  "Cấu hình DNS cho thiết bị:",
  "- Primary DNS: <span class=\"val\">8.8.8.8</span>",
  "- Secondary DNS: <span class=\"val\">8.8.4.4</span>"
],
  practiceUrl: '/sim_be6500c/advanced__wan.html',
  clearFields: [],
  grading: {
    description: 'Kiểm tra bài 4',
    rules: [
  {
    "id": "dns_1",
    "name": "Primary DNS",
    "selector": "input[name=\"ipv4Settings.dns.dnsServers.primary\"]",
    "expected": "8.8.8.8",
    "type": "text_exact",
    "trim": true,
    "required": true
  },
  {
    "id": "dns_2",
    "name": "Secondary DNS",
    "selector": "input[name=\"ipv4Settings.dns.dnsServers.secondary\"]",
    "expected": "8.8.4.4",
    "type": "text_exact",
    "trim": true,
    "required": true
  }
]
  },
  guidePopups: [
  {
    "selector": ".MuiTypography-subtitle2:contains(\"Advanced\")",
    "text": "Chọn Advanced",
    "position": "right"
  },
  {
    "selector": ".MuiTypography-subtitle2:contains(\"WAN\")",
    "text": "Chọn WAN",
    "position": "right"
  },
  {
    "selector": "input[name=\"ipv4Settings.dns.dnsServers.primary\"]",
    "text": "Nhập Primary DNS",
    "position": "right"
  },
  {
    "selector": "input[name=\"ipv4Settings.dns.dnsServers.secondary\"]",
    "text": "Nhập Secondary DNS",
    "position": "right"
  },
  {
    "selector": "button:contains(\"Save\")",
    "text": "Chọn Save",
    "position": "right"
  }
]
});
