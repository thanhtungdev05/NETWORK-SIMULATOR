/**
 * devices/be12000/lessons/bai1.js
 * Bài 1 - Cấu hình PPPoE trên BE12000
 */

window.DEVICE_BE12000_LESSONS = window.DEVICE_BE12000_LESSONS || [];

// Thay thế nếu đã tồn tại, hoặc thêm mới
var lessonId = 'LAB_BE12000_01';
var lessonIndex = window.DEVICE_BE12000_LESSONS.findIndex(function(l) { return l.id === lessonId; });

var lessonObj = {
  id: lessonId,
  title: 'Cấu hình PPPoE',
  subtitle: 'Cấu hình PPPoE',
  instructions: [
    'Truy cập <b>/sim_be12000</b> và đăng nhập',
    'Chọn menu <b>Internet > WAN > WAN</b>',
    '- PPP Transfer Type: <span class="val">PPPoE</span>',
    '- Username: <span class="val">Sgfdl-210208-218</span>',
    '- Password: <span class="val">fpt12345</span>',
    'Bấm <b>Apply</b> để lưu cấu hình',
  ],
  practiceUrl: '/sim_be12000/login',
  grading: {
    description: 'Kiểm tra cấu hình PPPoE trên BE12000',
    rules: [
      {
        id: 'wan_cname',
        name: 'Connection Name',
        selector: '#WANCName, input[id^="WANCName"]',
        expected: '',
        type: 'text_exact',
        trim: true,
      },
      {
        id: 'wan_type_route',
        name: 'Type',
        selector: '#mode, select[id^="mode"]',
        expected: 'route',
        type: 'text_exact',
        trim: true,
      },
      {
        id: 'wan_serv_list',
        name: 'Service List',
        selector: '#ServList, select[id^="ServList"]',
        expected: '1',
        type: 'text_exact',
        trim: true,
      },
      {
        id: 'wan_mtu',
        name: 'MTU',
        selector: '#MTU, input[id^="MTU"]',
        expected: '1492',
        type: 'text_exact',
        trim: true,
      },
      {
        id: 'wan_link_mode',
        name: 'Link Type',
        selector: '#linkMode, select[id^="linkMode"]',
        expected: 'PPP',
        type: 'text_exact',
        trim: true,
      },
      {
        id: 'wan_type',
        name: 'PPP Transfer Type',
        selector: '#TransType, select[id^="TransType"]',
        expected: 'PPPoE',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'wan_user',
        name: 'Username',
        selector: '#UserName, input[id^="UserName"]',
        expected: 'hnfdl-123456-789',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'wan_pass',
        name: 'Password',
        selector: '#Password, input[id^="Password"]',
        expected: 'd123456',
        type: 'text_exact',
        trim: true,
        required: true
      },
      {
        id: 'wan_auth',
        name: 'Authentication Type',
        selector: '#AuthType, select[id^="AuthType"]',
        expected: 'PAP,CHAP,MS-CHAP',
        type: 'text_exact',
        trim: true,
      },
      {
        id: 'wan_conn',
        name: 'Connection Mode',
        selector: '#ConnTrigger, select[id^="ConnTrigger"]',
        expected: 'AlwaysOn',
        type: 'text_exact',
        trim: true,
      },
      {
        id: 'wan_ip_mode',
        name: 'IP Version',
        selector: '#IpMode, select[id^="IpMode"]',
        expected: 'IPv4',
        type: 'text_exact',
        trim: true,
      },
      {
        id: 'wan_nat',
        name: 'IP NAT',
        selector: 'input[name^="IsNAT"]:checked',
        expected: '1',
        type: 'radio_value',
      },
      {
        id: 'wan_vlan',
        name: 'IP VLAN',
        selector: 'input[name^="VlanEnable"]:checked',
        expected: '0',
        type: 'radio_value',
      }
    ]
  },
  clearFields: [
    '#UserName, input[id^="UserName"]',
    '#Password, input[id^="Password"]'
  ],
  guidePopups: [
    {
      selector: '#internet:not(.SelectMenuItem)',
      text: 'Bước 1: Chọn menu Internet',
      position: 'bottom'
    },
    {
      selector: '#internetConfig:not(.selectClass2Menu)',
      text: 'Bước 2: Chọn WAN ở cột trái',
      position: 'right'
    },
    {
      selector: '#ethWanConfig:not(.AEleMenu3Selected)',
      text: 'Bước 3: Chọn WAN ở menu ngang',
      position: 'bottom'
    },
    {
      selector: '.instName:contains("internet_tr069"), .collapsibleInst:contains("internet_tr069")',
      text: 'Bước 4: Chọn internet_tr069',
      position: 'bottom'
    },
    {
      selector: '#TransType, select[id^="TransType"]',
      text: 'Bước 5: Chọn PPPoE (PPP Transfer Type)',
      position: 'right'
    },
    {
      selector: '#UserName, input[id^="UserName"]',
      text: 'Bước 6: Nhập Username: hnfdl-123456-789',
      position: 'right'
    },
    {
      selector: '#Password, input[id^="Password"]',
      text: 'Bước 7: Nhập Password: d123456',
      position: 'right'
    },
    {
      selector: '#Btn_apply_internet, .Btn_apply, #Btn_Apply, input[value="Apply"], .button1',
      text: 'Bước 8: Bấm Apply để lưu',
      position: 'top'
    }
  ]
};

