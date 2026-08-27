/* Trang Security >> Firewall -- phan HANH VI TUONG TAC.

   Phan NAP/GHI du lieu van do api_binding.js lo (bang noi trong
   binding_data.js, 24 truong). File nay CHI them nhung quy tac lien dong
   giua cac o ma bang noi khong dien ta duoc -- giong cach lan_binding.js
   / wan_binding.js lam voi trang cua no.

   ============ NGUON: DOC TAY MA GOC (2026-08-18) ============
   File: reference/source/assets_goc/index-eel5T8aZ.js (chunk cua chinh
   trang nay -- la file DUY NHAT trong assets_goc chua chuoi "Enable All").
   Trich nguyen van cac doan quyet dinh:

   1) Ham lan truyen cua "Enable All" -- ten nen la `z`:
        z=m.useCallback(r=>{
          o("dosDefense.tcpFlood.enabled",r,{shouldDirty:!0}),
          o("dosDefense.udpFlood.enabled",r,{shouldDirty:!0}),
          o("dosDefense.icmpFlood.enabled",r,{shouldDirty:!0}),
          o("dosDefense.portScan.enabled",r,{shouldDirty:!0}),
          o("dosDefense.tcpFlagScan.enabled",r,{shouldDirty:!0}),
          o("dosDefense.land.enabled",r,{shouldDirty:!0}),
          o("dosDefense.smurf.enabled",r,{shouldDirty:!0}),
          o("dosDefense.pingOfDeath.enabled",r,{shouldDirty:!0}),
          o("dosDefense.traceRoute.enabled",r,{shouldDirty:!0}),
          o("dosDefense.icmpFragment.enabled",r,{shouldDirty:!0}),
          o("dosDefense.synFragment.enabled",r,{shouldDirty:!0}),
          o("dosDefense.fraggleAttack.enabled",r,{shouldDirty:!0}),
          o("dosDefense.unknownProtocol.enabled",r,{shouldDirty:!0})
        },[o]);
      => DUNG 13 truong, va CHI truong '.enabled'. KHONG dung toi rate/burst.
      Day chinh la cau hoi con treo trong ISSUES.md tu 2026-08-14 ("chi
      enabled, hay ca rate/burst mac dinh?") -- nay da co dap an dut khoat.

   2) Trinh xu ly su kien cua o tick:
        Qe=m.useCallback(r=>{const{checked:F}=r.target;W(F),z(F)},[z]);
      => W = dat trang thai cua CHINH o tick; z = lan truyen xuong 13 o con.

   3) Chieu NGUOC LAI (13 o con -> o tick):
        Y = y&&v&&P&&C&&Me&&Ye&&_e&&qe&&Ve&&He&&Ge&&$e&&Je
        m.useEffect(()=>{W(Y)},[Y]);
      => o tick = phep AND cua ca 13. Bo tick 1 o con thi "Enable All" tu
      bo tick; tick du 13 thi no tu tick lai.

   4) SPI tat thi DoS Defense tat theo:
        m.useEffect(()=>{O||o("dosDefense.enabled",!1,{shouldDirty:!0})},[O,o])
      va cong tac DoS Defense mang `disabled:!O`  (O = watch("spiEnabled")).

   5) Khoi cac o con CHI hien khi DoS Defense bat:  `R&&e.jsxs(bt,...)`
      (R = watch("dosDefense.enabled")).

   6) Tat 1 trong 4 cong tac co o so -> XOA RONG rate/burst cua chinh no
      (4 useEffect giong het nhau, vi du nhanh tcpFlood):
        m.useEffect(()=>{y||(o("dosDefense.tcpFlood.rate","",{shouldDirty:!0}),
          o("dosDefense.tcpFlood.burst","",{shouldDirty:!0}),
          d("dosDefense.tcpFlood.rate"),d("dosDefense.tcpFlood.burst"))},[y,o,d])
      (d = clearErrors -- ban gia lap khong co tang validate rieng nen chi
      can phan xoa gia tri.)

   ============ DA XAC NHAN TREN THIET BI THAT (2026-08-18) ============
   Mo 192.168.1.1 bang Chrome (chan san moi request ghi, KHONG bam Save),
   doc trang Security>>Firewall:
     - 13 cong tac: SYN Flood/ICMP Flood/TCP Flag Scan/Unknown Protocol
       BAT, 9 cai con lai TAT  -> "Enable All" KHONG tick.
       Dung quy tac (3): AND cua 13 = false.
     - o so: tcpFlood 25/50 va icmpFlood 100/100 (cong tac bat, o mo);
       udpFlood va portScan RONG va BI KHOA (cong tac tat).
       Dung quy tac (6) va `disabled:!y`.
     - API tra udpFlood.rate=0 nhung o hien RONG -> dung `||""` cua mac goc.
   Phien JWT het han truoc khi kip bam thu "Enable All" tren may that (loi
   van hanh da biet, xem ISSUES.md). Khong sao: muc (1) va (2) o tren la
   ma nguon doc nguyen van, khong phai suy dien -- khong con cho de doan.

   ============ GHI CHU KY THUAT ============
   O tick "Enable All" KHONG co thuoc tinh name (no la Checkbox thuan,
   khong phai truong cua form) -> phai tim theo CHU tren nhan. Viec ve lai
   giao dien (doi lop Mui-checked + doi icon CheckBoxIcon <-> CheckBox
   OutlineBlankIcon) DUNG LAI window.__simSync() cua interact.js, khong
   tu ve -- nguyen tac 2.6. */
