/**
 * devices/be6500c/lessons/bai5.js
 */
window.DEVICE_BE6500C_LESSONS = window.DEVICE_BE6500C_LESSONS || [];
window.DEVICE_BE6500C_LESSONS.push({
  id: 'be6500c-bai5',
  title: 'Cấu hình DHCP',
  subtitle: 'Cấu hình DHCP',
  instructions: [
  "<b>Yêu cầu:</b>",
  "Cấu hình cấp phát DHCP cho mạng LAN:",
  "- Start IP Address: <span class=\"val\">192.168.1.10</span>",
  "- End IP Address: <span class=\"val\">192.168.1.100</span>"
],
  practiceUrl: '/sim_be6500c/advanced__lan.html',
  clearFields: [],
  grading: {
    description: 'Kiểm tra bài 5',
    rules: [
  {
    "id": "dhcp_start",
    "name": "Start IP",
    "selector": "input[name=\"ipv4Settings.dhcp.startAddress\"]",
    "expected": "192.168.1.10",
    "type": "text_exact",
    "trim": true,
    "required": true
  },
  {
    "id": "dhcp_end",
    "name": "End IP",
    "selector": "input[name=\"ipv4Settings.dhcp.endAddress\"]",
    "expected": "192.168.1.100",
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
    "selector": ".MuiTypography-subtitle2:contains(\"LAN\")",
    "text": "Chọn LAN",
    "position": "right"
  },
  {
    "selector": "input[name=\"ipv4Settings.dhcp.startAddress\"]",
    "text": "Nhập Start IP",
    "position": "right"
  },
  {
    "selector": "input[name=\"ipv4Settings.dhcp.endAddress\"]",
    "text": "Nhập End IP",
    "position": "right"
  },
  {
    "selector": "button:contains(\"Save\")",
    "text": "Chọn Save",
    "position": "right"
  }
]
});
