/**
 * step_by_step/index.js — Trình quản lý và hợp nhất dữ liệu Step-by-Step Popups cho toàn bộ thiết bị
 */

(function () {
  'use strict';

  function getAllSteps() {
    return {
      ac1000f: window.STEPS_AC1000F || {},
      ax3000c: window.STEPS_AX3000C || {},
      ax3000gz: window.STEPS_AX3000GZ || {},
      ax3000hv2: window.STEPS_AX3000HV2 || {},
      ax3000s: window.STEPS_AX3000S || {},
      be15000: window.STEPS_BE15000 || {}
    };
  }

  function getForLesson(deviceId, lessonId) {
    const all = getAllSteps();
    const dev = all[deviceId];
    if (dev && dev[lessonId]) {
      const loginSteps = dev['login'] || [];
      // Gộp các bước login vào đầu bài học
      return [...loginSteps, ...dev[lessonId]];
    }
    return [];
  }

  window.STEP_BY_STEP = {
    getAll: getAllSteps,
    getForLesson: getForLesson
  };

  window.getStepByStepPopups = getForLesson;
})();
