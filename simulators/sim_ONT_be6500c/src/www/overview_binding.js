/* Khoi thong tin ket noi (Internet / LAN) tren trang Overview.

   CAI LAI DUNG THUAT TOAN GOC, doc tu
   reference/source/assets_goc/index-De9Ihmse.js. Nguyen van logic goc
   (da dat ten bien cho de doc):

     m = {device:"",phyType:"",isConnected:false,macAddress:"",connectionType:"",
          ipv4Address:"",ipv4Gateway:"",dnsServers:[],ipv6ConnectionType:"",
          ipv6ConnectionState:"",ipv6Addresses:[],ponStatus:{}}
     n.forEach(C => {                       // n = cac interface cung nhom
       m.isConnected ||= C.status === "Up"
       m.macAddress  ||= C.macAddress
       m.device      ||= head(C.device)
       O = head(C.ipv4Addresses)
       if (!isEmpty(O)) { m.connectionType = O.protocol
                          m.ipv4Address    = O.address
                          m.ipv4Gateway    = O.gateway }
       C.ipv6Addresses.forEach(H => { if (H.type === "GUA") {
           m.ipv6ConnectionType ||= H.protocol
           m.ipv6Addresses.push(H.address.toLowerCase()) } })
       C.dnsServers.forEach(H => m.dnsServers.push(H))
     })
     P = ethernetPorts.find(C => m.device === C.name)
     if (P) { m.phyType="Ethernet"; m.linkRate=P.bitRate; m.port=P.port
              m.ulBytes=P.stats.bytesSent; m.dlBytes=P.stats.bytesReceived }
     neu chua co connectionType   -> lay tu interfaces/configurations .ipv4Settings.protocol
     neu chua co ipv6ConnectionType -> lay tu .ipv6Settings.protocol
     neu ipv6ConnectionType === "dhcpv6" -> ipv6ConnectionState =
         slaacEnabled ? "(Stateless)" : "(Stateful)"

   Ham dinh dang (format-CzzNSHpH.js): S -> gia tri rong in '−' (U+2212);
   Q -> dung luong co so 1024 (Bytes/KB/MB/GB/TB/PB); ke -> toc do co so
   1000 (bps/Kbps/Mbps/...).

   PON: thiet bi nay khong co giao dien PON (khong interface nao co device
   chua "pon") nen nhanh do KHONG duoc cai lai -- de tranh bia. Neu sau nay
   gap thiet bi co PON thi doc lai bang Xr trong ma goc:
   O1 Initial / O2 Standby / O3 Serial number / O4 Rating state /
   O5 Operation state / O6 POPUP state / O7 Emergency stop. */
