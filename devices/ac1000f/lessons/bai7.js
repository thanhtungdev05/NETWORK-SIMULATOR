/**
 * devices/ac1000f/lessons/bai7.js
 * Bài 7: Cấu hình Backup/Restore
 */

window.DEVICE_AC1000F_LESSONS = window.DEVICE_AC1000F_LESSONS || [];

window.DEVICE_AC1000F_LESSONS.push({
  id: 'LAB_AC1000F_07',
  title: 'Bài 7 - Cấu hình Backup/Restore',
  subtitle: 'Sao lưu và phục hồi cấu hình thiết bị',
  instructions: [
    '<b>Yêu cầu:</b> Thực hiện thao tác tải về (Download) file cấu hình hiện tại của thiết bị (Backup).',
  ],
  practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=tools_update.asp',

  // Ràng buộc điều kiện chấm đúng Ä‘Ãºng
  grading: {
    description: 'Kiểm tra Backup cấu hình',
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



