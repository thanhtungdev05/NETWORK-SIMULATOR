/* GD5 -- KHUNG GIAO DIEN DIEN THOAI cua ONT-BE6500C.

   Chi lam viec tren cac trang m_* (window.__LA_DIEN_THOAI === true).

   ================== DIEU DA DO, KHONG SUY DOAN ==================
   Diem gay: 900px. Doc tu ma goc index-CW0UhNxy.js, component khung n8():
       o = el(n.breakpoints.down("md"))        // md = max-width 899.95px
       !o && jsx(<thanh ben>)                  // may tinh
        o && jsx(<Drawer anchor="top" ...>)    // dien thoai
   Hang so trong cung bundle: thanh tren dien thoai cao 64px (Ef), thanh
   tren may tinh 56px (KA), thanh ben rong 52px (Xu).
   Xac nhan cheo: tieu de trang (vd "WAN Settings") chi render khi
   down("md") -- va no CHI xuat hien trong ban chup m_*, khong co trong
   ban may tinh.

   Ngan keo la Drawer KIEU MODAL (khong phai docked), neo tren
   (anchor="top"), cao 100% man hinh. Markup that nam trong
   ngan_keo_data.js (chup tu thiet bi, file mobile_ngan_keo_MO.html).

   CANH BAO ve ten file bang chung: 'mobile_ngan_keo.html' KHONG phai
   ngan keo menu -- do la mot .MuiDrawer-docked cua NOI DUNG trang
   Overview (the "Gateway"). Trang m_home__overview.html co toi 3 the
   .MuiDrawer-docked kieu do; dung nham chung voi ngan keo menu.

   ========================= CON DE NGO =========================
   Ngan keo moi chup duoc o trang thai nhom "Home" dang mo. Cac nhom
   khac (Wi-Fi / Network / Security / System / Advanced) chua co ban
   chup trang thai mo -- xem ISSUES.md. Tam thoi mo ngan keo o trang
   nao cung hien dung markup da chup do. */
