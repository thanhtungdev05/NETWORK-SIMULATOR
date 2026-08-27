/* Bang Reserved IP -- tab thu hai cua Advanced >> LAN.

   CAI LAI THEO MA GOC: reference/source/assets_goc/index-BMd6WMkR.js.

     i = new Map(devices.map(d => [d.macAddress, d.hostname]))
     cot B = ["Device", "Reserved IP", "Added By"]
     moi dong tu dhcp/reservedHosts:
       Device      : hai dong -- <p> hostname = i.get(d.macAddress),
                     <span> chinh d.macAddress
       Reserved IP : d.ipAddress
       Added By    : d.isAutoReserved ? "Auto" : "Manual"

   LUU Y: ten thiet bi tra cuu theo **macAddress** (khong phai ipAddress
   nhu bang Port Forwarding). Neu khong tim thay hostname thi o <p> de
   TRONG -- dung nhu ban chup that (thiet bi cua anh Huynn co hostname
   rong nen chi hien MAC).

   MAU DONG: chup tu thiet bi that sau khi anh Huynn tao 1 ban ghi thu
   (MAC d8:43:ae:2e:65:45 -> 192.168.1.150) roi xoa di, xem
   reference/source/reserved_co_rule.html.

   Trang nay la tab __t1 cua advanced__lan; tab __t0 la General Settings. */
(function () {
  function tenTep() {
    return (location.pathname.split('/').pop() || '').replace('.html', '');
  }
  if (tenTep() !== 'advanced__lan__t1') return;

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

  function dungHang(mau, r, tenTheoMac) {
    var d = document.createElement('tbody');
    d.innerHTML = mau;
    var tr = d.querySelector('tr');
    var o = tr.querySelectorAll('td');
    var cb = o[0] && o[0].querySelector('input[type="checkbox"]');
    if (cb) cb.checked = false;
    if (o[1]) {
      var p = o[1].querySelector('p'), sp = o[1].querySelector('span');
      if (p) p.textContent = tenTheoMac(r.macAddress) || '';
      if (sp) sp.textContent = r.macAddress || '';
    }
    if (o[2]) o[2].textContent = r.ipAddress || '';
    if (o[3]) o[3].textContent = r.isAutoReserved ? 'Auto' : 'Manual';
    return tr;
  }

  function chay() {
    var mau = (window.__MAU_HANG || {}).reserved;
    if (!mau) return;

    Promise.all([
      fetch('/api/v1/data/dhcp/reservedHosts').then(function (r) { return r.ok ? r.json() : null; }),
      fetch('/api/v1/data/devices').then(function (r) { return r.ok ? r.json() : []; })
    ]).then(function (kq) {
      var ds = kq[0], thietBi = kq[1] || [];
      if (!Array.isArray(ds)) return;

      var theoMac = {};
      thietBi.forEach(function (d) { if (d.macAddress) theoMac[d.macAddress] = d.hostname; });
      function tenTheoMac(mac) { return theoMac[mac]; }

      var tbody = layTbody(ds.length > 0);
      if (!ds.length) {
        if (tbody && tbody.parentNode) tbody.parentNode.removeChild(tbody);
        console.log('[reserved_binding] kho rong -> khong render tbody');
        return;
      }
      tbody.innerHTML = '';
      ds.forEach(function (r) { tbody.appendChild(dungHang(mau, r, tenTheoMac)); });
      console.log('[reserved_binding] hien ' + ds.length + ' ban ghi');
    }).catch(function () {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', chay);
  else chay();
})();