(function () {
  var TRONG = '−';                       // U+2212
  var DV_BYTE = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  var DV_BIT = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps', 'Pbps'];

  function S(v) {
    return (v === undefined || v === null || v === '') ? TRONG : String(v);
  }
  function _fmt(v, dv, co_so) {
    if (typeof v !== 'number' || v < 0) return TRONG;
    if (v === 0) return dv === DV_BYTE ? '0 Byte' : '0 bps';
    var i = Math.floor(Math.log(v) / Math.log(co_so));
    i = Math.max(0, Math.min(i, dv.length - 1));
    var n = Number((v / Math.pow(co_so, i)).toFixed(2));
    return n + ' ' + dv[i];
  }
  var Q = function (v) { return _fmt(v, DV_BYTE, 1024); };   // dung luong
  var ke = function (v) { return _fmt(v, DV_BIT, 1000); };   // toc do

  function dau(a) { return (a && a.length) ? a[0] : undefined; }

  /* Ma goc hien thi giao thuc qua ham dich i18n: S(d(u.ipv6ConnectionType)).
     Chi co DUY NHAT 1 cap da xac nhan bang bang chung that:
       'dhcpv6' -> 'DHCPv6'   (thiet bi that hien "DHCPv6(Stateless)" trong
       khi interfaces/configurations[wan6].ipv6Settings.protocol = "dhcpv6"
       va slaacEnabled = true).
     Cac giao thuc khac (pppoe, static, dhcp, slaac...) CHUA co bang chung
     ve chuoi hien thi -> khong doan, giu nguyen gia tri tho. */
  var DICH = { dhcpv6: 'DHCPv6' };
  function dich(v) { return DICH[v] || v; }

  /* Tinh object 'u' y het ma goc, cho mot nhom interface. */
  function tinhU(nhom, ethernetPorts, cauHinh) {
    var m = {
      device: '', phyType: '', isConnected: false, macAddress: '',
      connectionType: '', ipv4Address: '', ipv4Gateway: '', dnsServers: [],
      ipv6ConnectionType: '', ipv6ConnectionState: '', ipv6Addresses: []
    };
    nhom.forEach(function (C) {
      if (!m.isConnected) m.isConnected = C.status === 'Up';
      if (!m.macAddress) m.macAddress = C.macAddress || '';
      if (!m.device) m.device = dau(C.device) || '';
      var O = dau(C.ipv4Addresses);
      if (O && Object.keys(O).length) {
        m.connectionType = O.protocol;
        m.ipv4Address = O.address;
        m.ipv4Gateway = O.gateway;
      }
      (C.ipv6Addresses || []).forEach(function (H) {
        if (H.type === 'GUA') {
          if (!m.ipv6ConnectionType) m.ipv6ConnectionType = H.protocol;
          m.ipv6Addresses.push(String(H.address).toLowerCase());
        }
      });
      (C.dnsServers || []).forEach(function (H) { m.dnsServers.push(H); });
    });

    var P = (ethernetPorts || []).find(function (C) { return m.device === C.name; });
    if (P) {
      m.phyType = 'Ethernet';
      m.linkRate = P.bitRate;
      m.port = P.port;
      m.ulBytes = P.stats && P.stats.bytesSent;
      m.dlBytes = P.stats && P.stats.bytesReceived;
    }
    (cauHinh || []).forEach(function (C) {
      if (!m.connectionType && C.ipv4Settings) m.connectionType = C.ipv4Settings.protocol;
      if (!m.ipv6ConnectionType && C.ipv6Settings) m.ipv6ConnectionType = C.ipv6Settings.protocol;
    });
    if (m.ipv6ConnectionType === 'dhcpv6') {
      (cauHinh || []).forEach(function (C) {
        if (C.ipv6Settings) {
          m.ipv6ConnectionState = C.ipv6Settings.slaacEnabled ? '(Stateless)' : '(Stateful)';
        }
      });
    }
    return m;
  }

  /* Ghi gia tri vao o dung sau nhan, trong pham vi mot khoi. */
  function datTheoNhan(goc, nhan, gt) {
    var tw = document.createTreeWalker(goc, NodeFilter.SHOW_TEXT), n;
    while ((n = tw.nextNode())) {
      if ((n.nodeValue || '').trim() !== nhan) continue;
      var khoi = n.parentNode && n.parentNode.parentNode;
      if (!khoi) continue;
      var tw2 = document.createTreeWalker(khoi, NodeFilter.SHOW_TEXT), m, thay = false;
      while ((m = tw2.nextNode())) {
        if (m === n) { thay = true; continue; }
        if (thay && (m.nodeValue || '').trim()) { m.nodeValue = gt; return true; }
      }
    }
    return false;
  }

  /* Moi file HTML chi render DUY NHAT mot tab co noi dung (MUI lazy-mount,
     giong trang Wi-Fi General). Phai bam dung tab dang hien, neu khong khoi
     LAN se ghi de len khoi WAN vi hai khoi dung CHUNG bo nhan. */
  function khoiDangHien() {
    var ds = [].slice.call(document.querySelectorAll('[role="tabpanel"]'));
    for (var i = 0; i < ds.length; i++) {
      var p = ds[i];
      if (!p.hasAttribute('hidden') && p.innerHTML.trim().length > 0) {
        var m = /^tabpanel-(.+)$/.exec(p.id || '');
        return { el: p, ten: m ? m[1] : '' };
      }
    }
    return null;
  }

  function chay() {
    var k = khoiDangHien();
    if (!k) return;
    // 'wan' -> nhom interface usage="Internet"; 'lan' -> usage="LAN"
    // (bang chung: spec/seed_api.json, truong 'usage' cua tung interface)
    var usage = k.ten === 'wan' ? 'Internet' : (k.ten === 'lan' ? 'LAN' : null);
    if (!usage) return;

    Promise.all(['interfaces', 'ethernetPorts', 'interfaces/configurations'].map(function (r) {
      return fetch('/api/v1/data/' + r).then(function (x) { return x.ok ? x.json() : null; })
        .catch(function () { return null; });
    })).then(function (kq) {
      var ifs = kq[0], eth = kq[1], cfg = kq[2];
      if (!ifs) return;

      var nhom = ifs.filter(function (i) { return i.usage === usage; });
      /* Ma goc nhan tham so 's' la cau hinh CUA CHINH NHOM DANG XET, khong
         phai toan bo. Neu lay toan bo thi vong forEach se de gia tri cua
         interface cuoi cung thang -- da kiem chung: lay toan bo cho ra
         "DHCPv6(Stateful)" (theo cfg 'guest'), trong khi thiet bi that hien
         "DHCPv6(Stateless)" (theo cfg 'wan6'). Loc theo id cua nhom moi dung. */
      var idNhom = {};
      nhom.forEach(function (i) { idNhom[i.id] = 1; });
      var cfgNhom = (cfg || []).filter(function (c) { return idNhom[c.id]; });

      var u = tinhU(nhom, eth, cfgNhom);
      var da = 0;
      [
        ['Connection Status', u.isConnected ? 'UP' : 'DOWN'],
        ['Physical Type', S(u.phyType)],
        ['MAC Address', S(u.macAddress ? u.macAddress.toUpperCase() : '')],
        ['IP Address', S(u.ipv4Address)],
        ['Gateway Address', S(u.ipv4Gateway)],
        ['DNS', u.dnsServers.length ? u.dnsServers.join(', ') : TRONG],
        ['Connection Type', S(dich(u.connectionType))],
        ['IPv6 Connection Type', S(dich(u.ipv6ConnectionType)) + u.ipv6ConnectionState],
        ['IPv6 Address', u.ipv6Addresses.length ? u.ipv6Addresses.join(', ') : TRONG],
        ['Port', S(u.port)],
        ['Link Rate', u.linkRate === undefined ? TRONG : ke(u.linkRate)],
        ['DL Bytes', Q(u.dlBytes)],
        ['UL Bytes', Q(u.ulBytes)]
      ].forEach(function (x) { if (datTheoNhan(k.el, x[0], x[1])) da++; });
      console.log('[overview_binding] tab ' + k.ten + ' (' + usage + '): cap nhat ' + da + ' o');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', chay);
  else chay();
})();
