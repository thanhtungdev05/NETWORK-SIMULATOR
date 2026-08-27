/* Hai trang System >> Wi-Fi Timer va System >> Reboot Timer.

   HANH VI THAT (quan sat truc tiep tren thiet bi 2026-08-11): khi cong tac
   "Enable time switch ..." TAT thi phan chon gio va 7 ngay trong tuan
   KHONG TON TAI trong DOM -- React chi render chung khi cong tac bat. Bat
   cong tac -> hien ra o gio (va o gio ket thuc voi Wi-Fi Timer) + 7 o tick
   Mon..Sun, dong thoi thanh Save/cancel xuat hien vi form da co thay doi.

   Ban gia lap la HTML tinh nen hoan doi giua HAI ban markup THAT da chup
   san (window.__TIMER trong timer_data.js) -- cung cach da dung cho sidebar
   va cho khoi Save o trang Wi-Fi General. Nho vay DOM khop thiet bi that o
   ca hai trang thai, khong phai an/hien bang CSS.

   Anh xa truong (ten o = duong dan JSON, dung quy luat da xac nhan cua app):
     Wi-Fi Timer  -> ext/timer/wifi   : enabled, startTime, endTime,
                                        mon,tue,wed,thu,fri,sat,sun
     Reboot Timer -> ext/timer/reboot : enabled, time,
                                        mon,tue,wed,thu,fri,sat,sun
   Ca hai resource deu cho PATCH (spec/api_methods.json, trich tu ma goc). */
(function () {
  var CAU_HINH = {
    system__wifitimer: { resource: 'ext/timer/wifi', o_gio: ['startTime', 'endTime'] },
    system__reboottimer: { resource: 'ext/timer/reboot', o_gio: ['time'] }
  };
  var NGAY = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  function tenTrang() {
    var n = (location.pathname.split('/').pop() || '').replace('.html', '');
    return n.replace(/__t\d+$/, '');
  }

  var trang = tenTrang();
  var cfg = CAU_HINH[trang];
  if (!cfg) return;

  var duLieu = null;      // ban sao cau hinh trong kho
  var thanhSave = null;

  function $(n) { return document.querySelector('[name="' + n + '"]'); }

  /* batMongMuon: trang thai cong tac CAN GIU. Phai truyen vao vi sau khi
     nguoi dung bat cong tac, markup bi thay moi hoan toan -> neu lay lai
     'enabled' tu kho (van dang false) thi cong tac bi tat nguoc tro lai,
     va ban ghi luu xuong se sai. Da mac dung loi nay khi kiem thu. */
  function napGiaTri(batMongMuon) {
    if (!duLieu) return;
    cfg.o_gio.forEach(function (t) {
      var e = $(t);
      if (e && duLieu[t] !== undefined) e.value = duLieu[t];
    });
    NGAY.forEach(function (t) {
      var e = $(t);
      if (e && duLieu[t] !== undefined) e.checked = !!duLieu[t];
    });
    var ct = $('enabled');
    if (ct) ct.checked = (batMongMuon === undefined) ? !!duLieu.enabled : !!batMongMuon;
    if (window.__simSync) window.__simSync();
  }

  /* Thay than form bang ban markup THAT ung voi trang thai cong tac. */
  function datTrangThai(bat) {
    var form = document.querySelector('form');
    var kho = (window.__TIMER || {})[trang];
    if (!form || !kho) return;
    var moi = document.createElement('div');
    moi.innerHTML = bat ? kho.bat : kho.tat;
    var formMoi = moi.querySelector('form');
    if (!formMoi) return;
    form.parentNode.replaceChild(formMoi, form);
    napGiaTri(bat);
    gan();
  }

  function goThanhSave() {
    if (thanhSave && thanhSave.parentNode) thanhSave.parentNode.removeChild(thanhSave);
    thanhSave = null;
  }

  /* Thanh Save/cancel dung y markup that da chup o trang Wi-Fi General
     (reference/source/wifi_general_co_nut_save.html) -- cung mot component
     dung chung toan app. */
  function hienThanhSave() {
    if (thanhSave) return;
    var form = document.querySelector('form');
    if (!form) return;
    var w = document.createElement('div');
    w.className = 'MuiStack-root alternative-layout css-den97n';
    w.innerHTML =
      '<button class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorPrimary formActionButton submit alternative-layout alternative-layout--submit css-g28vy7" tabindex="0" type="button"><span class="MuiBox-root css-rrm59m">Save</span><span class="MuiTouchRipple-root css-w0pj6f"></span></button>' +
      '<button class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-colorPrimary formActionButton cancel alternative-layout css-1acoyi9" tabindex="0" type="button">cancel<span class="MuiTouchRipple-root css-w0pj6f"></span></button>';
    form.appendChild(w);
    thanhSave = w;
    w.querySelector('.submit').addEventListener('click', luu);
    w.querySelector('.cancel').addEventListener('click', function () {
      nap();                       // nap lai tu kho -> bo moi thay doi
    });
  }

  function luu() {
    var than = { enabled: !!($('enabled') || {}).checked };
    cfg.o_gio.forEach(function (t) { if ($(t)) than[t] = $(t).value; });
    NGAY.forEach(function (t) { if ($(t)) than[t] = !!$(t).checked; });
    fetch('/api/v1/data/' + cfg.resource, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(than)
    }).then(function (r) { return r.json(); }).then(function (kq) {
      duLieu = kq;
      goThanhSave();
      alert('Da luu vao config_store that.');
    }).catch(function (e) { alert('Loi khi luu: ' + e); });
  }

  function gan() {
    var form = document.querySelector('form');
    if (!form) return;
    var ct = $('enabled');
    if (ct && !ct.__daGan) {
      ct.__daGan = true;
      ct.addEventListener('change', function () {
        datTrangThai(ct.checked);      // doi markup y nhu React lam
        hienThanhSave();
      });
    }
    ['input', 'change'].forEach(function (loai) {
      if (form.__daGan) return;
      form.addEventListener(loai, function (e) {
        if (thanhSave && thanhSave.contains(e.target)) return;
        hienThanhSave();
      });
    });
    form.__daGan = true;
  }

  function nap() {
    fetch('/api/v1/data/' + cfg.resource)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d) return;
        duLieu = d;
        goThanhSave();
        datTrangThai(!!d.enabled);
        console.log('[timer_binding] ' + trang + ': nap tu kho, enabled=' + d.enabled);
      }).catch(function () {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', nap);
  else nap();
})();
