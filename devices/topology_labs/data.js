/**
 * devices/topology_labs/data.js — Cấu hình chung cho Mô hình Mạng Đa Thiết Bị Liên Kết (Topology Labs)
 * Quản lý các kịch bản thực hành liên kết giữa nhiều thiết bị mạng đồng thời
 */

(function () {
  'use strict';

  window.DEVICE_TOPOLOGY = {
    id: 'topology_labs',
    name: '🔗 Mạng Đa Thiết Bị (Topology)',
    shortName: 'Multi-Device',
    isTopology: true,
    port: 8080,
    folder: 'topology_labs',
    needsServer: false,
    loginUrl: '/sim_ac1000f/cgi-bin/login.asp',
    categories: [
      {
        title: 'MÔ HÌNH MẠNG LIÊN KẾT',
        lessons: window.DEVICE_TOPOLOGY_LESSONS || []
      }
    ]
  };

  // Đồng bộ Tooltips nếu có
  if (!window.TOOLTIPS_TOPOLOGY_LABS) window.TOOLTIPS_TOPOLOGY_LABS = {};
  if (window.DEVICE_TOPOLOGY_LESSONS) {
    window.DEVICE_TOPOLOGY_LESSONS.forEach(function (lesson) {
      if (lesson.guidePopups) {
        window.TOOLTIPS_TOPOLOGY_LABS[lesson.id] = lesson.guidePopups;
      }
    });
  }
})();
