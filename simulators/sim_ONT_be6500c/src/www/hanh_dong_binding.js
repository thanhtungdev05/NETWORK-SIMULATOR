/* Ba trang HANH DONG: Diagnostics, TCPDump, User.

   Khac moi trang truoc: nhung trang nay KHONG co API GET de nap gia tri --
   nguoi dung go tham so roi POST. Nen "muc 4" o day khong phai la dong bo
   gia tri, ma la: bam nut -> goi dung endpoint + dung hinh dang body nhu
   thiet bi that, va hien ket qua tra ve.

   ================== 1. Network >> Diagnostics ==================
   Ma goc: reference/source/assets_goc/index-CELcwv2c.js

     bo = {method:"PingIPv4", target:""}          // gia tri mac dinh
     vo = [PingIPv4 "IPv4 Ping", PingIPv6 "IPv6 Ping",
           TracerouteIPv4 "IPv4 Trace Route", TracerouteIPv6 "IPv6 Trace Route",
           DNSLookup "DNS Lookup"]
     Io = {PingIPv4:      {action:"Ping",       ipVersion:4},
           PingIPv6:      {action:"Ping",       ipVersion:6},
           TracerouteIPv4:{action:"Traceroute", ipVersion:4},
           TracerouteIPv6:{action:"Traceroute", ipVersion:6},
           DNSLookup:     {action:"DNS Lookup", ipVersion:4}}

     Khi bam: bo truong 'method' ra khoi form, gop them Io[method]:
        payload = {target, action, ipVersion}
        POST /api/v1/data/diagnostic  ->  {result:{status, output, error}}
     Hien ket qua theo ham Lo:
        status === "Failed" && error  ->  in error
        nguoc lai                     ->  in output
     Chua co ket qua thi hien fo = "No diagnostic results available for display."

   ================== 2. Advanced >> TCPDump ==================
   Ma goc: index-BEqiUdXP.js

     Start: POST /api/v1/data/tcpdump  body {...form, action:"Start"}
            -> tra {id}, dung lam testId
     Stop : POST /api/v1/data/tcpdump  body {action:"Stop", testId}
     Ma 409 khi bat dau = da co phien dang chay; 400 khi dung = file chua san sang.

   ================== 3. System >> User ==================
   Ma goc: index-Bh-Fu0xZ.js

     Hai o 'password' va 'confirmPassword' phai TRUNG NHAU
     ("Passwords do not match."), sau do:
        setPassword({payload:{id: <id cua user dang dang nhap>, ...}})
     Doi mat khau xong thi ma goc GOI signOut().

   *** BAN GIA LAP KHONG XU LY MAT KHAU THAT ***
   Trang User chi kiem tra hai o co trung nhau khong roi bao ket qua. Khong
   luu mat khau vao kho, khong gui di dau. Day la lua chon co chu dich:
   ban gia lap dung de day hoc, khong nen tao thoi quen go mat khau that
   vao mot he thong khong phai thiet bi that. */
