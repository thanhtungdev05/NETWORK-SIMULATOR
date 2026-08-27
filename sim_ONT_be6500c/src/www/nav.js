/* Dieu huong cho ban gia lap BE6500C.
   Giao dien that dung React (khong co the <a href>), nen o day tu gan su kien:
   - Muc menu ben trai -> mo trang tuong ung
   - Tab trong trang   -> mo bien the da chup (<trang>__t<N>.html)
   Nhan dien theo chu hien tren muc menu / thu tu tab. */
(function () {
  var MAP = window.__MAP || {};
  var GROUP = window.__GROUP || {};
  var PAGES = window.__PAGES || [];

  function txt(el) { return (el.textContent || '').replace(/\s+/g, ' ').trim(); }
  function go(file) { location.href = '/' + file + '.html'; }
  function has(file) { return PAGES.indexOf(file) >= 0; }

  // ten trang hien tai, bo hau to __tN
  function baseName() {
    var n = (location.pathname.split('/').pop() || '').replace('.html', '');
    return n.replace(/__t\d+$/, '');
  }

  /* ---------- 1. Menu ben trai ---------- */
  function menuItems() {
    var sb = document.querySelector('.css-1nmx4e2');
    if (!sb) return [];
    var out = [];
    var all = sb.querySelectorAll('div,li,span,p');
    for (var i = 0; i < all.length; i++) {
      var e = all[i], t = txt(e);
      if (!t || t.length > 24) continue;
      var kid = e.querySelector('div,li,span,p');
      if (kid && txt(kid) === t) continue;
      out.push({ el: e, text: t, hasIcon: !!e.querySelector('svg') });
    }
    return out;
  }

  function wireMenu() {
    var n = 0;
    menuItems().forEach(function (it) {
      var t = it.text, target = null;
      if (t === 'Advanced') target = it.hasIcon ? GROUP['Advanced'] : 'wifi__advanced';
      else if (MAP[t]) target = MAP[t];
      else if (GROUP[t]) target = GROUP[t];
      else if (t === 'Reboot' || t === 'Log out') {
        it.el.style.cursor = 'pointer';
        it.el.addEventListener('click', function (e) {
          e.stopPropagation();
          alert(t === 'Reboot'
            ? 'Reboot: ban gia lap khong khoi dong lai thiet bi that.'
            : 'Log out: ban gia lap khong co phien dang nhap.');
        });
        return;
      }
      if (!target) return;
      it.el.style.cursor = 'pointer';
      it.el.addEventListener('click', function (e) { e.stopPropagation(); go(target); });
      n++;
    });
    return n;
  }

  /* ---------- 2b. Sidebar mo/thu theo RE CHUOT ----------
     Do truc tiep tren thiet bi that 2026-08-10 (qua Chrome, xem
     src/dung_lai_sidebar.py). Co che that:
       - Mac dinh THU GON (52px, chi icon, khong nhan chu, khong submenu).
       - React gan onMouseEnter/onMouseLeave len CHINH .css-1hiau50
         (da doc duoc tu __reactProps$ cua phan tu do).
       - mouseenter -> them class "isExpand" (CSS san co:
         .css-1hiau50{width:52px}, .css-1hiau50.isExpand{width:160px})
         VA render them nhan chu + submenu cua nhom dang active.
       - mouseleave -> bo class, go bo nhan chu + submenu.
       - Nut hamburger [data-testid="MenuIcon"] co display:none tren
         desktop -> KHONG PHAI nut thu gon sidebar (la nut cho giao dien
         mobile). Ban truoc gan click thu gon vao nut nay -- HANH VI BIA,
         da bo hoan toan cung voi localStorage luu trang thai (thiet bi
         that khong luu trang thai nao ca).

     Ban gia lap la HTML tinh, khong render lai duoc nhu React, nen hoan
     doi giua HAI ban markup THAT da chup san (window.__SB_GON /
     window.__SB_MO trong sidebar_data.js) -> DOM khop thiet bi that o ca
     hai trang thai, khong phai an/hien bang CSS. */
  function tenTrang() {
    return (location.pathname.split('/').pop() || 'index.html')
      .replace('.html', '');
  }

  function khoaSidebar() {
    var t = tenTrang();
    if (t === 'index' || t === '') t = 'home__overview';
    var goc = t.replace(/__t\d+$/, '');
    var nhom = goc === 'help' ? 'help' : goc.split('__')[0];
    return { mo: goc, gon: nhom };
  }

  function wireSidebarHover() {
    var GON = window.__SB_GON || {}, MO = window.__SB_MO || {};
    var k = khoaSidebar();
    if (!GON[k.gon] || !MO[k.mo]) {
      console.warn('[nav] thieu markup sidebar cho', k);
      return;
    }
    var oNgoai = document.querySelector('.css-1nmx4e2');
    if (!oNgoai) return;

    function datTrangThai(dangMo) {
      oNgoai.innerHTML = dangMo ? MO[k.mo] : GON[k.gon];
      wireMenu();   // gan lai click cho markup vua thay
    }

    /* LOI DA MAC (anh Huynn phat hien 2026-08-11): truoc day gan
       mouseenter/mouseleave len chinh `.css-1hiau50` -- ma phan tu do bi
       THAY MOI mỗi lan doi trang thai. Khi mouseenter chay, innerHTML bi
       ghi de, phan tu cu bi go, phan tu MOI duoc chen ngay DUOI con tro.
       Trinh duyet khong coi la chuot "da vao" phan tu moi nen KHONG BAO GIO
       ban mouseleave -> sidebar mo ra roi khong bao gio thu lai.

       Cach dung: gan len phan tu CHA `.css-1nmx4e2` -- cha khong bi thay,
       nen chuoi mouseenter/mouseleave luon lien mach. */
    oNgoai.addEventListener('mouseenter', function () { datTrangThai(true); });
    oNgoai.addEventListener('mouseleave', function () { datTrangThai(false); });

    datTrangThai(false);   // thiet bi that: mac dinh thu gon
  }

  /* ---------- 2. Tab trong trang ---------- */
  function wireTabs() {
    var base = baseName();
    var tabs = document.querySelectorAll('[role="tab"]');
    var n = 0;
    for (var i = 0; i < tabs.length; i++) {
      (function (idx, el) {
        var variant = base + '__t' + idx;
        var target = has(variant) ? variant : (idx === 0 && has(base) ? base : null);
        el.style.cursor = 'pointer';
        el.addEventListener('click', function (e) {
          e.stopPropagation();
          if (target) go(target);
          else alert('Tab "' + txt(el) + '" chua duoc chup tu thiet bi that.');
        });
        if (target) n++;
      })(i, tabs[i]);
    }
    return n;
  }

  function init() {
    wireSidebarHover();   // tu goi wireMenu() sau moi lan doi markup
    var t = wireTabs();
    console.log('[nav] sidebar: hover mo/thu, tab: ' + t + ' the');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
