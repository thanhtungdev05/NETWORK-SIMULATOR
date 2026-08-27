/* Gap/mo cac muc (collapsible bar) cho ban gia lap H6701Q V3.
   Ban chup tinh da bo JS goc nen cac thanh nhu "LAN Status", "Access
   Control-Rule Table" bam khong phan hoi. NOI DUNG cua muc dang gap VAN
   NAM TRONG HTML (container ke ben voi display:none) - chi can bat/tat.

   Co che that cua ZTE:
     <div class="area-title ... [collapsibleBarExp]" id="XxxBar[:N]"
          aria-expanded="true|false" aria-controls="Xxx_container">
     <div id="Xxx_container[:N]" style="[display:none]"> ...noi dung... </div>
   - class 'collapsibleBarExp' = dang MO (mui ten ▼, anh expand_B.png);
     khong co = dang GAP (▶, collapse_B.png).
   - Mot so bar co hau to instance ':0' (AccountManagBar:0 ->
     AccountManag_container:0); aria-controls doi khi KHONG kem hau to,
     nen thu id day du truoc, roi aria-controls, roi id khong hau to. */
(function () {
  /* Sua chieu cao hang bang. Thiet bi that: .colorTbl{line-height:30px} va
     cac bang ben trong THUA KE 30px -> hang cao 32px. Nhung <table> khong
     thua ke line-height (kiem chung: dat 30px len div cha, table van 'normal';
     dat thang len table moi an). Nen phai dat TRUC TIEP len bang de giong that
     (neu khong hang chi cao 18px, trong compact hon thiet bi). */
  (function fixTableLineHeight() {
    var st = document.createElement('style');
    /* line-height: bang khong thua ke tu .colorTbl (xem tren).
       text-align:left: <th> mac dinh cua trinh duyet la center; thiet bi that
       thua ke 'left' tu cha, nhung trong ban gia lap th khong thua ke -> hien
       center (khac that). Ep left cho khop. */
    st.textContent =
      '.horizonTable, .verticalTable{line-height:30px}' +
      '.horizonTable th, .horizonTable td, .verticalTable th, .verticalTable td{text-align:left}';
    (document.head || document.documentElement).appendChild(st);
  })();

  function timContainer(bar) {
    var id = bar.id || '';
    var m = id.match(/^(.*?)Bar(:\d+)?$/);
    var cands = [];
    if (m) {
      if (m[2]) cands.push(m[1] + '_container' + m[2]);
      cands.push(m[1] + '_container');
    }
    var ac = bar.getAttribute('aria-controls');
    if (ac) cands.splice(1, 0, ac);
    for (var i = 0; i < cands.length; i++) {
      var el = document.getElementById(cands[i]);
      if (el) return el;
    }
    // du phong: phan tu ke tiep khong phai bar
    var s = bar.nextElementSibling;
    if (s && !/area-title/.test(s.className || '')) return s;
    return null;
  }

  function gan(bar) {
    if (bar.__wired) return; bar.__wired = true;
    var cont = timContainer(bar);
    if (!cont) return;
    bar.style.cursor = 'pointer';
    bar.addEventListener('click', function () {
      var dangMo = bar.classList.contains('collapsibleBarExp');
      if (dangMo) {
        bar.classList.remove('collapsibleBarExp');
        bar.setAttribute('aria-expanded', 'false');
        cont.style.display = 'none';
      } else {
        bar.classList.add('collapsibleBarExp');
        bar.setAttribute('aria-expanded', 'true');
        cont.style.display = '';
      }
    });
  }

  /* Loai gap THU HAI: cac muc con instance (vd WPS 2.4GHz / 5GHz).
       <a id="instName_WPS:1" class="instName collapsibleInst [instNameExp]">5GHz</a>
       <div id="changeArea_WPS:1" ...>  <- noi dung (WPS Mode + Apply)
     Mo = co class 'instNameExp'; container = doi tien to instName_ -> changeArea_. */
  function ganInst(a) {
    if (a.__wired) return; a.__wired = true;
    var id = a.id || '';
    var cont = document.getElementById(id.replace(/^instName_/, 'changeArea_'));
    if (!cont) {
      var ac = a.getAttribute('aria-controls');
      if (ac) cont = document.getElementById(ac);
    }
    if (!cont) return;
    a.style.cursor = 'pointer';
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var mo = a.classList.contains('instNameExp');
      if (mo) {
        a.classList.remove('instNameExp');
        a.setAttribute('aria-expanded', 'false');
        cont.style.display = 'none';
      } else {
        a.classList.add('instNameExp');
        a.setAttribute('aria-expanded', 'true');
        cont.style.display = '';
      }
    });
  }

  function chay() {
    var bars = document.querySelectorAll('.area-title[id*="Bar"]');
    for (var i = 0; i < bars.length; i++) gan(bars[i]);
    var insts = document.querySelectorAll('a.collapsibleInst, .instName.collapsibleInst');
    for (var j = 0; j < insts.length; j++) ganInst(insts[j]);
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', chay);
  else chay();
})();
