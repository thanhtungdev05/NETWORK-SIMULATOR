window.DEVICE_BE6500C = {
  id: 'be6500c',
  name: 'AP BE6500C',
  shortName: 'BE6500C',
  port: 8080,
  folder: 'sim_be6500c',
  needsServer: false,
  loginUrl: '/sim_be6500c/login.html',
  categories: [
    {
      title: 'HỌC TẬP',
      lessons: window.DEVICE_BE6500C_LESSONS || []
    }
  ]
};

if (!window.TOOLTIPS_BE6500C) window.TOOLTIPS_BE6500C = {};
if (window.DEVICE_BE6500C_LESSONS) {
  window.DEVICE_BE6500C_LESSONS.forEach(lesson => {
    if (lesson.guidePopups && lesson.guidePopups.length > 0) {
      window.TOOLTIPS_BE6500C[lesson.id] = lesson.guidePopups;
    } else if (window.TOOLTIPS_BE6500C[lesson.id]) {
      lesson.guidePopups = window.TOOLTIPS_BE6500C[lesson.id];
    }
  });
}