(function () {
  'use strict';

  function tenTep() {
    var n = (location.pathname.split('/').pop() || '').replace('.html', '');
    if (n.indexOf('m_') === 0) n = n.slice(2);
    return n;
  }
  if (tenTep() !== 'security__firewall') return;

  // 13 truong .enabled ma "Enable All" lan truyen toi -- DUNG THU TU trong
  // ham z() cua ma goc, khong sap xep lai.
  var CON = [
    'dosDefense.tcpFlood.enabled',
    'dosDefense.udpFlood.enabled',
    'dosDefense.icmpFlood.enabled',
    'dosDefense.portScan.enabled',
    'dosDefense.tcpFlagScan.enabled',
    'dosDefense.land.enabled',
    'dosDefense.smurf.enabled',
    'dosDefense.pingOfDeath.enabled',
    'dosDefense.traceRoute.enabled',
    'dosDefense.icmpFragment.enabled',
    'dosDefense.synFragment.enabled',
    'dosDefense.fraggleAttack.enabled',
    'dosDefense.unknownProtocol.enabled'
  ];

  // 4 nhom co o so rate/burst di kem (quy tac 6).
  var NHOM_CO_O_SO = ['tcpFlood', 'udpFlood', 'icmpFlood', 'portScan'];

  function o(ten) {
    return document.querySelector('[name="' + CSS.escape(ten) + '"]');
  }

  /* O tick "Enable All": khong co name -> tim theo chu tren nhan. */
  function oEnableAll() {
    var ls = document.querySelectorAll('label.MuiFormControlLabel-root');
    for (var i = 0; i < ls.length; i++) {
      var nhan = ls[i].querySelector('.MuiFormControlLabel-label');
      if (nhan && nhan.textContent.trim() === 'Enable All') {
        return ls[i].querySelector('input[type="checkbox"]');
      }
    }
    return null;
  }

  function dongBoGiaoDien() {
    if (window.__simSync) window.__simSync();
  }

  /* --- quy tac (3): o tick = AND cua 13 o con --- */
  function tinhLaiEnableAll() {
    var ea = oEnableAll();
    if (!ea) return;
    var tatCa = true;
    for (var i = 0; i < CON.length; i++) {
      var el = o(CON[i]);
      if (!el || !el.checked) { tatCa = false; break; }
    }
    ea.checked = tatCa;
  }

  /* --- quy tac (1)+(2): lan truyen xuong 13 o con --- */
  function lanTruyen(bat) {
    CON.forEach(function (ten) {
      var el = o(ten);
      if (el) el.checked = bat;
    });
  }

  /* --- quy tac (6): tat cong tac -> xoa rong rate/burst cua chinh no --- */
  function xoaOSoCuaNhomDangTat() {
    NHOM_CO_O_SO.forEach(function (n) {
      var ct = o('dosDefense.' + n + '.enabled');
      if (!ct || ct.checked) return;
      ['rate', 'burst'].forEach(function (hau) {
        var el = o('dosDefense.' + n + '.' + hau);
        if (el) el.value = '';
      });
    });
  }

  /* --- quy tac (4): SPI tat -> DoS Defense tat + bi khoa --- */
  function apDungSpi() {
    var spi = o('spiEnabled');
    var dos = o('dosDefense.enabled');
    if (!spi || !dos) return;
    dos.disabled = !spi.checked;
    if (!spi.checked && dos.checked) dos.checked = false;
  }

  /* --- quy tac (5): khoi o con chi hien khi DoS Defense bat ---
     Khoi con la phan tu CHA chung gan nhat cua o tick "Enable All".
     Tren thiet bi that React KHONG render khoi nay khi tat; ban gia lap
     la HTML tinh nen an bang display:none -- cung ket qua thi giac. */
  function khoiOCon() {
    var ea = oEnableAll();
    if (!ea) return null;
    var nhan = ea.closest('label.MuiFormControlLabel-root');
    return nhan ? nhan.parentElement : null;
  }

  function apDungAnHien() {
    var dos = o('dosDefense.enabled');
    var khoi = khoiOCon();
    if (khoi && dos) khoi.style.display = dos.checked ? '' : 'none';
  }

  /* Chay lai TOAN BO quy tac lien dong. Goi sau moi thay doi. */
  function apDungMoiQuyTac() {
    apDungSpi();
    xoaOSoCuaNhomDangTat();
    tinhLaiEnableAll();
    apDungAnHien();
  }

  function noiSuKien() {
    var goc = document.getElementById('root');
    if (!goc || goc.__fwDaNoi) return;
    goc.__fwDaNoi = true;

    /* Bat o giai doan BAT (capture) de chay TRUOC trinh xu ly chung cua
       interact.js/api_binding.js -- can dat xong trang thai 13 o con roi
       api_binding moi doc de dung gia tri vao than PATCH. */
    goc.addEventListener('click', function (e) {
      var ea = oEnableAll();
      if (ea && (e.target === ea || (e.target.closest &&
          e.target.closest('label.MuiFormControlLabel-root') ===
          ea.closest('label.MuiFormControlLabel-root')))) {
        /* Trinh duyet se tu lat trang thai o tick sau su kien nay, nen
           gia tri sap co la NGUOC voi hien tai. Lan truyen theo gia tri
           sap co -- dung nhu ma goc doc r.target.checked SAU khi lat. */
        lanTruyen(!ea.checked);
      }
    }, true);

    ['click', 'change', 'input'].forEach(function (loai) {
      goc.addEventListener(loai, function () {
        // Doi cho trinh duyet lat xong trang thai o vua bam.
        setTimeout(function () {
          apDungMoiQuyTac();
          dongBoGiaoDien();
        }, 0);
      });
    });
  }

  function batDau() {
    /* api_binding.js nap du lieu BAT DONG BO. Chay lai quy tac vai lan
       trong giay dau de bat duoc thoi diem no nap xong -- re hon la sua
       api_binding de phat tin hieu, va khong dung toi module chung. */
    noiSuKien();
    [0, 150, 400, 800, 1500].forEach(function (ms) {
      setTimeout(function () {
        apDungMoiQuyTac();
        dongBoGiaoDien();
      }, ms);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', batDau);
  } else {
    batDau();
  }
})();
