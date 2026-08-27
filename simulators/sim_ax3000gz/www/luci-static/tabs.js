/* Chuyen tab TRONG TRANG cua LuCI (khac tab dieu huong sang trang con).
   Vd trang Routing: 2 tab "Static IPv4 Routes" / "Static IPv6 Routes" trong
   cung mot form.Map (m.tabbed=true).

   Co che that: pane la <div data-tab-title="..." data-tab="X">; mac dinh bi an
   boi quy tac [data-tab-title]{height:0;opacity:0}. Pane co data-tab-active
   moi hien. Ban chup tinh da bo script chuyen tab nen bam tab khac khong ra gi.

   BAY (mat nhieu cong moi tim ra): dat data-tab-active hay style inline (ca
   !important) DEU khong keo opacity len 1 mot cach on dinh - co mot quy tac an
   [data-tab-title] o sheet long nhau/khong doc duoc bang matches(), va
   transition:opacity lam gia tri do duoc dao dong. Cach CHAC CHAN: GO han
   thuoc tinh data-tab-title khoi pane dang xem -> khong con khop quy tac an ->
   hien binh thuong (opacity 1, height auto mac dinh). Luu title vao data-tt de
   khoi phuc khi an lai. Kem tat transition cho khoi nhap nhay. */
(function () {
  function themStyle() {
    if (document.getElementById('sim-tab-style')) return;
    var st = document.createElement('style');
    st.id = 'sim-tab-style';
    // tat transition tren pane tab cho doi trang thai tuc thi, khong nhap nhay
    st.textContent = '.cbi-section[data-tab]{transition:none !important}';
    (document.head || document.documentElement).appendChild(st);
  }

  function chay() {
    themStyle();
    var menus = document.querySelectorAll('ul.cbi-tabmenu');
    for (var i = 0; i < menus.length; i++) wire(menus[i]);
  }

  function wire(ul) {
    var goc = ul.parentNode;                 // cbi-map: chua ca ul lan cac pane
    // luu title goc cua tung pane de con khoi phuc
    var panes = goc.querySelectorAll('[data-tab-title][data-tab]');
    for (var k = 0; k < panes.length; k++) {
      if (panes[k].closest('ul.cbi-tabmenu')) continue;
      panes[k].setAttribute('data-tt', panes[k].getAttribute('data-tab-title'));
    }
    var lis = ul.querySelectorAll('li[data-tab]');
    var mac = null;
    for (var i = 0; i < lis.length; i++) {
      (function (li) {
        var a = li.querySelector('a') || li;
        a.addEventListener('click', function (e) {
          e.preventDefault();
          chon(ul, goc, li.getAttribute('data-tab'));
        });
      })(lis[i]);
      if (lis[i].className === 'cbi-tab' && mac === null)
        mac = lis[i].getAttribute('data-tab');
    }
    if (mac === null && lis.length) mac = lis[0].getAttribute('data-tab');
    if (mac !== null) chon(ul, goc, mac);     // dat trang thai ban dau
  }

  function chon(ul, goc, tab) {
    var lis = ul.querySelectorAll('li[data-tab]');
    for (var i = 0; i < lis.length; i++) {
      lis[i].className = (lis[i].getAttribute('data-tab') === tab)
        ? 'cbi-tab' : 'cbi-tab-disabled';
    }
    var panes = goc.querySelectorAll('[data-tt][data-tab]');
    for (var j = 0; j < panes.length; j++) {
      if (panes[j].closest('ul.cbi-tabmenu')) continue;
      if (panes[j].getAttribute('data-tab') === tab) {
        // HIEN: go data-tab-title de thoat quy tac an
        panes[j].removeAttribute('data-tab-title');
        panes[j].setAttribute('data-tab-active', 'true');
      } else {
        // AN: khoi phuc data-tab-title
        panes[j].setAttribute('data-tab-title', panes[j].getAttribute('data-tt'));
        panes[j].removeAttribute('data-tab-active');
      }
    }
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', chay);
  else chay();
})();
