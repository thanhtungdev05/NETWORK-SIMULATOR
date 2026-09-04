window.DEVICE_MIKROTIK_HEXS = {
  id: 'mikrotik_hexs',
  name: 'Router MikroTik',
  type: 'Router',
  port: 8080,
  folder: 'sim_mikrotik_hexs',
  loginUrl: '/sim_mikrotik_hexs/index.html', // Master Dispatcher handle
  categories: [
    {
      title: 'HỌC TẬP',
      lessons: window.DEVICE_MIKROTIK_HEXS_LESSONS || []
    }
  ]
};

if (!window.TOOLTIPS_MIKROTIK_HEXS) window.TOOLTIPS_MIKROTIK_HEXS = {};
if (window.DEVICE_MIKROTIK_HEXS_LESSONS) {
  window.DEVICE_MIKROTIK_HEXS_LESSONS.forEach(lesson => {
    if (lesson.guidePopups && lesson.guidePopups.length > 0) {
      window.TOOLTIPS_MIKROTIK_HEXS[lesson.id] = lesson.guidePopups;
    } else if (window.TOOLTIPS_MIKROTIK_HEXS[lesson.id]) {
      lesson.guidePopups = window.TOOLTIPS_MIKROTIK_HEXS[lesson.id];
    }
  });
}