(function () {
  'use strict';

  if (!window.__LA_DIEN_THOAI) return;

  var TIEN_TO = 'm_';

  function tenTep() {
    var n = (location.pathname.split('/').pop() || '').replace('.html', '');
    /* GD5: bo tien to 'm_' cua ban DIEN THOAI truoc khi nhan dien trang.
       Neu khong, module nay se khong nhan ra 'm_<route>' va thoat ngay ->
       moi trang dien thoai mat sach phan noi du lieu. Loi da bat duoc
       2026-08-14 khi kiem ban dien thoai cua trang LAN. */
    if (n.indexOf('m_') === 0) n = n.slice(2);
    return n;
  }
  /* tenTep() o tren DA bo tien to roi -- day chi la ten goi cho de doc. */
  function tenRoute() { return tenTep(); }

  function co(ten) {
    return (window.__PAGES || []).indexOf(ten) >= 0;
  }

  /* Di toi mot route, GIU NGUYEN ban dien thoai va giu tham so ?dt= */
  function di(ten) {
    if (!ten) return;
    var dsDT = window.__PAGES_DT || [];
    var f = ten;
    if (dsDT.indexOf(f) < 0) f = f.replace(/__t\d+$/, '');
    if (dsDT.indexOf(f) < 0) return;
    var q = (new URLSearchParams(location.search)).get('dt');
    var ts = (q === '0' || q === '1') ? ('?dt=' + q) : '';
    location.href = '/' + TIEN_TO + f + '.html' + ts;
  }

  /* -------------------------------------------------- nut hamburger */

  function nutHamburger() {
    var ic = document.querySelector('[data-testid="MenuIcon"]');
    return ic ? ic.closest('button') : null;
  }

  function noiHamburger() {
    var nut = nutHamburger();
    if (!nut || nut.__simDaNoiNganKeo) return;
    nut.__simDaNoiNganKeo = true;
    nut.style.cursor = 'pointer';
    nut.addEventListener('click', function (e) {
      e.stopPropagation();
      var h = window.__moNganKeo && window.__moNganKeo();
      if (h) noiMucMenu(h);
    });
  }

  /* ------------------------------------------- cac muc trong ngan keo */

  /* Nhan hien tren muc -> ten trang. Dung CHUNG bang __MAP/__GROUP da
     sinh tu localStorage menu-store THAT (xem dung_trang.py). */
  function tenTrangTheoNhan(nhan) {
    var m = window.__MAP || {}, g = window.__GROUP || {};
    if (m[nhan]) return m[nhan];
    if (g[nhan]) return g[nhan];
    return null;
  }

  function noiMucMenu(h) {
    var goc = h.goc;
    goc.querySelectorAll('.MuiListItemButton-root').forEach(function (muc) {
      var nhan = (muc.textContent || '').trim();
      muc.style.cursor = 'pointer';
      muc.addEventListener('click', function () {
        // Reboot dung hop thoai xac nhan THAT (dialog_data.js), giong
        // ban may tinh -- khong tu che alert().
        if (nhan === 'Reboot') {
          h.dong();
          var hp = window.__moHopThoai && window.__moHopThoai('reboot_confirm');
          if (hp && hp.oTiepTuc) {
            hp.oTiepTuc.addEventListener('click', function () { hp.dong(); });
          }
          return;
        }
        if (nhan === 'Log out') { h.dong(); location.href = '/login.html'; return; }
        var ten = tenTrangTheoNhan(nhan);
        if (!ten) return;              // nhan nhom chua co trang -> bo qua
        if (!co(ten)) return;
        h.dong();
        di(ten);
      });
    });
  }

  /* ------------------------------------------------ khung may dien thoai
     CHI khi EP che do dien thoai (?dt=1) tren cua so RONG.

     Vi sao can: markup dien thoai ma ve o be ngang 1536px thi cac the dan
     ngang ra -- mot trang thai KHONG BAO GIO co tren thiet bi that.

     Vi sao phai dung IFRAME chu khong chi bo hep #root: ma goc dat be
     ngang bang don vi 'vw' (be ngang KHUNG NHIN), vd component Zme:
     [n.down("md")]:{marginLeft:0,width:"100vw",...}. Bo hep the cha khong
     lam doi 'vw' -- da thu, noi dung tran ra ngoai khung. Chi khi dat
     trong iframe rong 502px thi khung nhin MOI THAT SU hep 502px, luc do
     ca 'vw' lan media query deu chay dung y nhu tren may dien thoai.

     KHONG ap dung khi cua so that su hep (<=900px): luc do trinh duyet da
     o dung be ngang roi.

     Tham so 'khung=0' danh dau "dang o ben trong iframe roi, dung boc nua". */
  var BE_NGANG_DA_CHUP = 502;   // khung nhin luc chup bang chung: 502x731
  var CAO_DA_CHUP = 731;

  function canBocKhung() {
    var p = new URLSearchParams(location.search);
    return p.get('dt') === '1' && p.get('khung') !== '0'
      && window.innerWidth > 900 && window.self === window.top;
  }

  function bocKhungIframe() {
    var u = new URL(location.href);
    u.searchParams.set('khung', '0');
    var src = u.pathname + u.search + u.hash;
    document.documentElement.innerHTML =
      '<head><meta charset="UTF-8"><title>Actiontec</title>'
      + '<style>html,body{height:100%;margin:0;background:#3a3f44;'
      + 'display:flex;align-items:center;justify-content:center;'
      + 'font:13px Inter,system-ui,sans-serif;color:#cfd3d7}'
      + '.sim-vo{display:flex;flex-direction:column;align-items:center;gap:8px}'
      + '.sim-nhan{opacity:.75}'
      + 'iframe{width:' + BE_NGANG_DA_CHUP + 'px;height:' + CAO_DA_CHUP + 'px;'
      + 'border:0;border-radius:14px;background:#fff;'
      + 'box-shadow:0 0 0 8px #23272b,0 10px 40px rgba(0,0,0,.6)}'
      + '</style></head><body><div class="sim-vo">'
      + '<iframe src="' + src.replace(/"/g, '&quot;') + '"></iframe>'
      + '<div class="sim-nhan">Che do xem dien thoai (ep bang ?dt=1) &mdash; khung nhin '
      + BE_NGANG_DA_CHUP + '&times;' + CAO_DA_CHUP + ', dung be ngang da chup bang chung. '
      + 'Bo &quot;?dt=1&quot; de ve ban may tinh.</div>'
      + '</div></body>';
  }

  /* ------------------------- ngan keo cua cac THE o Home > Overview -------
     Bang chung: reference/source/do_ngan_keo_the_home_dien_thoai.json
     (do truc tiep tren thiet bi that 2026-08-14 bang mot iframe rong 420px
     cung origin -- xem muc _cach_do_thanh_cong trong file do).

     Ba the Gateway / Internet / Devices moi cai co mot .MuiDrawer-docked
     anh em. Bam mui ten (ExpandMoreIcon) thi ngan keo truot tu phai vao
     phu kin man hinh; bam mui ten quay lai (ArrowBackIcon) o dau ngan keo
     thi truot ra. Ban chup GD1 chi bat duoc trang thai DONG nen truoc day
     bam khong co gi xay ra.

     Bon trang thai style noi tuyen, chep nguyen van tu phep do:
       dong nghi : transform: translateX(Wpx); visibility: hidden;
       mo        : transform: none; transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
       dang dong : transform: translateX(Wpx); transition: transform 300ms cubic-bezier(0.4, 0, 0.6, 1);
       da dong   : transform: translateX(Wpx); visibility: hidden;
     W = be rong giay. KHONG hardcode: doc lai tu chinh style dang co (ban
     chup dung 502px vi khung nhin luc chup la 502px, thiet bi that luc do
     la 417px). */

  var THOI_GIAN_TRUOT = 300;

  function beRongGiay(giay) {
    var m = /translateX\((-?[\d.]+)px\)/.exec(giay.getAttribute('style') || '');
    if (m) return m[1];
    return String(giay.offsetWidth || window.innerWidth);
  }

  function moNganKeoThe(giay) {
    giay.__W = beRongGiay(giay);
    clearTimeout(giay.__hen);
    giay.setAttribute('style',
      'transform: none; transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);');
  }

  function dongNganKeoThe(giay) {
    var W = giay.__W || beRongGiay(giay);
    clearTimeout(giay.__hen);
    giay.setAttribute('style',
      'transform: translateX(' + W + 'px); '
      + 'transition: transform 300ms cubic-bezier(0.4, 0, 0.6, 1);');
    /* Chi an han sau khi truot xong -- an ngay thi mat hieu ung (dung nhu
       thiet bi that: luc 'dang dong' KHONG co visibility:hidden). */
    giay.__hen = setTimeout(function () {
      giay.setAttribute('style',
        'transform: translateX(' + W + 'px); visibility: hidden;');
    }, THOI_GIAN_TRUOT);
  }

  function dangMo(giay) {
    return (giay.getAttribute('style') || '').indexOf('transform: none') >= 0;
  }

  function noiNganKeoThe() {
    document.querySelectorAll('.MuiDrawer-docked').forEach(function (dr) {
      var giay = dr.querySelector('.MuiDrawer-paper');
      if (!giay || dr.__daNoi) return;

      /* The chu = phan tu anh em dung TRUOC ngan keo trong cung khoi. Nut mo
         la IconButton chua ExpandMoreIcon; nut dong la IconButton chua
         ArrowBackIcon nam BEN TRONG ngan keo. */
      var nutDong = giay.querySelector('svg[data-testid="ArrowBackIcon"]');
      nutDong = nutDong && nutDong.closest('button');

      var goc = dr.parentElement;
      var nutMo = null;
      while (goc && !nutMo) {
        var ds = goc.querySelectorAll('svg[data-testid="ExpandMoreIcon"]');
        for (var i = 0; i < ds.length; i++) {
          var b = ds[i].closest('button');
          if (b && !b.__noiNganKeo && !giay.contains(b)) { nutMo = b; break; }
        }
        if (!nutMo) goc = goc.parentElement;
        if (goc === document.body) break;
      }
      if (!nutMo) return;

      dr.__daNoi = true;
      nutMo.__noiNganKeo = true;
      nutMo.style.cursor = 'pointer';
      nutMo.addEventListener('click', function () {
        if (dangMo(giay)) dongNganKeoThe(giay); else moNganKeoThe(giay);
      });
      if (nutDong) {
        nutDong.style.cursor = 'pointer';
        nutDong.addEventListener('click', function () { dongNganKeoThe(giay); });
      }
    });
  }

  /* --------------------------------------------------------- khoi dong */

  function batDau() {
    if (canBocKhung()) { bocKhungIframe(); return; }
    noiHamburger();
    noiNganKeoThe();
    console.log('[khung_dien_thoai] ban dien thoai: ' + tenRoute()
      + (nutHamburger() ? ' | da noi nut menu' : ' | KHONG THAY nut menu')
      + ' | ngan keo the: ' + document.querySelectorAll('.MuiDrawer-docked').length);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', batDau);
  } else {
    batDau();
  }
})();
