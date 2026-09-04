/* Khoi phuc dung hanh vi dong/mo cac muc cua LuCI.
   Luc crawl, Claude da tu bam mo MOI muc de chup du noi dung, nen ban chup
   giu trang thai "da mo". Thiet bi that thi: MUC DAU mo (▼), cac muc sau gap (▶).
   Script nay dat lai trang thai mac dinh do, va cho bam de dong/mo nhu that. */
(function () {
  function chay() {
    var hs = document.querySelectorAll('h3');
    var thu = 0;
    for (var i = 0; i < hs.length; i++) {
      (function (h) {
        var mui = h.querySelector('.arrow');
        if (!mui) return;                       // khong phai tieu de gap duoc

        // noi dung cua muc = cac phan tu ke tiep cho den tieu de ke tiep
        var noidung = [], e = h.nextElementSibling;
        while (e && e.tagName !== 'H3') { noidung.push(e); e = e.nextElementSibling; }

        function dat(mo) {
          mui.textContent = mo ? '▼' : '▶';
          for (var k = 0; k < noidung.length; k++) noidung[k].style.display = mo ? '' : 'none';
        }

        h.style.cursor = 'pointer';
        h.addEventListener('click', function () {
          dat(mui.textContent.indexOf('▼') < 0);
        });

        dat(thu === 0);      // muc dau tien: mo; cac muc sau: gap
        thu++;
      })(hs[i]);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', chay);
  else chay();
})();
