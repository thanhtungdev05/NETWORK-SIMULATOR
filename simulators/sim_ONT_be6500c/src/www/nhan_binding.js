/* Cap nhat vung hien thi theo NHAN (khong theo chi so DOM).

   Bang noi sinh tu spec/nhan_binding.json, ma bang do lai TRICH TU MA GOC
   cua thiet bi (reference/source/assets_goc/index-De9Ihmse.js): moi muc
   ung voi dung mot loi goi {name:"<nhan>",value:<bieu thuc>} trong ma goc.
   Nho vay khong phai doan -- va cung khong con phu thuoc vao viec dem chi
   so con trong DOM (cach cu de vo khi ban chup doi).

   Cac ham dinh dang duoi day cai lai DUNG theo ma goc
   (format-CzzNSHpH.js va cac helper):
     S              -> gia tri rong in dau '−' (U+2212, KHONG phai '-')
     thoi_luong_giay-> '6h 15m 23s'
     phan_tram      -> lam tron toFixed(0) roi them '%'
   Vi sao phai the: Uptime / Memory / CPU thay doi lien tuc nen khong the
   doi chieu bang cach so gia tri hai lan chup; chi ma goc moi cho biet
   dung cong thuc. */
(function () {
  var DAU_TRONG = '−';   // U+2212 MINUS SIGN, dung nhu thiet bi that

  function tenTrang() {
    var n = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');
    if (n === 'index' || n === '') n = 'home__overview';
    return n.replace(/__t\d+$/, '');
  }

  function docSau(o, duong) {
    var cur = o, re = /([^.[\]]+)|\[(\d+)\]/g, m;
    while ((m = re.exec(duong))) {
      if (cur == null) return undefined;
      cur = m[2] !== undefined ? cur[Number(m[2])] : cur[m[1]];
    }
    return cur;
  }

  function S(v) {
    return (v === undefined || v === null || v === '') ? DAU_TRONG : String(v);
  }

  function thoiLuongGiay(giay) {
    if (typeof giay !== 'number') return DAU_TRONG;
    var s = Math.floor(giay % 60),
        p = Math.floor(giay / 60) % 60,
        h = Math.floor(giay / 3600) % 24,
        n = Math.floor(giay / 86400);
    var ra = [];
    if (n) ra.push(n + 'd');
    if (n || h) ra.push(h + 'h');
    ra.push(p + 'm');
    ra.push(s + 's');
    return ra.join(' ');
  }

  function phanTram(v) {
    return typeof v === 'number' ? String(Number(v.toFixed(0))) : '0';
  }

  function apDung(kieu, v) {
    if (kieu === 'thoi_luong_giay') return thoiLuongGiay(v);
    if (kieu === 'phan_tram') return phanTram(v);
    return S(v);
  }

  /* Tim text node chua GIA TRI ung voi nhan: node text bang dung <nhan>,
     roi lay text node ke tiep trong pham vi the cha cap tren. */
  function timONhan(nhan) {
    var tw = document.createTreeWalker(document.getElementById('root') || document.body,
      NodeFilter.SHOW_TEXT);
    var n;
    while ((n = tw.nextNode())) {
      if ((n.nodeValue || '').trim() !== nhan) continue;
      var khoi = n.parentNode && n.parentNode.parentNode;
      if (!khoi) continue;
      var tw2 = document.createTreeWalker(khoi, NodeFilter.SHOW_TEXT);
      var m, thay = false;
      while ((m = tw2.nextNode())) {
        if (m === n) { thay = true; continue; }
        if (thay && (m.nodeValue || '').trim()) return m;
      }
    }
    return null;
  }

  function chay() {
    var BANG = (window.__NHAN || {})[tenTrang()];
    if (!BANG) return;

    var can = {};
    Object.keys(BANG).forEach(function (nhan) { can[BANG[nhan].resource] = 1; });

    Promise.all(Object.keys(can).map(function (r) {
      return fetch('/api/v1/data/' + r)
        .then(function (x) { return x.ok ? x.json() : null; })
        .then(function (d) { return [r, d]; })
        .catch(function () { return [r, null]; });
    })).then(function (cap) {
      var kho = {};
      cap.forEach(function (c) { kho[c[0]] = c[1]; });

      var da = 0, bo = [];
      Object.keys(BANG).forEach(function (nhan) {
        var b = BANG[nhan];
        var node = timONhan(nhan);
        if (!node || kho[b.resource] == null) { bo.push(nhan); return; }
        node.nodeValue = apDung(b.dinh_dang, docSau(kho[b.resource], b.duong_dan));
        da++;
      });
      console.log('[nhan_binding] ' + tenTrang() + ': cap nhat ' + da + ' vung theo nhan'
        + (bo.length ? ', bo qua: ' + bo.join(', ') : ''));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', chay);
  else chay();
})();
