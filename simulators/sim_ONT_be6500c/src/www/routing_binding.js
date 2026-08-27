/* Bang Static Routing (Advanced >> Static Routing), 2 tab IPv4 / IPv6.

   CAI LAI THEO MA GOC: reference/source/assets_goc/index-DBx_Vnba.js.

     A = policies.filter(t => t.enabled && t.ipVersion === Number(tab.replace("ipv","")))
     [c, M] = t.target.split("/")          // vd "10.99.99.0/24" -> c="10.99.99.0", M="24"
     cot = ["Destination IP",
            tab===ipv4 ? "Mask" : "Prefix Length",
            "Gateway IP", "Interface"]
       Destination IP : c
       Mask/Prefix    : t.mask || M
       Gateway IP     : t.gateway
       Interface      : interfacesConfig.find(u => u.id === t.interfaceId)?.usage ?? "Internet"

   HAI DIEU DE BO SOT, deu doc duoc tu ma goc:
     1. Ban ghi co `enabled: false` KHONG hien tren bang (bi loc bo hoan
        toan, khong phai hien mo di nhu Port Forwarding).
     2. Bang loc theo `ipVersion` khop voi TAB dang chon -- route IPv6
        khong hien o tab IPv4 va nguoc lai.

   MAU DONG: chup tu thiet bi that sau khi anh Huynn tao 1 route thu
   (10.99.99.0/24) roi xoa di -- reference/source/routing_co_rule.html.
   Bang rong thi KHONG co <tbody> nao, giong Port Forwarding. */
(function () {
  function tenTrang() {
    var n = (location.pathname.split('/').pop() || '').replace('.html', '');
    return n.replace(/__t\d+$/, '');
  }
  if (tenTrang() !== 'advanced__routing') return;

  /* Tab dang chon -> phien ban IP can loc. Doc tu nut co aria-selected. */
  function phienBanIP() {
    var t = document.querySelector('[role="tab"][aria-selected="true"]');
    var chu = (t && t.textContent || 'IPv4').trim();
    return /6/.test(chu) ? 6 : 4;
  }

  function layTbody(tao) {
    var tb = document.querySelector('table tbody');
    if (tb || !tao) return tb;
    var bang = document.querySelector('table');
    if (!bang) return null;
    tb = document.createElement('tbody');
    tb.className = 'MuiTableBody-root css-1xnox0e';
    bang.appendChild(tb);
    return tb;
  }

  function dungHang(mau, t, tenGiaoDien) {
    var chia = String(t.target || '').split('/');
    var dich = chia[0], hauTo = chia[1];
    var d = document.createElement('tbody');
    d.innerHTML = mau;
    var tr = d.querySelector('tr');
    var o = tr.querySelectorAll('td');
    var cb = o[0] && o[0].querySelector('input[type="checkbox"]');
    if (cb) cb.checked = false;
    if (o[1]) o[1].textContent = dich;
    if (o[2]) o[2].textContent = t.mask || hauTo || '';
    if (o[3]) o[3].textContent = t.gateway || '';
    if (o[4]) o[4].textContent = tenGiaoDien(t.interfaceId);
    return tr;
  }

  function chay() {
    var mau = (window.__MAU_HANG || {}).routing;
    if (!mau) return;
    var ver = phienBanIP();

    Promise.all([
      fetch('/api/v1/data/staticRouting/policies').then(function (r) { return r.ok ? r.json() : null; }),
      fetch('/api/v1/data/interfaces/configurations').then(function (r) { return r.ok ? r.json() : []; })
    ]).then(function (kq) {
      var ds = kq[0], cfg = kq[1] || [];
      if (!Array.isArray(ds)) return;

      function tenGiaoDien(id) {
        var u = cfg.find(function (x) { return x.id === id; });
        return (u && u.usage) || 'Internet';
      }

      var loc = ds.filter(function (t) { return t.enabled && t.ipVersion === ver; });
      var tbody = layTbody(loc.length > 0);
      if (!loc.length) {
        if (tbody && tbody.parentNode) tbody.parentNode.removeChild(tbody);
        console.log('[routing_binding] IPv' + ver + ': khong co route -> khong render tbody');
        return;
      }
      tbody.innerHTML = '';
      loc.forEach(function (t) { tbody.appendChild(dungHang(mau, t, tenGiaoDien)); });
      console.log('[routing_binding] IPv' + ver + ': hien ' + loc.length + '/' + ds.length + ' route');
    }).catch(function () {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', chay);
  else chay();
})();
