/**
 * devices/ac1000f/lessons/bai7.js
 * Bài 7: C?u hình Backup/Restore
 */

window.DEVICE_AC1000F_LESSONS = window.DEVICE_AC1000F_LESSONS || [];

window.DEVICE_AC1000F_LESSONS.push({
  id: 'LAB_AC1000F_07',
  title: 'Bài 7 - C?u hình Backup/Restore',
  subtitle: 'Sao luu và ph?c h?i c?u hình thi?t b?',
  instructions: [
    '<b>Yêu c?u:</b> Th?c hi?n thao tác t?i v? (Download) file c?u hình hi?n t?i c?a thi?t b? (Backup).',
  ],
  practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=tools_update.asp',

  // Ràng bu?c di?u ki?n ch?m dúng Ä‘Ãºng
  grading: {
    description: 'Ki?m tra Backup c?u hình',
    rules: [
      {
        id: 'tools_update',
        name: 'Trang Backup & Update',
        selector: 'input[value="Download"], input[onclick*="backup_settings"]',
        expected: 'Download',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  }
});



