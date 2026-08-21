/**
 * devices/ax3000hv2/data.js — Cấu hình chung cho AX3000H v2
 * Các bài học chi tiết được quản lý độc lập trong thư mục devices/ax3000hv2/lessons/ (bai1.js .. bai6.js)
 */

window.DEVICE_AX3000HV2 = {
  id: 'ax3000hv2',
  name: 'ONT AX3000HV2',
  shortName: 'AX3000HV2',
  port: 8080,
  folder: 'sim_ax3000hv2',
  serverBat: 'Chay-server.bat',
  needsServer: false,
  loginUrl: '/sim_ax3000hv2/cgi-bin/login.asp',
  categories: [
    {
      title: 'HỌC TẬP',
      lessons: window.DEVICE_AX3000HV2_LESSONS || []
    }
  ]
};

// Đồng bộ Tooltips vào store toàn cục TOOLTIPS_AX3000HV2 để tương thích với popup engine
if (!window.TOOLTIPS_AX3000HV2) window.TOOLTIPS_AX3000HV2 = {};
if (window.DEVICE_AX3000HV2_LESSONS) {
  window.DEVICE_AX3000HV2_LESSONS.forEach(lesson => {
    if (lesson.guidePopups && lesson.guidePopups.length > 0) {
      window.TOOLTIPS_AX3000HV2[lesson.id] = lesson.guidePopups;
    } else if (window.TOOLTIPS_AX3000HV2[lesson.id]) {
      lesson.guidePopups = window.TOOLTIPS_AX3000HV2[lesson.id];
    }
  });
}
