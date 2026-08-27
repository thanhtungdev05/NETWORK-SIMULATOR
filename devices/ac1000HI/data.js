/**
 * devices/ac1000HI/data.js — Cấu hình chung cho ONT ac1000HI
 */

window.DEVICE_AC1000HI = {
  id: 'ac1000HI',
  name: 'ONT AC1000HI',
  shortName: 'AC1000HI',
  port: 8080,
  folder: 'sim_ac1000HI',
  serverBat: '',
  needsServer: false,
  loginUrl: '/sim_ac1000HI/cgi-bin/login.asp',
  categories: [
    {
      title: 'HỌC TẬP',
      lessons: window.DEVICE_AC1000HI_LESSONS || []
    }
  ]
};

// Đồng bộ Tooltips vào store toàn cục TOOLTIPS_AC1000HI để tương thích với popup engine
if (!window.TOOLTIPS_AC1000HI) window.TOOLTIPS_AC1000HI = {};
if (window.DEVICE_AC1000HI_LESSONS) {
  window.DEVICE_AC1000HI_LESSONS.forEach(lesson => {
    if (lesson.guidePopups && lesson.guidePopups.length > 0) {
      window.TOOLTIPS_AC1000HI[lesson.id] = lesson.guidePopups;
    } else if (window.TOOLTIPS_AC1000HI[lesson.id]) {
      lesson.guidePopups = window.TOOLTIPS_AC1000HI[lesson.id];
    }
  });
}
