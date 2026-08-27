/* Lam song lai cac dieu khien MUI trong ban gia lap tinh.
   Trang that chay React; ban chup lai chi co HTML nen moi thu "chet".
   Script nay xu ly CHUNG cho MOI trang:
     - Switch / Checkbox / Radio : dong bo lop Mui-checked
     - Accordion                 : dong / mo
     - Nut con mat mat khau      : hien / an mat khau
     - Select (MUI)              : mo danh sach chon neu da chup duoc options
*/
(function () {

  /* ---------- 1. Switch / Checkbox / Radio ---------- */
  /* Dong bo LAI TOAN BO tu trang thai that cua input.
     Khong dao trang thai, nen du su kien co ban 2 lan (input + label chuyen tiep)
     thi ket qua van dung. */
  function syncAll() {
    document.querySelectorAll('.PrivateSwitchBase-root').forEach(function (base) {
      var inp = base.querySelector('input');
      if (!inp) return;
      if (inp.checked) {
        base.classList.add('Mui-checked');
        inp.setAttribute('value', 'true');
      } else {
        // ban chup goc co the chua 'Mui-checked' lap nhieu lan -> xoa het
        while (base.classList.contains('Mui-checked')) base.classList.remove('Mui-checked');
        inp.setAttribute('value', 'false');
      }
    });
  }
  /* Cong tac "Enable" TAT -> moi truong ben duoi mo di va khong bam duoc
     (giong het thiet bi that). Nut Enable la phan tu dau tien trong khoi,
     cac truong can khoa la cac phan tu dung sau no. */
  /* Dung DUNG class 'Mui-disabled' cua MUI, khong tu che do mo.
     CSS that cua thiet bi quy dinh:
       .MuiInputBase-input.Mui-disabled  -> chu VAN DAM rgba(0,0,0,.87)
       .css-xxx.Mui-disabled .MuiOutlinedInput-notchedOutline -> vien nhat .38
       .MuiFormControlLabel-label.Mui-disabled -> nhan xam .38
     Nho vay ket qua giong het thiet bi that. */
  var DIS = [
    '.MuiInputBase-root',        // -> lam nhat vien o
    '.MuiInputBase-input',       // -> giu chu dam
    '.MuiInputLabel-root',       // -> nhan noi tren vien o
    '.MuiFormLabel-root',
    '.MuiFormControlLabel-label',
    '.MuiFormHelperText-root',
    '.MuiSelect-select',
    '.MuiSelect-icon',
    '.MuiCheckbox-root',
    '.PrivateSwitchBase-root',
    '.MuiIconButton-root'
  ].join(', ');

  function applyEnableSections() {
    document.querySelectorAll('.PrivateSwitchBase-root input').forEach(function (inp) {
      var lbl = inp.closest('.MuiFormControlLabel-root');
      if (!lbl) return;
      if ((lbl.textContent || '').trim() !== 'Enable') return;

      var scope = lbl.closest('.MuiAccordionDetails-root') || lbl.parentElement;
      if (!scope) return;
      var off = !inp.checked;

      scope.querySelectorAll(DIS).forEach(function (el) {
        // khong dong den chinh nut Enable
        if (el === lbl || el.contains(lbl) || lbl.contains(el)) return;
        if (off) el.classList.add('Mui-disabled');
        else el.classList.remove('Mui-disabled');
      });

      // khoa nhap lieu that su
      scope.querySelectorAll('input, textarea, select').forEach(function (f) {
        if (f === inp) return;
        f.disabled = off;
      });
    });
  }

  /* Chi bo sung 2 quy tac MUI thieu trong ban CSS tai ve
     (do luc chup khong co phan tu nao dang o trang thai disabled). */
  (function injectCss() {
    var st = document.createElement('style');
    st.textContent =
      '.MuiFormHelperText-root.Mui-disabled{color:rgba(0,0,0,.38)}' +
      '.MuiSelect-select.Mui-disabled,.MuiSelect-icon.Mui-disabled{color:rgba(0,0,0,.38);cursor:default}';
    document.head.appendChild(st);
  })();

  window.__simSync = syncAll;

  // chay SAU khi trinh duyet xu ly xong hanh vi mac dinh cua label
  function later() { setTimeout(function () { syncAll(); applyEnableSections(); }, 0); }
  document.addEventListener('click', later, false);
  document.addEventListener('change', later, false);

  /* ---------- 2. Accordion dong/mo ---------- */
  function wireAccordions() {
    document.querySelectorAll('.MuiAccordionSummary-root').forEach(function (sum) {
      if (sum.__wired) return; sum.__wired = true;
      sum.style.cursor = 'pointer';
      sum.addEventListener('click', function () {
        var acc = sum.closest('.MuiAccordion-root') || sum.parentElement;
        if (!acc) return;
        var col = acc.querySelector('.MuiCollapse-root');
        var open = sum.className.indexOf('Mui-expanded') >= 0;
        if (open) {
          sum.className = sum.className.replace(/\s*Mui-expanded/g, '');
          if (col) { col.style.height = '0px'; col.style.overflow = 'hidden'; col.style.visibility = 'hidden'; }
        } else {
          sum.className += ' Mui-expanded';
          if (col) { col.style.height = 'auto'; col.style.overflow = 'visible'; col.style.visibility = 'visible'; }
        }
        var ic = sum.querySelector('.MuiAccordionSummary-expandIconWrapper');
        if (ic) ic.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
      });
    });
  }

  /* ---------- 3. Nut hien/an mat khau ---------- */
  function wireEyes() {
    document.querySelectorAll('svg[data-testid="VisibilityIcon"], svg[data-testid="VisibilityOffIcon"]').forEach(function (svg) {
      var btn = svg.closest('button') || svg.parentElement;
      if (!btn || btn.__wired) return; btn.__wired = true;
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', function () {
        var wrap = btn.closest('.MuiInputBase-root') || btn.parentElement.parentElement;
        var inp = wrap && wrap.querySelector('input');
        if (!inp) return;
        inp.type = (inp.type === 'password') ? 'text' : 'password';
      });
    });
  }

  /* ---------- 4. Select: bao cho nguoi dung biet ---------- */
  function wireSelects() {
    document.querySelectorAll('.MuiSelect-select').forEach(function (s) {
      if (s.__wired) return; s.__wired = true;
      s.style.cursor = 'pointer';
      s.addEventListener('click', function () {
        if (!s.__warned) {
          s.__warned = true;
          console.log('[interact] Select "' + (s.textContent || '').trim() + '": danh sach lua chon chua duoc chup tu thiet bi that.');
        }
      });
    });
  }

  function init() {
    // dong bo trang thai ban dau tu lop Mui-checked co san
    document.querySelectorAll('.PrivateSwitchBase-root').forEach(function (b) {
      var inp = b.querySelector('input');
      if (inp) inp.checked = b.className.indexOf('Mui-checked') >= 0;
    });
    syncAll(); applyEnableSections();
    wireAccordions(); wireEyes(); wireSelects();
    var n = document.querySelectorAll('input[type=checkbox],input[type=radio]').length;
    console.log('[interact] ' + n + ' cong tac/hop kiem da hoat dong');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
