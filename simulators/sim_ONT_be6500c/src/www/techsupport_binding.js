/* Trang System >> Tech Support Info.

   CAI LAI THEO MA GOC: reference/source/assets_goc/index-DrfuHisf.js.
   Luong day du doc duoc tu do:

     1. Bam nut  -> POST /api/v1/data/ext/logpull   (khong kem body)
                    bao "Tech support info collection started successfully."
     2. Bat dau hoi lai moi 2000 ms: GET /api/v1/data/ext/logpull
     3. Doc {status, logFile}:
          status === 0 && logFile.trim() !== ''  -> XONG (state 2), luu ten file
          status === 2001, hoac status === 0 && logFile rong -> DANG CHAY (state 1)
          status === 2002 -> LOI "The log file collection failed"
          khac            -> LOI "Unknown status received"
     4. Bam tai ve -> bao "Tech support info is ready for downloading." roi
          <a href="oui-download?sid=<sid>&path=/www/<logFile>"
             download="tech-support-info.en"> .click()
        (sid lay tu sessionStorage.getItem("sid"))
        Neu chua co logFile -> loi "No log file available."

   TEN FILE THAT (reference/source/logpull_sau_khi_chay.json, chup tu thiet
   bi sau khi anh Huynn bam thu):
     logcollection-04D6888D525F_FPTT25C0CADD_20260811_141735.en
     = logcollection-<serialNumber>_<ma rieng>_<YYYYMMDD>_<HHMMSS>.en
   Server gia lap dung dung mau nay (config_store._logpull_hien_tai), lay
   serialNumber that tu system/info. Phan <ma rieng> giu nguyen tu bang
   chung vi chua ro y nghia.

   KHONG TAI FILE THAT: ban gia lap khong co goi log nao de tai. Bam nut tai
   se bao ro dieu do kem duong dan ma thiet bi that dung -- vua trung thuc
   vua co gia tri day hoc. */
(function () {
  var TEN = (location.pathname.split('/').pop() || '').replace('.html', '')
    .replace(/__t\d+$/, '');
  if (TEN !== 'system__techsupportinfo') return;

  var CHU_KY = 2000;          // refreshInterval trong ma goc
  var dangHoi = null;
  var tenFile = '';

  function bao(chu) {
    var tw = document.createTreeWalker(document.getElementById('root') || document.body,
      NodeFilter.SHOW_TEXT), n;
    while ((n = tw.nextNode())) {
      if (/collection|download|log file/i.test(n.nodeValue || '')) {
        n.nodeValue = chu;
        return true;
      }
    }
    console.log('[techsupport] ' + chu);
    return false;
  }

  function nut(/* cac tu khoa */) {
    var ds = [].slice.call(document.querySelectorAll('button'));
    var tu = Array.prototype.slice.call(arguments);
    for (var i = 0; i < ds.length; i++) {
      var t = (ds[i].textContent || '').trim().toLowerCase();
      for (var j = 0; j < tu.length; j++) {
        if (t.indexOf(tu[j]) >= 0) return ds[i];
      }
    }
    return null;
  }

  function dungHoi() {
    if (dangHoi) { clearInterval(dangHoi); dangHoi = null; }
  }

  function hoiTrangThai() {
    fetch('/api/v1/data/ext/logpull')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d) return;
        var st = d.status, f = (d.logFile || '').trim();
        if (st === 0 && f.length > 0) {
          tenFile = f;
          dungHoi();
          bao('Da thu thap xong. Tep: ' + f);
        } else if (st === 2001 || (st === 0 && f.length === 0)) {
          bao('Dang thu thap thong tin ho tro ky thuat...');
        } else if (st === 2002) {
          dungHoi();
          bao('The log file collection failed');
        } else {
          dungHoi();
          bao('Unknown status received');
        }
      }).catch(function () {});
  }

  function batDau() {
    tenFile = '';
    bao('Dang bat dau thu thap...');
    fetch('/api/v1/data/ext/logpull', { method: 'POST' })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        bao('Tech support info collection started successfully.');
        dungHoi();
        setTimeout(function () { dangHoi = setInterval(hoiTrangThai, CHU_KY); }, 500);
      })
      .catch(function () { bao('Failed to start tech support info collection.'); });
  }

  function taiVe() {
    if (!tenFile) { alert('No log file available.'); return; }
    var sid = sessionStorage.getItem('sid') || '';
    alert('Tech support info is ready for downloading.\n\n'
      + 'Tren thiet bi that, trinh duyet se tai tep nay ve:\n'
      + '  oui-download?sid=' + sid + '&path=/www/' + tenFile + '\n'
      + '  (luu voi ten tech-support-info.en)\n\n'
      + 'Ban gia lap khong co goi log that de tai.');
  }

  function chay() {
    var nBatDau = nut('collect', 'start', 'generate', 'thu thap');
    var nTai = nut('download', 'tai ve');
    if (nBatDau) nBatDau.addEventListener('click', batDau);
    if (nTai) nTai.addEventListener('click', taiVe);
    console.log('[techsupport] nut bat dau: ' + !!nBatDau + ', nut tai: ' + !!nTai);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', chay);
  else chay();
})();
