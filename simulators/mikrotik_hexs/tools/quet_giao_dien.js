/*
 * QUET GIAO DIEN — chay TRONG TRINH DUYET, tren CA HAI: thiet bi that va ban gia lap
 * ================================================================================
 *
 * VI SAO CAN: bo kiem `kiem_may_chu.py` chi do tang MAY CHU (khung nhi phan
 * dung hay sai). No KHONG biet hoc vien nhin thay gi. Mot trang co the tra ve
 * khung dung tuyet doi ma van hien ra trang trang — vi du sai `.jg`, sai lop
 * CSS, hoac SPA nem loi. Day dung la cai bay da ghi trong CLAUDE.md:
 *
 *     "Moi ket luan ve GIAO DIEN phai kem PHEP DO KET QUA CUOI."
 *
 * CACH DUNG:
 *   1. Mo hai the: thiet bi that (192.168.1.1) va ban gia lap (localhost:8080),
 *      dang nhap ca hai.
 *   2. Dan tep nay vao console cua TUNG the.
 *   3. Goi:  await quetGiaoDien('that')   /   await quetGiaoDien('gialap')
 *      Ket qua tu gui ve tools/thu_bang_chung.py -> reference/khung_menu/
 *   4. Chay `python tools/doi_chieu_giao_dien.py` de so hai ban.
 *
 * DO CAI GI: chu co cau truc, KHONG do gia tri song.
 *   - nhan  : nhan cua moi o nhap (Interface, Address Range, ...)
 *   - cot   : tieu de cot cua bang
 *   - the   : cac the ngang (Interface / PPPoE Servers / Secrets ...)
 *   - nut   : nut tren thanh cong cu
 *   - soDong: so dong bang — chi de THAM KHAO, khong dung de ket luan sai/dung
 *
 * VI SAO KHONG SO GIA TRI: thiet bi that thay doi tung giay (Tx/Rx, uptime,
 * bang ARP), va kho khung goc thu ngay 2026-08-24. Lech gia tri la BINH THUONG.
 * Lech CAU TRUC moi la loi.
 *
 * AN TOAN — HAI LOP, va da tra gia de biet la can ca hai
 * ------------------------------------------------------
 *
 * **Lop 1 — loc theo VI TRI trong DOM (chinh).**
 * Chi lay the `<a>` nam trong SIDEBAR TRAI: `nav.menu ul#menu a`.
 * Do that tren WebFig 7.14.3:
 *
 *     #IP:ARP    -> A < LI < UL#IPlist.group < UL#menu < NAV.menu   (TRANG)
 *     #Log       -> A < LI < UL#menu < NAV.menu                     (TRANG)
 *     #Logout    -> A < LI < DIV.dropmenu < DIV#settings < UL#menubar_list
 *     #Safemode  -> A < LI < UL#menubar_list < DIV#menubar < DIV.top
 *
 * Logout / Safemode / Undo / Redo / Quick Set nam o THANH TREN, khong nam
 * trong `ul#menu`. Loc theo vi tri thi chung tu dong rot ra, khong phu thuoc
 * vao viec em co nho liet ke chung hay khong.
 *
 * **Lop 2 — danh sach CAM (du phong).**
 * Van giu, phong khi ban firmware khac dat cac muc nay vao sidebar.
 *
 * VI SAO CO CA HAI: ngay 2026-08-27 em viet ban dau CHI co danh sach CAM,
 * va quen `Logout` — vong quet chay het menu roi bam trung Logout, dang xuat
 * thiet bi that giua chung. Khong hu hai gi (Safe Mode khong bat, cau hinh
 * khong doi) nhung phai do lai tu dau. Dung y cai bay CLAUDE.md 5.8 da ghi,
 * ma nguoi vi pham lai la nguoi viet ra no.
 *
 * > Danh sach cam bao ve duoc nhung gi em NGHI RA. Loc theo cau truc bao ve
 * > duoc ca nhung gi em CHUA NGHI TOI. Uu tien loai thu hai.
 */

const CAM = [
  'Supout', 'Reboot', 'Shutdown', 'Reset', 'Backup', 'Restore',
  'Upgrade', 'Format', 'Packages', 'Partition', 'License',
  'Logout', 'Safemode', 'Undo', 'Redo', 'Quick',
];

