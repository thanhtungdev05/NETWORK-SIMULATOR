window.DEVICE_ONT_BE6500C = {
  id: 'ONT_be6500c',
  name: 'ONT BE6500C',
  shortName: 'ONT BE6500C',
  port: 8080,
  folder: 'sim_ONT_be6500c',
  needsServer: false,
  loginUrl: '/sim_ONT_be6500c/login.html',
  categories: [
    {
      title: 'HỌC TẬP',
      lessons: window.DEVICE_ONT_BE6500C_LESSONS || []
    }
  ]
};

if (!window.TOOLTIPS_ONT_BE6500C) window.TOOLTIPS_ONT_BE6500C = {};
if (window.DEVICE_ONT_BE6500C_LESSONS) {
  window.DEVICE_ONT_BE6500C_LESSONS.forEach(lesson => {
    if (lesson.guidePopups && lesson.guidePopups.length > 0) {
      window.TOOLTIPS_ONT_BE6500C[lesson.id] = lesson.guidePopups;
    } else if (window.TOOLTIPS_ONT_BE6500C[lesson.id]) {
      lesson.guidePopups = window.TOOLTIPS_ONT_BE6500C[lesson.id];
    }
  });
}
