/**
 * devices/ONT_be6500c/lessons/bai6.js
 */
window.DEVICE_ONT_BE6500C_LESSONS = window.DEVICE_ONT_BE6500C_LESSONS || [];
window.DEVICE_ONT_BE6500C_LESSONS.push({
  id: 'ONT_be6500c-bai6',
  title: 'Mở Port thiết bị (Port Forwarding)',
  subtitle: 'Mở Port thiết bị (Port Forwarding)',
  instructions: [
  "<b>Yêu cầu:</b>",
  "Tạo 1 rule Port Forwarding:",
  "- Tên rule (Name): <span class=\"val\">Camera</span>",
  "- Giao thức (Protocol): <span class=\"val\">TCP_UDP</span>",
  "- External Port: <span class=\"val\">8080</span>",
  "- Internal IP: <span class=\"val\">192.168.1.20</span>",
  "- Internal Port: <span class=\"val\">80</span>"
],
  practiceUrl: '/sim_ONT_be6500c/network__portforward.html',
  clearFields: [],
  grading: {
    description: 'Kiểm tra bài 6',
    rules: [
  {
    "id": "pf_name",
    "name": "Name",
    "selector": "input[name=\"name\"]",
    "expected": "Camera",
    "type": "text_exact",
    "trim": true,
    "required": true
  },
  {
    "id": "pf_protocol",
    "name": "Protocol",
    "selector": "input[name=\"protocol\"]",
    "expected": "TCP_UDP",
    "type": "text_exact",
    "trim": true,
    "required": true
  },
  {
    "id": "pf_ext_port",
    "name": "External Port",
    "selector": "input[name=\"externalPort\"]",
    "expected": "8080",
    "type": "text_exact",
    "trim": true,
    "required": true
  },
  {
    "id": "pf_ip",
    "name": "Internal IP",
    "selector": "input[name=\"internalIp\"]",
    "expected": "192.168.1.20",
    "type": "text_exact",
    "trim": true,
    "required": true
  },
  {
    "id": "pf_int_port",
    "name": "Internal Port",
    "selector": "input[name=\"internalPort\"]",
    "expected": "80",
    "type": "text_exact",
    "trim": true,
    "required": true
  }
]
  },
  guidePopups: [
  {
    "selector": ".MuiTypography-subtitle2:contains(\"Network\")",
    "text": "Chọn Network",
    "position": "right"
  },
  {
    "selector": ".MuiTypography-subtitle2:contains(\"Port Forwarding\")",
    "text": "Chọn Port Forwarding",
    "position": "right"
  },
  {
    "selector": "button:contains(\"Add\")",
    "text": "Thêm Rule mới",
    "position": "right"
  },
  {
    "selector": "input[name=\"name\"]",
    "text": "Nhập tên rule",
    "position": "right"
  },
  {
    "selector": "input[name=\"externalPort\"]",
    "text": "Nhập External Port",
    "position": "right"
  },
  {
    "selector": "input[name=\"internalIp\"]",
    "text": "Nhập Internal IP",
    "position": "right"
  },
  {
    "selector": "input[name=\"internalPort\"]",
    "text": "Nhập Internal Port",
    "position": "right"
  },
  {
    "selector": "button:contains(\"Save\")",
    "text": "Lưu cấu hình",
    "position": "right"
  }
]
});