lessonObj.customClear = function() {
  var iframe = document.getElementById('deviceIframe');
  if (!iframe || !iframe.contentWindow || !iframe.contentWindow.document) return;
  var doc = iframe.contentWindow.document;

  // 1. Dùng setInterval để xóa trắng ô nhập liên tục (đề phòng AJAX ghi đè)
  if (!doc._ftcClearIntervalStarted) {
    doc._ftcClearIntervalStarted = true;
    doc._clearedFields = {};
    setInterval(function() {
      var selectors = ['[id^="UserName"]', '[id^="Password"]'];
      selectors.forEach(function(sel) {
        var els = doc.querySelectorAll(sel);
        els.forEach(function(el) {
          if (!el._ftcHasInputListener) {
            el._ftcHasInputListener = true;
            el.addEventListener('input', function() { el._ftcUserModified = true; });
          }
          if (doc.activeElement !== el && el.value !== "" && !el._ftcUserModified) {
            el.value = "";
            doc._clearedFields[el.id] = true;
          }
        });
      });
    }, 200);
  }

  // 2. Chặn nút Apply để validate trước (giống script của bạn)
  if (!doc._ftcApplyInterceptorAttached) {
    doc._ftcApplyInterceptorAttached = true;
    doc.addEventListener('click', function (e) {
      if (e.target && e.target.matches("[id^='Btn_apply_internet']")) {
        var errors = [];

        var getVal = function (idPrefix) {
            var el = doc.querySelector("[id^='" + idPrefix + "']");
            return el ? el.value : "";
        };

        var getRadioChecked = function (namePrefix) {
            var el = doc.querySelector("input[name^='" + namePrefix + "']:checked");
            return el ? el.value : "";
        };

        if (getVal("WANCName") !== "") errors.push("Hàng \"Connection Name:\" giá trị đúng là Rỗng, khuyến nghị giá trị đúng Rỗng.");
        if (getVal("mode") !== "route") errors.push("Hàng \"Type:\" giá trị đúng là \"Routing\", khuyến nghị giá trị đúng là \"Routing\".");
        if (getVal("ServList") !== "1") errors.push("Hàng \"Service List:\" giá trị đúng là \"INTERNET\", khuyến nghị giá trị đúng là \"INTERNET\".");
        if (getVal("MTU") !== "1492") errors.push("Hàng \"MTU:\" giá trị đúng là \"1492\", khuyến nghị giá trị đúng là \"1492\".");
        if (getVal("linkMode") !== "PPP") errors.push("Hàng \"Link Type:\" giá trị đúng là PPP, khuyến nghị giá trị đúng là PPP.");
        if (getVal("TransType") !== "PPPoE") errors.push("Hàng \"PPP Transfer Type:\" giá trị đúng là PPPoE, khuyến nghị giá trị đúng là PPPoE.");
        if (getVal("UserName") !== "hnfdl-123456-789") errors.push("Hàng \"Username:\" giá trị đúng là hnfdl-123456-789, khuyến nghị giá trị đúng là hnfdl-123456-789.");
        if (getVal("Password") !== "d123456") errors.push("Hàng \"Password:\" giá trị đúng là d123456, khuyến nghị giá trị đúng là d123456.");
        if (getVal("AuthType") !== "PAP,CHAP,MS-CHAP") errors.push("Hàng \"Authentication Type:\" giá trị đúng là \"Auto\", khuyến nghị giá trị đúng là Auto.");
        if (getVal("ConnTrigger") !== "AlwaysOn") errors.push("Hàng \"Connection Mode:\" giá trị đúng là \"Always On\", khuyến nghị giá trị đúng là \"Always On\".");
        if (getVal("IpMode") !== "IPv4") errors.push("Hàng \"IP Version:\" giá trị đúng là \"IPv4\", khuyến nghị giá trị đúng là \"IPv4\".");
        if (getRadioChecked("IsNAT") !== "1") errors.push("Hàng \"IP NAT:\" giá trị đúng là On vào ô Checkbox, khuyến nghị On vào ô Checkbox.");
        if (getRadioChecked("VlanEnable") !== "0") errors.push("Hàng \"IP VLAN:\" giá trị đúng là Off vào ô Checkbox, khuyến nghị off vào ô Checkbox.");

        if (errors.length > 0) {
            alert("BẠN ĐÃ CẤU HÌNH SAI:\n\n" + errors.join("\n"));
            window._hasClickedSaveInGuide = false; // Phục hồi trạng thái chưa save để hiện lại tooltip
            e.preventDefault();
            e.stopPropagation();
        }
        // Nếu ĐÚNG: Không chặn sự kiện. 
        // -> Giả lập sẽ tự gọi dataPost lưu dữ liệu.
        // -> app.js bắt được window._hasClickedSaveInGuide = true.
        // -> app.js quét mảng rules thấy đúng -> Nút "Nộp bài" bật sáng!
      }
    }, true);
  }
};

if (lessonIndex >= 0) {
  window.DEVICE_BE12000_LESSONS[lessonIndex] = lessonObj;
} else {
  window.DEVICE_BE12000_LESSONS.push(lessonObj);
}