/*
 * TRANG NANG — do that 2026-08-27 tren hEX S:
 *
 * `#Log` va `#System:History` cua THIET BI THAT lam treo han the Chrome khi
 * quet tu dong: bang co hang nghin dong, SPA dung phan trang bang con tro
 * (0xfe0003) nen no hoi lien tuc khong nghi. Da lam Chrome mat ket noi hai
 * lan trong mot phien.
 *
 * Tren BAN GIA LAP thi khong sao — kho khung chi co 5 trang.
 *
 * Vi vay: khi quet THIET BI THAT, bo qua hai muc nay. Chung khong mang thong
 * tin cau truc gi dac biet (chi la mot bang phang), doi lai tranh mat ca
 * vong quet. Muon kiem hai trang do thi mo tay va nhin.
 */
/*
 * SUA 2026-08-28 — doi ten tu NANG_TREN_THIET_BI_THAT thanh NANG_CA_HAI_BEN.
 *
 * Chu thich ben tren (viet 27/08) khang dinh: "Tren BAN GIA LAP thi khong sao
 * — kho khung chi co 5 trang." Hom nay em chay mot vong quet tren
 * localhost:8080 va no **KET CUNG o `#System:History`**, khong bao gio ve
 * dich. Tuc cau khang dinh do SAI, va no sai theo dung kieu ma CLAUDE.md
 * canh bao: em suy tu "kho khung nho" chu khong DO thu.
 *
 * Nay bo qua o CA HAI ben. Khong mat gi: bo doi chieu von loai bo hop
 * `boQua` cua hai ban quet, nen quet mot ben cung khong dung de so.
 */
const NANG_CA_HAI_BEN = ['#Log', '#System:History'];

function biCam(h) {
  return CAM.some((t) => h.toLowerCase().includes(t.toLowerCase()));
}

