/**
 * devices/ax3000gz/lessons/bai9.js
 * Bài 9: Cấu hình Chặn MAC trên AX3000GZ
 */

window.DEVICE_AX3000GZ_LESSONS = window.DEVICE_AX3000GZ_LESSONS || [];

window.DEVICE_AX3000GZ_LESSONS.push({
  id: 'LAB_AX3000GZ_01',
  title: 'Cấu hình PPPoE',
  subtitle: 'Cấu hình PPPoE',
  instructions: [
    '<b>Yêu cầu:</b>',
    'Thực hiện cấu hình chặn địa chỉ MAC truy cập mạng:',
    '- Enable: <span class="val">On</span>',
    '- Name: <span class="val">Blacklist / Deny</span>',
    '- Source MAC Address: <span class="val">AA:BB:CC:DD:EE:FF</span>',
    '- Start Time: <span class="val">08:00:00 AM</span>',
    '- End Time: <span class="val">05:00:00 PM</span>',
    '- Week Days: chọn các ngày trong tuần từ <span class="val">Thứ 2 đến Thứ 6</span>'
  ],
  practiceUrl: '/sim_ax3000gz/cgi-bin/luci/admin/internet/security/filterCriteria',
  clearFields: [
    '[id="modal_field_name"]',
    '[id="modal_field_src_mac"]',
    '[id="modal_field_start_time"]',
    '[id="modal_field_stop_time"]',
    '[id="modal_field_weekdays"] input'
  ],
  grading: {
    description: 'Kiểm tra MAC Filter configuration',
    rules: [
      {
        id: 'pf_enabled',
        name: 'Enable Status',
        selector: '[id="modal_field_enabled"] input[value="1"]',
        expected: '1',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'pf_name',
        name: 'Name',
        selector: '[id="modal_field_name"]',
        expected: 'Blacklist / Deny',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'pf_src_mac',
        name: 'Source MAC Address',
        selector: '[id="modal_field_src_mac"]',
        expected: 'AA:BB:CC:DD:EE:FF',
        type: 'case_insensitive',
        trim: true,
        required: true
      },
      {
        id: 'pf_start_time',
        name: 'Start Time',
        selector: '[id="modal_field_start_time"]',
        expected: '08:00:00 AM',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'pf_stop_time',
        name: 'End Time',
        selector: '[id="modal_field_stop_time"]',
        expected: '05:00:00 PM',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'pf_weekdays_mon',
        name: 'Monday Checked',
        selector: '[id="modal_field_weekdays"] input[value="Mon"]',
        expected: 'Mon',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'pf_weekdays_tue',
        name: 'Tuesday Checked',
        selector: '[id="modal_field_weekdays"] input[value="Tue"]',
        expected: 'Tue',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'pf_weekdays_wed',
        name: 'Wednesday Checked',
        selector: '[id="modal_field_weekdays"] input[value="Wed"]',
        expected: 'Wed',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'pf_weekdays_thu',
        name: 'Thursday Checked',
        selector: '[id="modal_field_weekdays"] input[value="Thu"]',
        expected: 'Thu',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'pf_weekdays_fri',
        name: 'Friday Checked',
        selector: '[id="modal_field_weekdays"] input[value="Fri"]',
        expected: 'Fri',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'pf_weekdays_sat',
        name: 'Saturday Unchecked',
        selector: '[id="modal_field_weekdays"] input[value="Sat"]',
        expected: 'false',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'pf_weekdays_sun',
        name: 'Sunday Unchecked',
        selector: '[id="modal_field_weekdays"] input[value="Sun"]',
        expected: 'false',
        type: 'text_exact',
        trim: true,
        required: true
      }
    ]
  },
  guidePopups: []
});
