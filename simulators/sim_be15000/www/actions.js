/* Hanh vi nut bam cho ban gia lap H6701Q V3 (BE15000).
   Da kiem ke nut cua CA 16 trang (22/7/2026):
     - Refresh (moi trang status/bang)      -> tai lai trang (that su lam duoc)
     - Cancel                               -> tai lai trang (khoi phuc gia tri da chup,
                                               giong hanh vi huy thay doi)
     - Apply                                -> bao ro la ban gia lap, khong ghi cau hinh
     - Reboot / Factory Reset / Upgrade     -> bao ro; TUYET DOI khong gia lap "da khoi
                                               dong lai" de tranh day sai
     - Diagnosis (Ping/TraceRoute)          -> bao ro; khong bia ket qua chan doan
     - Download Log                         -> bao ro (thiet bi that tai file log ve may)
*/
(function () {
  function bao(tieuDe, noiDung) {
    alert(tieuDe + '\n\n' + noiDung + '\n\n(Ban gia lap giao dien - khong tac dong len thiet bi that)');
  }

  var LUAT = [
    [/refresh/i, function () { location.reload(); }],
    [/^Btn_cancel|_cancel_|^Btn_cancel$/i, function () { location.reload(); }],
    [/^Btn_restart$/i, function () {
      bao('Reboot', 'Tren thiet bi that: khoi dong lai thiet bi (mat mang vai phut).');
    }],
    [/^Btn_reset$/i, function () {
      bao('Factory Reset', 'Tren thiet bi that: xoa toan bo cau hinh, ve mac dinh xuat xuong.');
    }],
    [/^Btn_Upload$/i, function () {
      bao('Software Upgrade', 'Tren thiet bi that: nap firmware tu tep da chon va cai dat.');
    }],
    [/PingDiagnosis|TraceRouteDiagnosis/i, function (b) {
      bao('Diagnosis', 'Tren thiet bi that: chay lenh chan doan (Ping/TraceRoute) va in ket qua ben duoi.');
    }],
    [/^Btn_save_/i, function () {
      bao('Download Log', 'Tren thiet bi that: tai tep nhat ky ve may tinh.');
    }],
    [/apply/i, function () {
      bao('Apply', 'Ban gia lap: cau hinh khong duoc ghi vao thiet bi that.');
    }]
  ];

  function chay() {
    var nut = document.querySelectorAll('input[type=button], input[type=submit], button');
    for (var i = 0; i < nut.length; i++) {
      (function (b) {
        if (b.__act) return; b.__act = true;
        var id = b.id || '';
        // bo qua nut cua hop thoai an (confirm/security notice)
        if (/^(confirmOK|confirmCancel|confirmStop|sercurityNoticeOK)$/.test(id)) return;
        for (var k = 0; k < LUAT.length; k++) {
          if (LUAT[k][0].test(id)) {
            (function (fn) {
              b.addEventListener('click', function (e) { e.preventDefault(); fn(b); });
            })(LUAT[k][1]);
            return;
          }
        }
      })(nut[i]);
    }
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', chay);
  else chay();
})();
