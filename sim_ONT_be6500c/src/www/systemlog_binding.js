/* Bang nhat ky trang System >> System Log.

   CAI LAI THEO MA GOC (reference/source/assets_goc/index-C1786ZJT.js):

     cot pe = [{title:"Severity"},{title:"Date & Time"},
               {title:"Information", disableSorting:true}]

     bang muc do me = [Emergency(0), Alert(1), Critical(2), Error(3),
                       Warning(4), Notice(5), Informational(6), Debug(7)]

     K = U.map(k => ({...k, level: k.level - 1}))     // TRU 1 truoc khi tra bang
     N = {...logServer, level: logServer.level - 1}   // muc loc mac dinh
     bo loc mac dinh: me.slice(0, N.level + 1)        // giu cac muc <= N.level

     moi dong:
       Severity     = me[level].title
       Date & Time  = Yr(k.time)
       Information  = k.log

   Ham Yr = '_t' trong time-BDWluCqD.js, dinh dang mac dinh
   Ot = "MM/DD/YYYY, hh:mm A"  (vd 08/11/2026, 09:45 AM). Luu y trong cung
   module con co xt = "MM/DD/YYYY, hh:mm:ss A" nhung Yr KHONG dung cai do.

   CHU Y VE 'TRU 1': du lieu API tra level = 7 -> sau khi tru 1 thanh 6 ->
   tra bang ra "Informational" (khong phai "Debug"). Neu quen tru 1 thi moi
   dong deu lech mot bac muc do.

   MARKUP DONG: ban chup goc cua trang nay co <tbody> RONG (luc chup trinh
   duyet chua kip tai nhat ky), nen khong co mau dong that. Da lay mau tu
   bang LAN Status trong home__lanstatus.html -- HAI BANG DUNG CHUNG
   component RuleList (doi chieu duoc trong ma goc: ca hai deu goi
   RuleList-DSSpDMfm.js), chi khac so cot. Day la suy luan co co so, ghi ro
   de sau nay co ban chup that thi thay lai. */
(function () {
  var MUC_DO = ['Emergency', 'Alert', 'Critical', 'Error', 'Warning',
                'Notice', 'Informational', 'Debug'];

  var LOP_TR = 'MuiTableRow-root css-dl5c2x';
  var LOP_TD = 'MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft '
             + 'MuiTableCell-sizeMedium css-xa9bhm';
  var LOP_SPAN = 'MuiTypography-root MuiTypography-body2 css-fytoy1';

  var TEN_THU = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  /* dayjs format "MM/DD/YYYY, hh:mm A" -- 12 gio, co AM/PM, dem 0 o dau */
  function dinhDangGio(ms) {
    if (!ms || typeof ms !== 'number') return '-';
    var d = new Date(ms);
    function hai(n) { return (n < 10 ? '0' : '') + n; }
    var gio = d.getHours();
    var buoi = gio >= 12 ? 'PM' : 'AM';
    var gio12 = gio % 12; if (gio12 === 0) gio12 = 12;
    return hai(d.getMonth() + 1) + '/' + hai(d.getDate()) + '/' + d.getFullYear()
      + ', ' + hai(gio12) + ':' + hai(d.getMinutes()) + ' ' + buoi;
  }

  function taoO(noiDung) {
    var td = document.createElement('td');
    td.className = LOP_TD;
    var sp = document.createElement('span');
    sp.className = LOP_SPAN;
    sp.textContent = noiDung;
    td.appendChild(sp);
    return td;
  }

  function chay() {
    var tbody = document.querySelector('tbody');
    if (!tbody) return;

    Promise.all([
      fetch('/api/v1/data/system/logs').then(function (r) { return r.ok ? r.json() : null; }),
      fetch('/api/v1/data/system/logServer').then(function (r) { return r.ok ? r.json() : null; })
    ]).then(function (kq) {
      var logs = kq[0], cauHinh = kq[1];
      if (!Array.isArray(logs)) return;

      var mucLoc = (cauHinh && typeof cauHinh.level === 'number')
        ? cauHinh.level - 1 : MUC_DO.length - 1;

      var dong = logs
        .map(function (k) { return { level: k.level - 1, time: k.time, log: k.log }; })
        .filter(function (k) { return k.level >= 0 && k.level <= mucLoc; });

      tbody.innerHTML = '';
      dong.forEach(function (k) {
        var tr = document.createElement('tr');
        tr.className = LOP_TR;
        tr.appendChild(taoO(MUC_DO[k.level] || String(k.level)));
        tr.appendChild(taoO(dinhDangGio(k.time)));
        tr.appendChild(taoO(k.log));
        tbody.appendChild(tr);
      });
      console.log('[systemlog_binding] hien ' + dong.length + '/' + logs.length
        + ' dong (loc muc <= ' + MUC_DO[mucLoc] + ')');
    }).catch(function () {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', chay);
  else chay();
})();
