/* Khoi phuc dung hanh vi dong/mo cac muc cua LuCI.
   Luc crawl, Claude da tu bam mo MOI muc de chup du noi dung, nen ban chup
   giu trang thai "da mo". Thiet bi that thi: MUC DAU mo (▼), cac muc sau gap (▶).
   Script nay dat lai trang thai mac dinh do, va cho bam de dong/mo nhu that. */
(function () {
  /* Sua khoang trang thua giua cac muc.
     Nguyen nhan: #sidebarmenu la float:left (cao ~635px), ma CSS cua LuCI co
     .cbi-page-actions::after{clear:both} -> khoi Apply/Cancel bi keo gian xuong
     tan day sidebar (cao 438px thay vi 63px), day muc ke tiep xuong rat xa.
     Cho vung noi dung tu tao ngu canh khoi rieng thi float cua sidebar
     khong con anh huong. Do duoc: Apply 438px -> 63px, trang 954px -> 762px. */
  (function suaBoCuc() {
    var st = document.createElement('style');
    st.textContent = '#maincontent{display:flow-root}';
    (document.head || document.documentElement).appendChild(st);
  })();

  /* Nut hien/an mat khau cua LuCI:
     <input type="password"> + <button title="Reveal/hide password">∗</button>
     Ban chup tinh khong co JS nen bam khong phan hoi. Gan lai hanh vi that. */
  function ganHienMatKhau() {
    var nut = document.querySelectorAll(
      'button[title="Reveal/hide password"], button[aria-label="Reveal/hide password"]');
    for (var i = 0; i < nut.length; i++) {
      (function (b) {
        if (b.__wired) return; b.__wired = true;
        b.addEventListener('click', function (e) {
          e.preventDefault();
          // o nhap nam ngay truoc nut, trong cung .control-group
          var o = b.previousElementSibling;
          if (!o || o.tagName !== 'INPUT') {
            var g = b.closest('.control-group') || b.parentElement;
            o = g && g.querySelector('input');
          }
          if (!o) return;
          o.type = (o.type === 'password') ? 'text' : 'password';
        });
      })(nut[i]);
    }
    return nut.length;
  }

  /* Moi trang LuCI gom nhieu khoi <div id="view-container-...">.
     Quy luat cua thiet bi: CHI khoi view DAU TIEN duoc mo, cac khoi sau deu gap.
     (Truoc day dung "muc co mui ten dau tien" -> sai o trang LAN, vi khoi dau
      la 'Allocated Address' khong co mui ten, khien DHCP Server bi mo nham.) */
  function chiSoKhoi(h) {
    var c = h.closest('[id^=view-container]');
    if (!c) return 0;
    var ds = [].slice.call(document.querySelectorAll('[id^=view-container]'));
    return ds.indexOf(c);
  }

  function chay() {
    ganHienMatKhau();
    var hs = document.querySelectorAll('h3');
    for (var i = 0; i < hs.length; i++) {
      (function (h) {
        var mui = h.querySelector('.arrow');
        if (!mui) return;                       // khong phai tieu de gap duoc

        /* Noi dung cua muc. Cau truc that cua LuCI:
             <div view-container>
               <div class="cbi-map">
                 <h3>▶DHCP Server</h3>
                 <div class="cbi-map-descr">DHCP Form Configuration.</div>
                 <div class="cbi-section">...form...</div>
               </div>
               <div class="cbi-page-actions">Apply Cancel</div>   <- NGANG HANG voi map
             </div>
           Hai diem tung sai:
           1) Khoi Apply/Cancel khong phai em ke cua h3 -> duyet em ke bo sot,
              lam 2 nut lo lung ben ngoai muc dang gap.
           2) Thiet bi that khi gap VAN hien dong mo ta (.cbi-map-descr). */
        var noidung = [], e = h.nextElementSibling;
        while (e && e.tagName !== 'H3') {
          if (!e.classList.contains('cbi-map-descr')) noidung.push(e);
          e = e.nextElementSibling;
        }
        var map = h.parentElement;
        if (map && /\bcbi-map\b/.test(map.className || '')) {
          var s = map.nextElementSibling;
          while (s) {
            if (!s.querySelector('h3')) noidung.push(s);
            s = s.nextElementSibling;
          }
        }

        function dat(mo) {
          mui.textContent = mo ? '▼' : '▶';
          for (var k = 0; k < noidung.length; k++) noidung[k].style.display = mo ? '' : 'none';
        }

        h.style.cursor = 'pointer';
        h.addEventListener('click', function () {
          dat(mui.textContent.indexOf('▼') < 0);
        });

        dat(chiSoKhoi(h) === 0);   // chi khoi view dau tien duoc mo
      })(hs[i]);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', chay);
  else chay();
})();