function chuan(s) {
  return (s || '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Rut dac trung CAU TRUC cua trang dang hien. */
function docTrang() {
  const goc = document.body;
  const nhan = [];
  goc.querySelectorAll('input, select, textarea').forEach((e) => {
    const h = e.closest('tr, div');
    if (!h) return;
    let t = chuan((h.innerText || '').split('\n')[0]);
    // BO chu cua cac <option> ra khoi nhan.
    //
    // BAI HOC 2026-08-27: khong lam buoc nay thi bo doi chieu bao 3 "lech
    // nhan" gia — vi du #IP:SNMP:
    //     that   : [... 'Trap Version', 'Src. Address' ...]
    //     gia lap: [... 'Trap Version', 'interfaces', 'Src. Address' ...]
    // Nguyen nhan: o do la <select> co options ['interfaces','start-trap',
    // 'temp-exception']. Tren BAN GIA LAP options ve tuc thi (doc tu kho
    // trong bo nho) nen `innerText` cua o chua ca chu 'interfaces'. Tren
    // THIET BI THAT, trong 1,1 giay options chua kip ve nen o rong.
    //
    // Tuc do khong phai lech cau truc ma la lech TOC DO. Neu tin no thi em
    // se di "sua" ban gia lap cho giong mot trang thai chua tai xong.
    if (e.tagName === 'SELECT') {
      for (const o of e.options) {
        const c = chuan(o.text);
        if (c) t = t.split(c).join(' ');
      }
      t = chuan(t);
    }
    if (t) nhan.push(t.slice(0, 40));
  });
  const cot = [];
  goc.querySelectorAll('table').forEach((tb) => {
    const tr = tb.querySelector('tr');
    if (!tr) return;
    const h = [...tr.children].map((td) => chuan(td.innerText)).filter(Boolean);
    if (h.length > 1) cot.push(h.join('|'));
  });
  let soDong = 0;
  goc.querySelectorAll('table').forEach((tb) => {
    soDong = Math.max(soDong, tb.querySelectorAll('tr').length - 1);
  });
  const nut = [...goc.querySelectorAll('button, input[type=button], span')]
    .map((e) => chuan(e.textContent || e.value))
    .filter((t) => t && t.length < 24)
    .slice(0, 40);
  // ANH VO — them 2026-08-28, sau khi anh Huynn bat loi bo quet nay BO SOT.
  //
  // Ngay 27/08 em dung bo quet nay va tuyen bo "bit lo hong lon nhat". Hom
  // sau anh Huynn gui hai anh chup trang IP >> Cloud: ban gia lap hien BIEU
  // TUONG ANH VO o cho thiet bi that ve tam giac muc luc. Bo quet bao
  // "0 lech" — vi no chi doc NHAN va TIEU DE COT, ma anh vo khong lam doi
  // mot ky tu nao. No nhin CHU, khong nhin HINH.
  //
  // `naturalWidth === 0` sau khi `complete === true` la phep do KET QUA CUOI
  // dung nghia CLAUDE.md muc 5.6: trinh duyet da co gang tai xong va that
  // bai. Khong suy tu ma HTTP, khong suy tu "tep co tren dia hay khong".
  const anhVo = [...goc.querySelectorAll('img')]
    .filter((i) => i.complete && i.naturalWidth === 0)
    .map((i) => (i.getAttribute('src') || '').split('/').pop())
    .filter(Boolean);
  return {
    tieu: chuan(document.title.split(' at ')[0]),
    nhan: [...new Set(nhan)],
    cot,
    soDong,
    nut: [...new Set(nut)],
    daiChu: chuan(goc.innerText).length,
    soAnh: goc.querySelectorAll('img').length,
    anhVo: [...new Set(anhVo)],
  };
}

/*
 * QUET THEO KHOI — vi sao khong quet mot mach
 * -------------------------------------------
 * Ban dau ham nay quet ca 116 trang trong MOT vong lap async. Chay khong
 * xong, hai lan. Nguyen nhan do duoc ngay 2026-08-27:
 *
 *  1. **SPA tu nap lai** (lam moi phien). Khung cua ham async bien mat
 *     IM LANG: `location.hash` dung yen, bien ket qua van `null`, khong nem
 *     loi, khong dau hieu gi. Nhin ngoai y het "trinh duyet treo" — va em da
 *     chan doan nham dung nhu vay hai lan truoc khi hieu ra.
 *  2. **`subscribe` don lai.** Moi trang da mo giu mot kenh cho dai. Sau vai
 *     chuc trang thi cham dan; rieng `#Log` / `#System:History` cua thiet bi
 *     that du suc lam mat ket noi Chrome.
 *
 * Cach chua: chay tung KHOI ngan, luu trang thai vao `sessionStorage`, giua
 * hai khoi thi `location.reload()` — nap lai cat sach moi kenh cho dai, va
 * neu SPA co tu nap lai giua chung thi cung khong mat gi, goi lan sau doc
 * `sessionStorage` roi chay tiep tu dung cho do.
 *
 * CACH DUNG: dan tep nay vao console roi goi `await quetKhoi('gialap')`
 * NHIEU LAN cho toi khi tra ve `{xong: true}`. Moi lan ~25 giay.
 */

const KHOA = '__quet_trang_thai';
const MOI_KHOI = 12;          // 12 trang x 2 giay = 24 giay, du an toan

/*
 * PHAI dung `localStorage`, KHONG duoc dung `sessionStorage`.
 *
 * Do that 2026-08-27: sau moi `location.reload()`, co luc SPA chua kip dung
 * lai phien nen phai dang nhap lai — va thu tuc dang nhap cua WebFig **xoa
 * sach sessionStorage** truoc khi ghi phien moi cua no. Trang thai vong quet
 * bay theo, `tt.i` quay ve `undefined`, vong quet bat dau lai tu dau ma
 * khong bao gi.
 *
 * `localStorage` khong bi thu tuc do dong toi.
 */
function docTrangThai() {
  try { return JSON.parse(localStorage.getItem(KHOA) || 'null'); } catch (e) { return null; }
}

function ghiTrangThai(t) {
  localStorage.setItem(KHOA, JSON.stringify(t));
}

/*
 * CHO CHO TOI KHI THAT SU DA DANG NHAP — bat buoc, khong duoc bo.
 *
 * BAI HOC 2026-08-27, lan thu tu trong cung mot phien:
 * Sau moi `location.reload()` giua hai khoi, WebFig quay ve MAN HINH DANG
 * NHAP mot lat roi moi dung lai phien. Ban dau khoi tiep theo bat dau doc
 * ngay — va no doc trung cai man hinh dang nhap do.
 *
 * Ket qua: **40/106 trang cua thiet bi that va 44/116 trang cua ban gia lap
 * deu ghi `nhan: ['Login:','Password:']`** thay vi noi dung that. Bo doi
 * chieu bao 55 muc lech, va khong mot muc nao trong so do la lech that.
 *
 * Dau hieu nhan biet mot ban quet bi nhiem: dem so trang co 'Login:' trong
 * `nhan`. Phai bang 0. Neu khac 0 thi VUT DI, dung doc ket qua.
 */
async function choDangNhap(cho) {
  for (let i = 0; i < 60; i += 1) {
    if (typeof post === 'function'
        && document.querySelector('nav.menu ul#menu a[href*="#"]')) return true;
    const f = document.forms[0];
    if (f && f.elements.length >= 3) {
      f.elements[0].value = 'admin';
      f.elements[1].value = 'admin';
      f.elements[2].click();
    }
    await cho(500);
  }
  throw new Error('Khong dang nhap duoc sau 30 giay — DUNG, khong quet bua.');
}

async function quetKhoi(nhan_ban) {
  const cho = (ms) => new Promise((r) => setTimeout(r, ms));
  await choDangNhap(cho);

  let tt = docTrangThai();
  if (!tt || tt.ban !== nhan_ban) {
    // LOP 1: chi lay lien ket trong sidebar trai. Xem phan AN TOAN o dau tep.
    const trongMenu = document.querySelectorAll('nav.menu ul#menu a[href*="#"]');
    if (!trongMenu.length) {
      throw new Error('Khong tim thay nav.menu ul#menu — DUNG LAI, khong quet bua.');
    }
    const tatCa = [...new Set(
      [...trongMenu].map((e) => e.getAttribute('href')),
    )].filter((h) => h && h.length > 1);

    const duong = [];
    const boQua = [];
    for (const h of tatCa) {
      // LOP 2 — danh sach CAM chi ap cho thiet bi THAT (tranh bam nham
      // Logout/Reboot), con danh sach NANG ap cho CA HAI (xem chu thich).
      const chan = (nhan_ban === 'that' && biCam(h))
        || NANG_CA_HAI_BEN.includes(h);
      (chan ? boQua : duong).push(h);
    }
    tt = { ban: nhan_ban, duong, boQua, i: 0, trang: {}, khi: new Date().toISOString() };
  }

  const loiJS = [];
  window.onerror = (m) => { loiJS.push(String(m).slice(0, 120)); };

  let lam = 0;
  while (tt.i < tt.duong.length && lam < MOI_KHOI) {
    const h = tt.duong[tt.i];
    const truoc = loiJS.length;
    location.hash = h;
    await cho(2000);
    tt.trang[h] = docTrang();
    tt.trang[h].loi = loiJS.slice(truoc);
    tt.i += 1;
    lam += 1;
  }
  ghiTrangThai(tt);

  if (tt.i < tt.duong.length) {
    setTimeout(() => location.reload(), 300);   // cat kenh cho dai truoc khoi sau
    return { xong: false, da: tt.i, tong: tt.duong.length };
  }

  // Tu kiem truoc khi gui: khong duoc con trang nao dinh man dang nhap.
  const nhiem = Object.keys(tt.trang)
    .filter((h) => (tt.trang[h].nhan || []).includes('Login:'));
  if (nhiem.length) {
    throw new Error(`${nhiem.length} trang dinh man DANG NHAP `
      + `(${nhiem.slice(0, 3)}) — ban quet HONG, khong gui. `
      + `Xoa localStorage['${KHOA}'] roi chay lai.`);
  }

  const goi = {
    ban: nhan_ban, khi: tt.khi, boQua: tt.boQua, trang: tt.trang,
  };
  const r = await fetch(
    'http://localhost:9099/nhan?thu_muc=khung_menu&ten=QUET_' + nhan_ban + '.json',
    { method: 'POST', body: JSON.stringify(goi) },
  );
  localStorage.removeItem(KHOA);
  return {
    xong: true, so: Object.keys(tt.trang).length, boQua: tt.boQua.length, gui: r.status,
  };
}

window.quetKhoi = quetKhoi;
'quet_giao_dien.js da nap — goi await quetKhoi("gialap") nhieu lan';