(function () {
  var TEN = (location.pathname.split('/').pop() || '').replace('.html', '')
    .replace(/__t\d+$/, '');

  function $(n) { return document.querySelector('[name="' + n + '"]'); }

  /* Tim nut hanh dong theo chu tren nut (khong co id/class rieng). */
  function timNut() {
    var ds = [].slice.call(document.querySelectorAll('button'));
    var chu = Array.prototype.slice.call(arguments);
    for (var i = 0; i < ds.length; i++) {
      var t = (ds[i].textContent || '').trim().toLowerCase();
      for (var j = 0; j < chu.length; j++) {
        if (t.indexOf(chu[j].toLowerCase()) >= 0) return ds[i];
      }
    }
    return null;
  }

  /* Hien ket qua vao dung vung ket qua cua trang.

     VUNG KET QUA CHUA CHUP DUOC: ban chup goc cua trang Diagnostics lay luc
     chua chay lan nao nen KHONG co khoi hien ket qua trong DOM (ma goc chi
     render khoi do sau khi co du lieu tra ve, hoac hien cau
     "No diagnostic results available for display."). Vi khong co markup
     that, o day KHONG tu che khoi moi -- neu khong tim thay vung nao thi
     bao bang hop thoai. Khi nao chup duoc trang luc da chay diagnostic thi
     thay bang markup that. */
  function hienKetQua(chu) {
    var tw = document.createTreeWalker(document.getElementById('root') || document.body,
      NodeFilter.SHOW_TEXT), n;
    while ((n = tw.nextNode())) {
      if ((n.nodeValue || '').indexOf('No diagnostic results') >= 0) {
        n.nodeValue = chu;
        return true;
      }
    }
    var pre = document.querySelector('pre, code');
    if (pre) { pre.textContent = chu; return true; }
    alert(chu);
    return false;
  }

  /* ---------------------------- Diagnostics ---------------------------- */
  var THAM_SO = {
    PingIPv4: { action: 'Ping', ipVersion: 4 },
    PingIPv6: { action: 'Ping', ipVersion: 6 },
    TracerouteIPv4: { action: 'Traceroute', ipVersion: 4 },
    TracerouteIPv6: { action: 'Traceroute', ipVersion: 6 },
    DNSLookup: { action: 'DNS Lookup', ipVersion: 4 }
  };

  function noiDiagnostics() {
    var nut = timNut('start', 'run', 'diagnos');
    if (!nut) return;
    nut.addEventListener('click', function () {
      var method = ($('method') && $('method').value) || 'PingIPv4';
      var target = ($('target') && $('target').value) || '';
      var tsp = THAM_SO[method] || THAM_SO.PingIPv4;
      var body = { target: target, action: tsp.action, ipVersion: tsp.ipVersion };
      hienKetQua('Dang chay ' + tsp.action + ' toi ' + (target || '(chua nhap dich)') + '...');
      fetch('/api/v1/data/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).then(function (r) { return r.json().then(function (d) { return [r.status, d]; }); })
        .then(function (c) {
          var ma = c[0], d = c[1];
          if (ma >= 400) {
            hienKetQua('Ban gia lap chua co du lieu that cho endpoint '
              + '/api/v1/data/diagnostic (ma ' + ma + ').\n'
              + 'Da gui dung body nhu thiet bi that: ' + JSON.stringify(body));
            return;
          }
          var kq = d && d.result;
          hienKetQua(!kq ? JSON.stringify(d)
            : (kq.status === 'Failed' && kq.error ? kq.error : (kq.output || '')));
        }).catch(function (e) { hienKetQua('Loi: ' + e); });
    });
    console.log('[hanh_dong] Diagnostics: da noi nut chay');
  }

  /* ------------------------------ TCPDump ------------------------------ */
  function noiTcpdump() {
    var nut = timNut('start', 'capture');
    if (!nut) return;
    nut.addEventListener('click', function () {
      var body = { action: 'Start' };
      if ($('maxPacketsNumber')) body.maxPacketsNumber = Number($('maxPacketsNumber').value) || 0;
      var itf = document.querySelector('[name="radio"]:checked');
      if (itf) body.interfaceId = itf.value;
      fetch('/api/v1/data/tcpdump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).then(function (r) { return r.json().then(function (d) { return [r.status, d]; }); })
        .then(function (c) {
          alert(c[0] >= 400
            ? 'Ban gia lap chua co du lieu that cho /api/v1/data/tcpdump (ma ' + c[0] + ').\n'
              + 'Body da gui dung nhu thiet bi that: ' + JSON.stringify(body)
            : 'Da bat dau bat goi. Ma phien: ' + (c[1] && c[1].id));
        }).catch(function (e) { alert('Loi: ' + e); });
    });
    console.log('[hanh_dong] TCPDump: da noi nut bat dau');
  }

  /* -------------------------------- User -------------------------------- */
  /* Trang User KHONG co nut nao trong ban chup -- vi thanh Save chi hien khi
     form co thay doi, giong cac trang khac. Nen phai theo doi o nhap roi
     chen thanh Save that (markup lay tu
     reference/source/wifi_general_co_nut_save.html, component dung chung). */
  var thanhSaveUser = null;

  function hienThanhSaveUser(khiBam) {
    if (thanhSaveUser) return;
    var form = document.querySelector('form');
    if (!form) return;
    var w = document.createElement('div');
    w.className = 'MuiStack-root alternative-layout css-den97n';
    w.innerHTML =
      '<button class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorPrimary formActionButton submit alternative-layout alternative-layout--submit css-g28vy7" tabindex="0" type="button"><span class="MuiBox-root css-rrm59m">Save</span><span class="MuiTouchRipple-root css-w0pj6f"></span></button>' +
      '<button class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-colorPrimary formActionButton cancel alternative-layout css-1acoyi9" tabindex="0" type="button">cancel<span class="MuiTouchRipple-root css-w0pj6f"></span></button>';
    form.appendChild(w);
    thanhSaveUser = w;
    w.querySelector('.submit').addEventListener('click', khiBam);
    w.querySelector('.cancel').addEventListener('click', function () {
      if ($('password')) $('password').value = '';
      if ($('confirmPassword')) $('confirmPassword').value = '';
      goThanhSaveUser();
    });
  }

  function goThanhSaveUser() {
    if (thanhSaveUser && thanhSaveUser.parentNode) {
      thanhSaveUser.parentNode.removeChild(thanhSaveUser);
    }
    thanhSaveUser = null;
  }

  function noiUser() {
    var form = document.querySelector('form');
    if (!form) return;
    ['input', 'change'].forEach(function (loai) {
      form.addEventListener(loai, function (e) {
        if (thanhSaveUser && thanhSaveUser.contains(e.target)) return;
        hienThanhSaveUser(xuLyDoiMatKhau);
      });
    });
    console.log('[hanh_dong] User: theo doi o nhap de hien thanh Save');
  }

  function xuLyDoiMatKhau() {
    (function () {
      var a = $('password'), b = $('confirmPassword');
      if (!a || !b) return;
      if (!a.value) { alert('Mat khau khong duoc de trong.'); return; }
      if (a.value !== b.value) { alert('Passwords do not match.'); return; }
      alert('Ban gia lap KHONG xu ly mat khau that.\n\n'
        + 'Tren thiet bi that, buoc nay se doi mat khau dang nhap roi TU DONG '
        + 'dang xuat (ma goc goi signOut sau khi doi thanh cong).\n\n'
        + 'Hai o da khop nhau, nen tren thiet bi that thao tac nay se thanh cong.');
      a.value = ''; b.value = '';
      goThanhSaveUser();
      if (window.__simSync) window.__simSync();
    })();
  }

  function chay() {
    if (TEN === 'network__diagnostics') noiDiagnostics();
    else if (TEN === 'advanced__tcpdump') noiTcpdump();
    else if (TEN === 'system__user') noiUser();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', chay);
  else chay();
})();
