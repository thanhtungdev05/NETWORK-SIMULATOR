#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
KIEM MAY CHU GIA LAP — dong vai TRINH DUYET
============================================
Tu chay server.py roi lam DUNG nhung gi master-min.js lam:
  1. GET cac tai nguyen tinh, doi chieu sha256 voi reference/
  2. POST /jsproxy bat tay (8 byte 0 + khoa cong)
  3. Dan xuat khoa RC4 y het phia trinh duyet (isServer=False)
  4. Gui yeu cau da ma hoa, giai ma tra loi, doc khung M2

Neu tang mat ma sai mot bit thi buoc 4 hong ngay — 8 byte dem se khong
con la dau cach. Day chinh la phep do ma GD2 con thieu.
"""
import hashlib
import os
import subprocess
import sys
import time
import urllib.request
import threading

_HERE = os.path.dirname(os.path.abspath(__file__))
_GOC = os.path.join(_HERE, "..")
sys.path.insert(0, os.path.join(_GOC, "src"))
import m2        # noqa: E402
import mat_ma    # noqa: E402

CONG = 8097
CS = f"http://127.0.0.1:{CONG}"

so_kiem = 0
loi = []


def kiem(dk, mo_ta, chi_tiet=""):
    global so_kiem
    so_kiem += 1
    if dk:
        print(f"  OK   {mo_ta}")
    else:
        print(f"  SAI  {mo_ta}" + (f"  [{chi_tiet}]" if chi_tiet else ""))
        loi.append(mo_ta)


def lay(dp):
    try:
        with urllib.request.urlopen(CS + dp, timeout=10) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def dang(dp, than):
    rq = urllib.request.Request(CS + dp, data=than, method="POST")
    with urllib.request.urlopen(rq, timeout=15) as r:
        return r.status, r.read()


def sha(p):
    return hashlib.sha256(open(p, "rb").read()).hexdigest()


def main():
    # Kho cau hinh phai RONG truoc moi lan kiem, neu khong nhom L se doi id
    # dong moi (thiet bi that cap id 1 cho bang [20,35] dang rong).
    tep_kho = os.path.join(_GOC, "src", "cau_hinh.json")
    if os.path.exists(tep_kho):
        os.remove(tep_kho)
    srv = subprocess.Popen([sys.executable, os.path.join(_GOC, "src", "server.py"), str(CONG)],
                           stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
    # Cho may chu san sang, khong doan bang sleep co dinh: nap 440 khung
    # + kho cau hinh co the lau hon may cham.
    for _ in range(40):
        time.sleep(0.25)
        try:
            lay("/")
            break
        except Exception:
            continue
    try:
        print("=" * 66)
        print("  KIEM MAY CHU GIA LAP MikroTik hEX S")
        print("=" * 66)

        print("\n--- A. Tai nguyen tinh trung khit reference/ ---")
        cap = [("/", "reference/root/index.html"),
               ("/script.js", "reference/root/script.js"),
               ("/logo.png", "reference/root/logo.png"),
               ("/webfig/", "reference/webfig/index.html"),
               ("/webfig/master-min-99e951c770b2.js", "reference/webfig/master-min-99e951c770b2.js"),
               ("/webfig/curve255-541e54a862be.js", "reference/webfig/curve255-541e54a862be.js"),
               ("/webfig/master-d3bb55452204.css", "reference/webfig/master-d3bb55452204.css"),
               ("/webfig/list", "reference/webfig/list"),
               ("/webfig/roteros-6fb93413ec27.jg", "reference/jg/roteros-6fb93413ec27.jg")]
        for dp, goc in cap:
            ma, than = lay(dp)
            mong = sha(os.path.join(_GOC, goc))
            kiem(ma == 200 and hashlib.sha256(than).hexdigest() == mong,
                 f"A {dp} trung sha256 voi {goc.split('/')[-1]}", f"ma {ma}, {len(than)}B")

        ma, _ = lay("/khong-co-that.html")
        kiem(ma == 404, "A duong dan khong co that -> 404")

        print("\n--- B. Bat tay /jsproxy ---")
        priv = os.urandom(32)
        pub = mat_ma.khoa_cong(priv)
        ma, tl = dang("/jsproxy", b"\x00" * 8 + pub)
        kiem(ma == 200 and len(tl) == 40, "B1 bat tay tra ve 40 byte", f"ma {ma}, {len(tl)}B")
        ma_phien = int.from_bytes(tl[:4], "big")
        pub_chu = tl[8:40]
        kiem(ma_phien > 0, f"B2 duoc cap id phien = {ma_phien}")
        kiem(len(pub_chu) == 32 and pub_chu != b"\x00" * 32, "B3 nhan duoc khoa cong may chu")

        print("\n--- C. Dan xuat khoa y het trinh duyet ---")
        master = mat_ma.bi_mat_chung(priv, pub_chu)
        tx = mat_ma.RC4(mat_ma.dan_xuat_khoa(master, True, False))   # trinh duyet GUI
        rx = mat_ma.RC4(mat_ma.dan_xuat_khoa(master, False, False))  # trinh duyet NHAN
        kiem(True, "C1 da dan xuat 2 khoa RC4 (chieu gui / chieu nhan)")

        # seq KHONG phai dem 1,2,3... ma CONG DON theo do dai than goi, y het
        # ma goc: this.txseq += arr.length + 8. May chu xep lai goi theo seq
        # nen danh so sai la no cho mai roi bao het gio.
        seq_gui = [1]

        def dong_goi(the_ds):
            nd = m2.dung_than(the_ds, magic=True)
            than = tx.xor(nd + mat_ma.DEM)
            b = (ma_phien.to_bytes(4, "big") + seq_gui[0].to_bytes(4, "big") + than)
            seq_gui[0] += len(than)
            return b

        print("\n--- D. Goi du lieu ma hoa hai chieu ---")
        # Yeu cau: duong dan [20,0] = Interface List, kem so hieu
        the = [(0xFF0001, 0x88, [20, 0]), (0xFF0007, 0x08, 0xFE0012),
               (0xFF0006, 0x08, 4242)]
        goi = dong_goi(the)
        ma, tl = dang("/jsproxy", goi)
        kiem(ma == 200 and len(tl) > 16, "D1 may chu tra loi goi da ma hoa",
             f"ma {ma}, {len(tl)}B")

        ro = rx.xor(tl[8:])
        kiem(ro[-8:] == b" " * 8,
             "D2 giai ma xong: 8 byte dem DUNG la dau cach (khoa khop)",
             ro[-8:].hex())

        kq = m2.giai_ma_than(ro[:-8])
        t = {ten: gt for ten, kieu, gt in kq["the"]}
        kiem(t.get(0xFF0001) == [ma_phien], "D3 tra ve dung id phien", str(t.get(0xFF0001)))
        kiem(t.get(0xFF0002) == [20, 0], "D4 tra ve dung duong dan da hoi", str(t.get(0xFF0002)))
        kiem(t.get(0xFF0006) == 4242, "D5 vong lai dung so hieu yeu cau", str(t.get(0xFF0006)))
        dong = t.get(0xFE0002)
        kiem(dong is not None and len(dong) == 10,
             "D6 tra ve 10 dong giao dien (dung nhu thiet bi that)",
             str(len(dong) if dong else None))

        if dong:
            chuoi = []
            for c in dong:
                for ten, kieu, gt in c["the"]:
                    if kieu == 0x21:
                        try:
                            chuoi.append(gt.decode())
                        except Exception:
                            pass
            kiem("ether1" in chuoi and "sfp1" in chuoi,
                 "D7 du lieu la ten giao dien THAT (ether1, sfp1)",
                 ",".join(chuoi[:8]))

        print("\n--- F. Dang nhap: doi chieu tung gia tri voi THIET BI THAT ---")
        # Body y het ham doAuth() trong master-min.js: {s1:user, s3:pwd} +
        # the mang chuoi Sff001c ma post() luon them vao.
        the_dn = [(0x000001, 0x21, b"admin"), (0x000003, 0x21, b"admin"),
                  (0xFF001C, 0xA0, [b"doAuth"])]
        goi_dn = dong_goi(the_dn)
        ma, tl_dn = dang("/jsproxy", goi_dn)
        kiem(ma == 200, "F1 lenh dang nhap tra ve 200 (co the mang chuoi Sff001c)",
             f"ma {ma}")
        ro_dn = rx.xor(tl_dn[8:])
        d = {a: c for a, b, c in m2.giai_ma_than(ro_dn[:-8])["the"]}
        # Cac gia tri duoi day DOC THANG tu sysres cua thiet bi that 2026-08-24
        kiem(d.get(0xFF000B) == 655358, "F2 policy = 655358 (dung thiet bi that)",
             str(d.get(0xFF000B)))
        kiem(d.get(0xFE0009) == b"default", "F3 skin = default", str(d.get(0xFE0009)))
        kiem(d.get(0x000011) == b"mmips", "F4 arch = mmips", str(d.get(0x000011)))
        kiem(d.get(0x000015) == b"RB760iGS", "F5 boardname = RB760iGS",
             str(d.get(0x000015)))
        kiem(d.get(0x000017) == b"RBM", "F6 board = RBM", str(d.get(0x000017)))
        rm = d.get(0x000028)
        u6d = None
        if rm:
            u6d = next((c for a, b, c in rm["the"] if a == 0x6D), None)
        kiem(u6d == [541594755, 2684373084, 0],
             "F7 rosmode.U6d dung bitmask tinh nang that", str(u6d))

        the_qs = [(0xFF0001, 0x88, [120]), (0xFF0007, 0x08, 5),
                  (0xFF001C, 0xA0, [b"x"])]
        goi_qs = dong_goi(the_qs)
        ma, tl_qs = dang("/jsproxy", goi_qs)
        ro_qs = rx.xor(tl_qs[8:])
        d2 = {a: c for a, b, c in m2.giai_ma_than(ro_qs[:-8])["the"]}
        kiem(d2.get(0x000001) == 64, "F8 qscaps = 64 (duong dan [120])",
             str(d2.get(0x000001)))

        print("\n--- G. Chuoi khoi dong SPA (theo dung initSession trong ma goc) ---")
        # Chuoi that: doAuth -> [120] qscaps -> [13,7] manualURL ->
        # fetchBoardInfo [24,2] -> fetchTimeZone [24,0] -> start() -> loadSkin
        # -> hide('startup'). Thieu bat ky mat xich nao la man hinh dung o
        # chu "Loading" — day chinh la loi da gap 2026-08-24.
        TR = (0xFF001C, 0xA0, [b"t"])
        # (bo dem cu, nay dung seq_gui o tren)

        def goi(the, cho=10):
            b = dong_goi(the)
            rq = urllib.request.Request(CS + "/jsproxy", data=b, method="POST")
            with urllib.request.urlopen(rq, timeout=cho) as r:
                tl = r.read()
            ro = rx.xor(tl[8:])
            assert ro[-8:] == b" " * 8, "8 byte dem sai"
            return {a: c for a, b2, c in m2.giai_ma_than(ro[:-8])["the"]}

        d = goi([(0xFF0001, 0x88, [13, 7]), (0xFF0007, 0x08, 0xFE000D),
                 (0x000001, 0x21, b"admin"), TR])
        kiem(d.get(0xFF0002) == [13, 7], "G1 [13,7] manualURL tra loi dung duong dan")

        d = goi([(0xFF0001, 0x88, [24, 2]), (0xFF0002, 0x88, [44]),
                 (0xFF0007, 0x08, 0xFE000D), TR])
        kiem(d.get(0x000016) == b"7.14.3 (stable)",
             "G2 [24,2] fetchBoardInfo: version dung", str(d.get(0x000016)))
        kiem(d.get(0x00002C) == b"hEX S",
             "G3 [24,2] displayname = hEX S", str(d.get(0x00002C)))
        kiem(isinstance(d.get(0x000001), int) and d.get(0x000001) > 0,
             "G4 [24,2] co uptime", str(d.get(0x000001)))

        d = goi([(0xFF0001, 0x88, [24, 0]), (0xFF0007, 0x08, 0xFE000D), TR])
        kiem(d.get(0x00001B) == 25200,
             "G5 [24,0] fetchTimeZone: GMToffset = 25200 (GMT+7)", str(d.get(0x00001B)))
        kiem(d.get(0x00001A) == b"Asia/Ho_Chi_Minh",
             "G6 [24,0] mui gio = Asia/Ho_Chi_Minh", str(d.get(0x00001A)))

        ma, _ = lay("/jsproxy/?abc")
        kiem(ma == 404, "G7 GET /jsproxy/ (fetchFile) tra loi NGAY, khong treo",
             f"ma {ma}")

        t0 = time.time()
        goi([TR], cho=45)
        giu = time.time() - t0
        kiem(giu > 20,
             f"G8 kenh cho dai GIU ket noi {giu:.0f}s (tra ngay se lam trinh "
             f"duyet quay vong)", f"{giu:.1f}s")

        print("\n--- H. Khung ngoai cung phai QUA DUOC buffer2msgs cua ma goc ---")
        # PHEP DO NAY DA BAT DUOC LOI THAT — DUNG XOA.
        # Ma goc buffer2msgs():
        #     while(pos+2 <= arr.length){
        #       len = (arr[pos]<<8)|arr[pos+1];
        #       arr[pos]=0x4d; arr[pos+1]=0x32;     // GHI DE thanh 'M2'
        #       buffer2msg(...); pos += len; }
        # Tuc tang ngoai cung tren day KHONG co 'M2' — chinh client ghi de vao.
        # May chu tung gui 'M2' that -> client doc do dai 0x4d32 = 19762 ->
        # 'RangeError: Invalid typed array length: 19762' -> dung o "Loading".
        d_h = goi([(0xFF0001, 0x88, [24, 0]), (0xFF0007, 0x08, 0xFE000D), TR],
                  cho=10)
        kiem(d_h.get(0xFF0002) == [24, 0], "H0 lay duoc mot khung tra loi de kiem")

        # Lay lai than THO de soi tung byte
        b_h = dong_goi([(0xFF0001, 0x88, [24, 2]), (0xFF0007, 0x08, 0xFE000D), TR])
        rq_h = urllib.request.Request(CS + "/jsproxy", data=b_h, method="POST")
        with urllib.request.urlopen(rq_h, timeout=10) as r:
            tl_h = r.read()
        than = rx.xor(tl_h[8:])[:-8]

        kiem(than[:2] != b"M2",
             "H1 tang ngoai cung KHONG duoc la 'M2' (client se doc thanh do dai)",
             than[:2].hex())
        kiem(((than[0] << 8) | than[1]) == len(than),
             "H2 2 byte dau la DO DAI dung (tinh ca chinh no)",
             f"ghi {(than[0] << 8) | than[1]}, that {len(than)}")

        # Mo phong DUNG vong lap buffer2msgs
        pos, n_khung, hong = 0, 0, None
        while pos + 2 <= len(than):
            ln = (than[pos] << 8) | than[pos + 1]
            if ln <= 0 or pos + ln > len(than):
                hong = f"do dai {ln} tai vi tri {pos}"
                break
            n_khung += 1
            pos += ln
        kiem(hong is None and pos == len(than),
             f"H3 buffer2msgs tach duoc {n_khung} khung, dung VUA HET byte",
             hong or f"dung {pos}/{len(than)}")

        print("\n--- E. Duong dan chua co du lieu -> khung rong dung dinh dang ---")
        the2 = [(0xFF0001, 0x88, [999, 9]), (0xFF0006, 0x08, 77)]
        goi2 = dong_goi(the2)
        ma, tl2 = dang("/jsproxy", goi2)
        ro2 = rx.xor(tl2[8:])
        kiem(ro2[-8:] == b" " * 8, "E1 van dung khung, dung dem")
        t2 = {a: c for a, b, c in m2.giai_ma_than(ro2[:-8])["the"]}
        kiem(t2.get(0xFF0002) == [999, 9] and t2.get(0xFE0002) is None,
             "E2 tra khung rong, KHONG bia du lieu")

        print("\n--- L. MUC 4: kho cau hinh — ghi o day, doc lai o kia ---")
        # Hop dong ghi do that 2026-08-25, xem reference/khung_ghi/bang-ke.json

        def goi_hoi(the_ds):
            _, tl_ = dang("/jsproxy", dong_goi(the_ds))
            ro_ = rx.xor(tl_[8:])
            return {a: c for a, b, c in m2.giai_ma_than(ro_[:-8])["the"]}

        # L1 — SUA MUC DON [24,1] Identity
        r = goi_hoi([(0xFF0001, 0x88, [24, 1]), (0xFF0007, 0x08, 0xFE000E),
                 (0x00000C, 0x21, b"LAB-TEST"), (0xFF0006, 0x08, 701)])
        kiem(set(r) == {0xFF0001, 0xFF0002, 0xFF0003, 0xFF0006}
             and r.get(0xFF0002) == [24, 1] and r.get(0xFF0006) == 701,
             "L1 ghi Identity -> ACK tran dung 4 the (khop khung that)",
             f"the={[hex(x) for x in r]}")

        # L2 — doc lai bang mot yeu cau KHAC
        r = goi_hoi([(0xFF0001, 0x88, [24, 1]), (0xFF0007, 0x08, 0xFE000D),
                 (0xFE000C, 0x08, 5), (0xFF0006, 0x08, 702)])
        kiem(r.get(0x00000C) == b"LAB-TEST",
             "L2 doc lai [24,1] thay gia tri MOI", f"{r.get(0x00000C)!r}")

        # L3 — THEM DONG vao [20,35] (bang nay tren thiet bi that dang RONG)
        r = goi_hoi([(0xFF0001, 0x88, [20, 35]), (0xFF0007, 0x08, 0xFE0005),
                 (0xFE0010, 0x21, b"KIEM"), (0x000003, 0x08, 3405803777),
                 (0xFF0006, 0x08, 703)])
        ma_dong = r.get(0xFE0001)
        kiem(ma_dong == 1 and 0xFE0001 in r,
             "L3 them dong -> ACK co ufe0001 = id moi (thiet bi that cap id 1)",
             f"id={ma_dong}")

        # L4 — doc lai bang, phai thay dong vua them
        r = goi_hoi([(0xFF0001, 0x88, [20, 35]), (0xFF0007, 0x08, 0xFE0004),
                 (0xFE000C, 0x08, 5), (0xFF0006, 0x08, 704)])
        ds = r.get(0xFE0002) or []
        dong = {a: c for a, b, c in ds[0]["the"]} if ds else {}
        kiem(len(ds) == 1 and dong.get(0xFE0010) == b"KIEM",
             "L4 doc lai bang thay DONG MOI", f"{len(ds)} dong")

        # ufe0019 = objCount. Trong moi khung that, no LUON bang so dong.
        # Quen cap nhat -> giao dien hien "1 item out of 0" (vap that).
        kiem(r.get(0xFE0019) == len(ds),
             "L4b ufe0019 (objCount) khop so dong — khong con 'out of 0'",
             f"fe0019={r.get(0xFE0019)}, so dong={len(ds)}")

        # L5 — SUA dong do
        goi_hoi([(0xFF0001, 0x88, [20, 35]), (0xFF0007, 0x08, 0xFE0003),
             (0xFE0001, 0x09, ma_dong), (0xFE0009, 0x21, b"da sua"),
             (0xFF0006, 0x08, 705)])
        r = goi_hoi([(0xFF0001, 0x88, [20, 35]), (0xFF0007, 0x08, 0xFE0004),
                 (0xFE000C, 0x08, 5), (0xFF0006, 0x08, 706)])
        ds = r.get(0xFE0002) or []
        dong = {a: c for a, b, c in ds[0]["the"]} if ds else {}
        kiem(dong.get(0xFE0009) == b"da sua" and dong.get(0xFE0010) == b"KIEM",
             "L5 sua dong: truong moi doi, truong cu giu nguyen")

        # L6 — XOA dong, bang phai rong lai
        goi_hoi([(0xFF0001, 0x88, [20, 35]), (0xFF0007, 0x08, 0xFE0006),
             (0xFE0001, 0x09, ma_dong), (0xFF0006, 0x08, 707)])
        r = goi_hoi([(0xFF0001, 0x88, [20, 35]), (0xFF0007, 0x08, 0xFE0004),
                 (0xFE000C, 0x08, 5), (0xFF0006, 0x08, 708)])
        kiem(not (r.get(0xFE0002) or []), "L6 xoa dong: bang rong tro lai")

        # L7 — kho ghi xuong dia
        tep_kho = os.path.join(_GOC, "src", "cau_hinh.json")
        kiem(os.path.exists(tep_kho), "L7 kho luu xuong src/cau_hinh.json")

        print("\n--- R. Lenh hanh dong (doit) ---")
        # Doit.prototype.doit: req.uff0007 = attrs.cmd (so NHO rieng tung
        # duong dan). Do that: [82] cmd 1 -> ACK tran; [138,1] tren phan cung
        # khong co WiFi -> loi 0xfe0004.
        r = goi_hoi([(0xFF0001, 0x88, [82]), (0xFF0007, 0x08, 1),
                     (0x000001, 0x30, bytes([2, 0, 0, 0, 0, 1])),
                     (0xFF0006, 0x08, 1101)])
        kiem(set(r) == {0xFF0001, 0xFF0002, 0xFF0003, 0xFF0006},
             "R1 Wake on LAN -> ACK tran 4 the (khop khung that 51 byte)")

        r = goi_hoi([(0xFF0001, 0x88, [138, 1]), (0xFF0007, 0x08, 1),
                     (0xFF0006, 0x08, 1102)])
        kiem(r.get(0xFF0008) == 0xFE0004,
             "R2 WPS tren hEX S (khong co WiFi) -> loi 0xfe0004 nhu that")

        # Reboot: tra ACK dung nhu that NHUNG khong duoc dong vao kho
        truoc = goi_hoi([(0xFF0001, 0x88, [24, 1]), (0xFF0007, 0x08, 0xFE000D),
                         (0xFE000C, 0x08, 5), (0xFF0006, 0x08, 1103)]).get(0x00000C)
        r = goi_hoi([(0xFF0001, 0x88, [24]), (0xFF0007, 0x08, 5),
                     (0xFF0006, 0x08, 1104)])
        kiem(set(r) == {0xFF0001, 0xFF0002, 0xFF0003, 0xFF0006},
             "R3 Reboot -> van tra ACK dung hop dong")
        sau = goi_hoi([(0xFF0001, 0x88, [24, 1]), (0xFF0007, 0x08, 0xFE000D),
                       (0xFE000C, 0x08, 5), (0xFF0006, 0x08, 1105)]).get(0x00000C)
        kiem(truoc == sau and sau is not None,
             "R4 Reboot KHONG dong vao kho — hoc vien bam nham khong mat gi",
             f"{truoc!r} -> {sau!r}")

        print("\n--- Q. Terminal [76] ---")
        # Dau ra KHONG nam trong khung tra loi — thiet bi DAY ve tren [76]
        # qua kenh cho dai. Phai mo phien thu hai de doc kenh do.
        priv3 = os.urandom(32)
        _, tl3 = dang("/jsproxy", b"\x00" * 8 + mat_ma.khoa_cong(priv3))
        phien3 = int.from_bytes(tl3[:4], "big")
        master3 = mat_ma.bi_mat_chung(priv3, tl3[8:40])
        tx3 = mat_ma.RC4(mat_ma.dan_xuat_khoa(master3, True, False))
        rx3 = mat_ma.RC4(mat_ma.dan_xuat_khoa(master3, False, False))
        seq3 = [1]

        def goi3(the_ds):
            nd = m2.dung_than(the_ds, magic=True)
            than = tx3.xor(nd + mat_ma.DEM)
            b = phien3.to_bytes(4, "big") + seq3[0].to_bytes(4, "big") + than
            seq3[0] += len(than)
            _, tl_ = dang("/jsproxy", b)
            ro_ = rx3.xor(tl_[8:])
            return {a: c for a, b2, c in m2.giai_ma_than(ro_[:-8])["the"]}

        r = goi3([(0xFF0001, 0x88, [76]), (0xFF0007, 0x08, 0xA0065),
                  (0x000007, 0x21, b"vt102"), (0x000005, 0x08, 100),
                  (0x000006, 0x08, 30), (0xFF0006, 0x08, 1001)])
        kiem(r.get(0xFE0001) is not None,
             "Q1 mo Terminal -> ACK co ufe0001 = id terminal")

        # doc kenh cho dai de lay banner
        r = goi3([(0xFF0006, 0x08, 1002)])
        ra = r.get(0x000002) or b""
        kiem(list(r.get(0xFF0002) or []) == [76] and b"FPT RouterOS" in ra,
             "Q2 banner THAT day ve tren duong dan [76]",
             f"{len(ra)} byte")

        def go_lenh(chu, sh):
            goi3([(0xFF0001, 0x88, [76]), (0xFF0007, 0x08, 0xA0067),
                  (0x000002, 0x30, chu), (0x000003, 0x08, 0),
                  (0xFE0001, 0x09, 0), (0xFF0006, 0x08, sh)])
            return (goi3([(0xFF0006, 0x08, sh + 1)]).get(0x000002) or b"")

        ra = go_lenh(b"/system identity print\r", 1010)
        kiem(b"name: FPT" in ra,
             "Q3 go '/system identity print' -> ket qua THAT cua thiet bi",
             repr(ra[-60:]))

        ra = go_lenh(b"/ip address print\r", 1020)
        kiem(b"192.168.1.1/24" in ra and b"bridge-LAN" in ra,
             "Q4 go '/ip address print' -> dung bang dia chi that")

        ra = go_lenh(b"/lenh-khong-co\r", 1030)
        kiem(b"bad command name" in ra,
             "Q5 lenh la -> thong bao loi THAT cua RouterOS, khong bia",
             repr(ra[:60]))

        # 9 lenh CHI DOC da do that — moi lenh phai ra dung dau van cua no
        moc = [(b"/system resource print", b"version: 7.14.3", 1050),
               (b"/ip route print", b"DST-ADDRESS", 1060),
               (b"/interface ethernet print", b"MAC-ADDRESS", 1070),
               (b"/ip arp print", b"MAC-ADDRESS", 1080),
               (b"/ip dhcp-server lease print", b"ADDRESS", 1090),
               (b"/user print", b"admin", 1100)]
        sai = []
        for cau, dau_van, sh in moc:
            ra = go_lenh(cau + b"\r", sh)
            if dau_van not in ra:
                sai.append(cau.decode())
        kiem(not sai, f"Q7 {len(moc)} lenh chi doc deu ra dung dau van THAT",
             ", ".join(sai))

        r = goi3([(0xFF0001, 0x88, [76]), (0xFF0007, 0x08, 0xA0066),
                  (0xFE0001, 0x09, 0), (0xFF0006, 0x08, 1040)])
        kiem(set(r) == {0xFF0001, 0xFF0002, 0xFF0003, 0xFF0006},
             "Q6 dong Terminal -> ACK tran 4 the")

        print("\n--- P. Cong cu chay truc tiep: Ping [22] ---")
        # Vong doi do that: start -> ACK+id; getall kem id -> mot dong + con
        # tro; hoi tiep bang con tro; cancel -> ACK; id cu thanh vo hieu.

        r = goi_hoi([(0xFF0001, 0x88, [22]), (0xFF0007, 0x08, 0xFE000F),
                     (0x000001, 0x08, 2130706433), (0xFF0006, 0x08, 950)])
        ma_tv = r.get(0xFE0001)
        kiem(ma_tv is not None,
             "P1 bam Start -> ACK co ufe0001 = id phien truy van", f"id={ma_tv}")

        dong, con_tro, so_lan = [], None, 0
        for _ in range(20):
            the_p = [(0xFF0001, 0x88, [22]), (0xFF0007, 0x08, 0xFE0004),
                     (0xFE000C, 0x08, 5), (0xFE0001, 0x09, ma_tv),
                     (0xFF0006, 0x08, 951 + so_lan)]
            if con_tro is not None:
                the_p.append((0xFE0003, 0x08, con_tro))
            rp = goi_hoi(the_p)
            so_lan += 1
            dong += (rp.get(0xFE0002) or [])
            con_tro = rp.get(0xFE0003)
            if con_tro is None:
                break
        kiem(len(dong) == 6 and so_lan == 7,
             f"P2 nhan du 6 dong ket qua THAT roi dung ({so_lan} lan hoi)",
             f"{len(dong)} dong / {so_lan} lan")

        d0 = {a: c for a, b, c in dong[0]["the"]} if dong else {}
        kiem(d0.get(0x000068) == b"0 of 1 packets received",
             "P3 dong dau la ket qua THAT cua thiet bi", f"{d0.get(0x000068)!r}")
        d5 = {a: c for a, b, c in dong[-1]["the"]} if dong else {}
        kiem(d5.get(0x00000F) == 5 and d5.get(0x000068) == b"0 of 6 packets received",
             "P4 dong cuoi co so thu tu 5 va dem duoc 6 goi",
             f"seq={d5.get(0x00000F)}, {d5.get(0x000068)!r}")

        # P2b — cac cong cu chay theo NHIP AUTOREFRESH (khong con tro):
        # Traceroute, Profile, Torch. May khach hoi lai bang cung id, khong
        # kem con tro; may chu phai tra khung TIEP THEO chu khong lap lai.
        def chay_cong_cu(dd, start, cancel, truong, so_lan, sh):
            r_ = goi_hoi([(0xFF0001, 0x88, dd), (0xFF0007, 0x08, start)]
                         + truong + [(0xFF0006, 0x08, sh)])
            ma_ = r_.get(0xFE0001)
            tong = 0
            for k in range(so_lan):
                rr = goi_hoi([(0xFF0001, 0x88, dd), (0xFF0007, 0x08, 0xFE0004),
                              (0xFE000C, 0x08, 5), (0xFE0001, 0x09, ma_ or 0),
                              (0xFF0006, 0x08, sh + 1 + k)])
                tong += len(rr.get(0xFE0002) or [])
            goi_hoi([(0xFF0001, 0x88, dd), (0xFF0007, 0x08, cancel),
                     (0xFE0001, 0x09, ma_ or 0), (0xFF0006, 0x08, sh + 90)])
            return tong

        n_tr = chay_cong_cu([26], 0xFE000F, 0xFE0011,
                            [(0x000001, 0x08, 2130706433)], 8, 1200)
        kiem(n_tr == 31, f"P7 Traceroute phat lai du 31 dong THAT ({n_tr})")
        n_pf = chay_cong_cu([49], 0xFE000F, 0xFE0011, [], 6, 1220)
        kiem(n_pf == 45, f"P8 Profile phat lai du 45 dong THAT ({n_pf})")
        n_to = chay_cong_cu([45, 5], 0x1, 0x2, [(0x000001, 0x08, 8)], 8, 1240)
        kiem(n_to == 14, f"P9 Torch phat lai du 14 dong THAT ({n_to})")

        # S — MOT duong dan, HAI kieu khung tuy lenh hoi.
        #
        # `[24,2]` hoi kieu ITEM (0xfe000d) -> thong tin may; hoi kieu MAP
        # (0xfe0004) -> 4 dong cpu0..cpu3. Do la nguon cua o chon CPU o trang
        # Tools >> Profile. Truoc 2026-08-27 bo giai lap chi co ban ITEM nen
        # o chon chi hien `all total` thay vi `all cpu0 cpu1 cpu2 cpu3 total`.
        #
        # Bo kiem may chu KHONG the tu tim ra loi nay (khung item van dung
        # tuyet doi) — chinh bo doi chieu GIAO DIEN moi thay.
        r = goi_hoi([(0xFF0001, 0x88, [24, 2]), (0xFF0007, 0x08, 0xFE0004),
                     (0xFE000C, 0x08, 5), (0xFF0006, 0x08, 1500)])
        dong_cpu = r.get(0xFE0002) or []
        ten_cpu = [{a: c for a, b, c in d["the"]}.get(0xFE0010) for d in dong_cpu]
        kiem(ten_cpu == [b"cpu0", b"cpu1", b"cpu2", b"cpu3"],
             "S1 [24,2] hoi kieu MAP -> 4 dong cpu0..cpu3 (nguon o chon CPU)",
             f"{ten_cpu}")

        r = goi_hoi([(0xFF0001, 0x88, [24, 2]), (0xFF0007, 0x08, 0xFE000D),
                     (0xFE000C, 0x08, 5), (0xFF0006, 0x08, 1502)])
        kiem(r.get(0x000019) == b"RB760iGS" and not r.get(0xFE0002),
             "S2 cung duong dan hoi kieu ITEM -> van la thong tin may, khong doi",
             f"{r.get(0x000019)!r}")

        # P11 — IP Scan [101,1]. Do that 2026-08-27 tren dai 192.168.1.0/24,
        # giao dien bridge-LAN. Kiem bang NOI DUNG chu khong chi dem dong:
        # dia chi trong khung THAT la 192.168.1.1 ma hoa **LITTLE-ENDIAN**
        # (01 01 A8 C0 = 16885952). Neu ai do doi sang big-endian thi phep
        # kiem nay bao ngay, con phep dem dong thi khong.
        def dong_cua(dd, start, cancel, truong, so_lan, sh):
            r_ = goi_hoi([(0xFF0001, 0x88, dd), (0xFF0007, 0x08, start)]
                         + truong + [(0xFF0006, 0x08, sh)])
            ma_ = r_.get(0xFE0001)
            ra = []
            for k in range(so_lan):
                rr = goi_hoi([(0xFF0001, 0x88, dd), (0xFF0007, 0x08, 0xFE0004),
                              (0xFE000C, 0x08, 5), (0xFE0001, 0x09, ma_ or 0),
                              (0xFF0006, 0x08, sh + 1 + k)])
                ra += (rr.get(0xFE0002) or [])
            goi_hoi([(0xFF0001, 0x88, dd), (0xFF0007, 0x08, cancel),
                     (0xFE0001, 0x09, ma_ or 0), (0xFF0006, 0x08, sh + 90)])
            return ra

        ds_ip = dong_cua([101, 1], 0x1, 0x2,
                         [(0x000001, 0x08, 8),
                          (0x000002, 0x08, 108736),        # 192.168.1.0   LE
                          (0x000003, 0x08, 4278298816)],   # 192.168.1.255 LE
                         6, 1350)
        dia_chi = [{a: c for a, b, c in d["the"]}.get(0x000001) for d in ds_ip]
        kiem(dia_chi and all(x == 16885952 for x in dia_chi),
             f"P11 IP Scan phat lai dia chi THAT 192.168.1.1 (LE) — {len(ds_ip)} dong",
             f"{dia_chi}")

        # P12 — PPPoE Scan [27,15] tren ether1. Thiet bi that KHONG tim thay
        # AC nao (cong WAN luc do khong co may chu PPPoE), nen 13 khung deu
        # RONG. Day la ket qua that, khong duoc "che" them dong cho dep.
        ds_pp = dong_cua([27, 15], 0xFE000F, 0xFE0011,
                         [(0x000001, 0x08, 2)], 13, 1370)
        kiem(ds_pp == [],
             f"P12 PPPoE Scan tren ether1 tra ve RONG dung nhu thiet bi that",
             f"{len(ds_pp)} dong")

        # P10 — cong cu thiet bi TU CHOI thi phai tra dung loi that, KHONG
        # duoc tra ACK gia. Truoc 2026-08-25 bo giai lap tra ACK cho MOI cong
        # cu — tuc bao "chay duoc" trong khi thiet bi that tu choi.
        tu_choi = [([138, 2], 0xFE000F, 0xFE0004, None, 1300),
                   ([20, 61], 0xFE000F, 0xFE0004, None, 1310),
                   ([135, 8], 0xFE000F, 0xFE0005, b"required parametrs missing", 1320),
                   ([127, 4], 0xFE000F, 0xFE0006, b"RoMON not running", 1330)]
        sai_tc = []
        for dd, st, ma_mong, mo_mong, sh in tu_choi:
            rr = goi_hoi([(0xFF0001, 0x88, dd), (0xFF0007, 0x08, st),
                          (0xFF0006, 0x08, sh)])
            if rr.get(0xFF0008) != ma_mong or rr.get(0xFF0009) != mo_mong:
                sai_tc.append(f"{dd}: {rr.get(0xFF0008)}/{rr.get(0xFF0009)!r}")
        kiem(not sai_tc,
             "P10 cong cu thiet bi tu choi -> tra dung ma loi + mo ta THAT",
             "; ".join(sai_tc))

        r = goi_hoi([(0xFF0001, 0x88, [22]), (0xFF0007, 0x08, 0xFE0011),
                     (0xFE0001, 0x09, ma_tv), (0xFF0006, 0x08, 980)])
        kiem(set(r) == {0xFF0001, 0xFF0002, 0xFF0003, 0xFF0006},
             "P5 bam Stop -> ACK tran 4 the (khop khung that 51 byte)")

        r = goi_hoi([(0xFF0001, 0x88, [22]), (0xFF0007, 0x08, 0xFE0004),
                     (0xFE000C, 0x08, 5), (0xFE0001, 0x09, ma_tv),
                     (0xFF0006, 0x08, 981)])
        kiem(r.get(0xFF0008) == 0xFE0004,
             "P6 dung id da huy -> loi 0xfe0004, giong het thiet bi that")

        print("\n--- N. Doi thu tu dong + khung LOI (do that 2026-08-25) ---")
        # Dung [14,3] DNS Static — bang CO THU TU, tren thiet bi that dang rong

        def them_dns(ten, ip, sh):
            return goi_hoi([(0xFF0001, 0x88, [14, 3]), (0xFF0007, 0x08, 0xFE0005),
                            (0x000001, 0x21, ten), (0x000017, 0x08, 1),
                            (0x000005, 0x08, ip), (0xFF0006, 0x08, sh)])

        def doc_dns(sh):
            r_ = goi_hoi([(0xFF0001, 0x88, [14, 3]), (0xFF0007, 0x08, 0xFE0004),
                          (0xFE000C, 0x08, 5), (0xFF0006, 0x08, sh)])
            return [next(v for t, k, v in m["the"] if t == 0xFE0001)
                    for m in (r_.get(0xFE0002) or [])]

        ra = them_dns(b"a.kiem.invalid", 3405803786, 901)
        rb = them_dns(b"b.kiem.invalid", 3405803787, 902)
        ia, ib = ra.get(0xFE0001), rb.get(0xFE0001)
        kiem(doc_dns(903) == [ia, ib], f"N1 them 2 dong, thu tu ban dau [{ia}, {ib}]")

        # dua dong thu hai LEN TRUOC dong thu nhat: ufe0005 = id dong ke sau
        r = goi_hoi([(0xFF0001, 0x88, [14, 3]), (0xFF0007, 0x08, 0xFE0007),
                     (0xFE0001, 0x09, ib), (0xFE0005, 0x08, ia),
                     (0xFF0006, 0x08, 904)])
        kiem(set(r) == {0xFF0001, 0xFF0002, 0xFF0003, 0xFF0006},
             "N2 doi cho -> ACK tran 4 the (khop khung that 55 byte)")
        kiem(doc_dns(905) == [ib, ia], f"N3 thu tu da doi thanh [{ib}, {ia}]")

        # dua xuong CUOI: ufe0005 = 0xffffffff
        goi_hoi([(0xFF0001, 0x88, [14, 3]), (0xFF0007, 0x08, 0xFE0007),
                 (0xFE0001, 0x09, ib), (0xFE0005, 0x08, 0xFFFFFFFF),
                 (0xFF0006, 0x08, 906)])
        kiem(doc_dns(907) == [ia, ib],
             "N4 ufe0005 = 0xffffffff dua dong xuong CUOI")

        # KHUNG LOI — do that: sua/xoa mot id khong ton tai
        r = goi_hoi([(0xFF0001, 0x88, [14, 3]), (0xFF0007, 0x08, 0xFE0003),
                     (0xFE0001, 0x08, 9999), (0x000001, 0x21, b"x"),
                     (0xFF0006, 0x08, 908)])
        kiem(r.get(0xFF0008) == 0xFE0004 and r.get(0xFF0004) == 2,
             "N5 sua id khong co -> uff0008 = 0xfe0004, co ca the uff0004 = 2",
             f"loi={r.get(0xFF0008)}, ff0004={r.get(0xFF0004)}")
        r = goi_hoi([(0xFF0001, 0x88, [14, 3]), (0xFF0007, 0x08, 0xFE0006),
                     (0xFE0001, 0x08, 9999), (0xFF0006, 0x08, 909)])
        kiem(r.get(0xFF0008) == 0xFE0004,
             "N6 xoa id khong co -> cung ma loi 0xfe0004")

        # don sach
        for i, (mm, sh) in enumerate([(ia, 910), (ib, 911)]):
            goi_hoi([(0xFF0001, 0x88, [14, 3]), (0xFF0007, 0x08, 0xFE0006),
                     (0xFE0001, 0x09, mm), (0xFF0006, 0x08, sh)])
        kiem(doc_dns(912) == [], "N7 don sach: bang DNS Static rong tro lai")

        print("\n--- M. MUC 4: phien KHAC nhan duoc goi DAY ---")
        # Day moi la loi cua muc 4: mot trang dang mo phai tu doi khi trang
        # khac ghi. Do that o B_identity_set__day0.bin.
        priv2 = os.urandom(32)
        ma2, tl2 = dang("/jsproxy", b"\x00" * 8 + mat_ma.khoa_cong(priv2))
        phien2 = int.from_bytes(tl2[:4], "big")
        master2 = mat_ma.bi_mat_chung(priv2, tl2[8:40])
        tx2 = mat_ma.RC4(mat_ma.dan_xuat_khoa(master2, True, False))
        rx2 = mat_ma.RC4(mat_ma.dan_xuat_khoa(master2, False, False))
        seq2 = [1]

        def goi2_tho(the_ds):
            nd = m2.dung_than(the_ds, magic=True)
            than = tx2.xor(nd + mat_ma.DEM)
            b = phien2.to_bytes(4, "big") + seq2[0].to_bytes(4, "big") + than
            seq2[0] += len(than)
            return b

        kiem(phien2 != ma_phien, f"M1 mo duoc phien thu hai (id {phien2})")

        # phien 2 DANG KY [24,1]
        _, t2 = dang("/jsproxy", goi2_tho(
            [(0xFF0001, 0x88, [24, 1]), (0xFF0007, 0x08, 0xFE0012),
             (0xFF0006, 0x08, 801)]))
        rx2.xor(t2[8:])
        kiem(True, "M2 phien 2 da dang ky (subscribe) duong dan [24,1]")

        ket = {}

        def cho_day():
            _, tl3 = dang("/jsproxy", goi2_tho([(0xFF0006, 0x08, 802)]))
            ro3 = rx2.xor(tl3[8:])
            ket["the"] = {a: c for a, b, c in m2.giai_ma_than(ro3[:-8])["the"]}

        th = threading.Thread(target=cho_day, daemon=True)
        th.start()
        time.sleep(1.0)          # de kenh cho dai kip treo

        # phien 1 GHI
        goi_hoi([(0xFF0001, 0x88, [24, 1]), (0xFF0007, 0x08, 0xFE000E),
             (0x00000C, 0x21, b"DOI-TU-PHIEN-1"), (0xFF0006, 0x08, 709)])
        th.join(timeout=15)

        d = ket.get("the", {})
        kiem(d.get(0xFF0002) == [24, 1],
             "M3 phien 2 nhan duoc goi DAY, dung duong dan [24,1]",
             f"{[hex(x) for x in d]}")
        kiem(d.get(0x00000C) == b"DOI-TU-PHIEN-1",
             "M4 goi DAY mang GIA TRI MOI — trang khac se tu cap nhat",
             f"{d.get(0x00000C)!r}")
        kiem(d.get(0xFF0001) == [phien2],
             "M5 Uff0001 trong goi day = id PHIEN NHAN (khop khung that)")

        print("\n--- K. Phan trang tren day: dung 5 trang roi DUNG ---")
        # Bat chuoc dung ObjectMap.getall: gui getall, neu tra ve co 0xfe0003
        # thi gui lai KEM the do. Phai het sau dung so trang, khong duoc quay
        # vong. Day la phep do HANH VI, khac nhom J (chi doc tep).
        def mot_vong(the_ds):
            g = dong_goi(the_ds)
            _, tl_ = dang("/jsproxy", g)
            ro_ = rx.xor(tl_[8:])
            return {a: c for a, b, c in m2.giai_ma_than(ro_[:-8])["the"]}

        req_k = [(0xFF0001, 0x88, [17]), (0xFF0007, 0x08, 0xFE0004),
                 (0xFE000C, 0x08, 5), (0xFF0006, 0x08, 900)]
        so_trang, con_tro, qua_nhieu = 0, None, False
        for _ in range(30):
            the_k = list(req_k) + ([(0xFE0003, 0x08, con_tro)] if con_tro is not None else [])
            r = mot_vong(the_k)
            so_trang += 1
            con_tro = r.get(0xFE0003)
            if con_tro is None:
                break
        else:
            qua_nhieu = True
        kiem(not qua_nhieu and so_trang == 5,
             f"K1 [17] History het sau {so_trang} trang (mong 5), khong lap vo han")
        # xin lai tu dau (khong kem con tro) phai quay ve trang 1
        r0 = mot_vong(req_k)
        kiem(r0.get(0xFE0003) is not None,
             "K2 xin lai khong kem con tro -> tra ve trang dau (co con tro)")
        # nap lai cho het day trang de khong lam hong cac phep kiem sau
        ct = r0.get(0xFE0003)
        while ct is not None:
            ct = mot_vong(list(req_k) + [(0xFE0003, 0x08, ct)]).get(0xFE0003)

        print("\n--- I. Kho khung that: giai duoc + dung duong dan ---")
        # VI SAO CO NHOM NAY (2026-08-24): khi thu hang loat qua trinh duyet,
        # neu bo bat khong loc dung goi CUA MINH thi de luu nham khung cua
        # yeu cau khac (vi du bang Interface tu lam moi). Trieu chung am tham:
        # tep co ten [20,42] nhung ben trong lai la tra loi cua [20,0].
        # Phep kiem nay do THANG vao noi dung: the 0xff0002 (duong dan tra ve)
        # phai trung ten tep. Rieng khung LOI (0xff0008) thi thiet bi that tra
        # ve duong dan CHA — do la hanh vi that, chap nhan.
        goc_kho = os.path.join(_GOC, "src", "du_lieu_goc")
        n_ok = n_loi_tb = 0
        hong_giai, hong_dd = [], []
        for ten in sorted(os.listdir(goc_kho)):
            if not ten.endswith(".bin"):
                continue
            # Ten tep co 3 dang: `<dd>.bin`, `<dd>__p<N>.bin`, `<dd>__map.bin`.
            # Cat phan hau to `__...` roi moi tach duong dan.
            can = [int(x) for x in ten[:-4].split("__")[0].split("-")]
            try:
                the_kho = m2.giai_ma(open(os.path.join(goc_kho, ten), "rb").read())["the"]
            except Exception as e:
                hong_giai.append(f"{ten}: {e!r}")
                continue
            d = {a: c for a, b, c in the_kho}
            if d.get(0xFF0008) is not None:
                n_loi_tb += 1
            elif list(d.get(0xFF0002) or []) != can:
                hong_dd.append(f"{ten} -> {d.get(0xFF0002)}")
            else:
                n_ok += 1
        kiem(not hong_giai, f"I1 moi khung trong kho giai ma duoc ({n_ok + n_loi_tb + len(hong_dd)} tep)",
             "; ".join(hong_giai[:3]))
        kiem(not hong_dd,
             f"I2 duong dan tra ve trung ten tep ({n_ok} khung du lieu, "
             f"{n_loi_tb} khung thiet bi bao 'chua ho tro')",
             "; ".join(hong_dd[:5]))

        print("\n--- U. Tai nguyen tinh: moi anh duoc GOI deu phai CO tren dia ---")
        # ANH HUYNN BAT LOI NAY 2026-08-28, khong phai bo kiem nao.
        # Trang IP >> Cloud tren ban gia lap hien BIEU TUONG ANH VO o cho thiet
        # bi that ve tam giac muc luc (down.svg) va mui ten mo/dong (up.svg).
        #
        # Goc: dot crawl GD1 chi lay nhung tep MA TRANG DANG MO luc do yeu cau.
        # 13 tep .svg + 2 tep icons24/32.png chi duoc goi trong MOT SO trang
        # nen khong bao gio bi tai -> khong bao gio duoc luu.
        #
        # VI SAO CA HAI LOP KIEM CU DEU MU:
        #   - kiem_may_chu.py chi do khung nhi phan, khong biet gi ve tep tinh
        #   - doi_chieu_giao_dien.py chi so NHAN + TIEU DE COT; anh vo khong
        #     lam doi chu nao nen no bao "0 lech"
        # Day dung la lo hong ma CLAUDE.md muc 5.5 canh bao: ket luan "giong
        # nhau" tu mot phep do KHONG nhin vao thu can nhin.
        #
        # Phep kiem nay quet MOI tham chieu anh trong .jg/.css/.js/.html cua
        # chinh ban goc, roi doi chieu voi dia. Re, chay ngoai mang, va bat
        # duoc ngay lan sau ai do them tep .jg moi.
        import re as _re
        goc_www = os.path.join(_GOC, "src", "www")
        co_tep = set(os.listdir(goc_www)) | set(os.listdir(os.path.join(goc_www, "webfig")))
        _MAU = _re.compile(r"""['"(]([\w][\w./-]*\.(?:svg|png|gif|jpg|ico))['")]""")
        goi = {}
        for thu_muc, ds in ((os.path.join(goc_www, "webfig"),
                             os.listdir(os.path.join(goc_www, "webfig"))),
                            (goc_www, ["index.html", "script.js"])):
            for ten in ds:
                if not ten.endswith((".jg", ".css", ".js", ".html")):
                    continue
                noi_dung = open(os.path.join(thu_muc, ten), encoding="utf-8",
                                errors="ignore").read()
                for m in set(_MAU.findall(noi_dung)):
                    goi.setdefault(m.split("/")[-1], set()).add(ten)
        thieu = sorted(k for k in goi if k not in co_tep)
        kiem(not thieu,
             f"U1 {len(goi)} anh duoc ma goc goi -> tat ca deu co trong src/www",
             f"THIEU: {thieu}")

        # U2 — moi tep tinh phai TRUNG SHA256 voi ban trong reference/.
        # src/www la ban SAO của bang chung goc, khong duoc phep khac mot byte.
        import hashlib as _hl
        _sha = lambda p: _hl.sha256(open(p, "rb").read()).hexdigest()
        lech_sha = []
        for tm_src, tm_ref in ((os.path.join(goc_www, "webfig"),
                                os.path.join(_GOC, "reference", "webfig")),
                               (goc_www, os.path.join(_GOC, "reference", "root"))):
            for ten in os.listdir(tm_src):
                p_src, p_ref = os.path.join(tm_src, ten), os.path.join(tm_ref, ten)
                if os.path.isfile(p_src) and os.path.isfile(p_ref):
                    if _sha(p_src) != _sha(p_ref):
                        lech_sha.append(ten)
        kiem(not lech_sha,
             "U2 tai nguyen tinh trong src/www trung sha256 voi reference/",
             f"LECH: {lech_sha}")

        # U3 — moi DUONG DAN NOI BO ma master-min.js goi phai co cau tra loi.
        # Mo rong tu U1: khong chi anh. Menu ☰ cua WebFig co 8 muc, hai trong
        # so do (`/graphs`, `/help/license.html`) tro toi TRANG RIENG chu khong
        # phai SPA — dot crawl GD1 khong he cham toi vi chua ai bam vao menu do.
        #
        # Do that tren hEX S 2026-08-28:
        #   /graphs            200 text/html  225 byte   (trang do thi)
        #   /help/license.html 200 text/html  17890 byte (EULA cua MikroTik)
        #   /graph.css         200 text/css   708 byte   (do /graphs goi)
        #   /files/            403                        <- KHONG phai 404
        #   /logo.png /webfig /webfig/list /jsproxy       da phuc vu tu truoc
        js = open(os.path.join(goc_www, "webfig",
                               "master-min-99e951c770b2.js"),
                  encoding="utf-8", errors="ignore").read()
        dd_noi_bo = set(_re.findall(r"""["'](/[\w][\w./-]*)["']""", js))
        # `/jsproxy` va `/webfig*` do do_POST / do_GET xu ly rieng, khong phai tep
        bo_qua_dd = {"/jsproxy", "/webfig", "/webfig/list", "/files/"}
        thieu_dd = []
        for d in sorted(dd_noi_bo - bo_qua_dd):
            ten_tep = {"/graphs": "graphs.html"}.get(d, d.lstrip("/"))
            if not os.path.isfile(os.path.join(goc_www, ten_tep)):
                thieu_dd.append(d)
        kiem(not thieu_dd,
             f"U3 {len(dd_noi_bo)} duong dan noi bo trong master-min.js -> "
             f"deu co tep phuc vu",
             f"THIEU: {thieu_dd}")

        print("\n--- T. Cong cu ACTION + wizard (do that 2026-08-28) ---")
        # Cong cu kieu ACTION khac cong cu kieu QUERY o cho no hoi tien do bang
        # `pollcmd` RIENG, khong phai getall 0xfe0004. Lenh lay tu dac ta .jg:
        #   [24,25] start 0xFE000F poll 0xFE0010 cancel 0xFE0011
        #   [29] va [29,2] start 2 poll 1 cancel 3
        #   [27,53] start 401 poll 403 cancel 402
        def chay_action(dd, start, poll, cancel, so_lan, sh):
            r_ = goi_hoi([(0xFF0001, 0x88, dd), (0xFF0007, 0x08, start),
                          (0xFF0006, 0x08, sh)])
            ma_ = r_.get(0xFE0001)
            ra = []
            for k in range(so_lan):
                ra.append(goi_hoi([(0xFF0001, 0x88, dd), (0xFF0007, 0x08, poll),
                                   (0xFE0001, 0x09, ma_ or 0),
                                   (0xFF0006, 0x08, sh + 1 + k)]))
            goi_hoi([(0xFF0001, 0x88, dd), (0xFF0007, 0x08, cancel),
                     (0xFE0001, 0x09, ma_ or 0), (0xFF0006, 0x08, sh + 90)])
            return ma_, ra

        # T1 — Make Supout.rif: tien do phai TANG DAN toi 100 va khung cuoi
        # phai bat co XONG (0xfe000b = True). Do that: 0,2,6,...,45,100.
        _, day = chay_action([24, 25], 0xFE000F, 0xFE0010, 0xFE0011, 26, 1600)
        tien_do = [d.get(0x000001) for d in day if d.get(0x000001) is not None]
        xong = [d.get(0xFE000B) for d in day if d.get(0xFE000B) is not None]
        kiem(tien_do and tien_do[0] == 0 and tien_do[-1] == 100
             and tien_do == sorted(tien_do) and xong[-1] is True,
             f"T1 Supout.rif tien do {tien_do[0]}->{tien_do[-1]}% tang dan, "
             f"khung cuoi co co XONG",
             f"tien_do={tien_do[:6]}...{tien_do[-3:]} xong_cuoi={xong[-1] if xong else None}")

        # T2 — Bandwidth Test: thiet bi that TU CHOI ("can't connect", vi may
        # chu btest tat mac dinh tren ROS7). Dia chi 192.168.1.1 phai giu dung
        # ma hoa LITTLE-ENDIAN 16885952 — cung phep do nhu P11.
        _, day = chay_action([29], 2, 1, 3, 2, 1650)
        co_dc = [d.get(0x00001E) for d in day if d.get(0x00001E) is not None]
        kiem(co_dc and co_dc[0] == 16885952,
             "T2 Bandwidth Test giu dia chi that 192.168.1.1 (little-endian)",
             f"{co_dc}")

        # T3 — Speed Test: pha 'ping' co that, KHONG duoc bia so. Doi chieu
        # dung chuoi thiet bi tra ve.
        _, day = chay_action([29, 2], 2, 1, 3, 6, 1700)
        pha = [d.get(0x000046) for d in day if d.get(0x000046)]
        png = [d.get(0x000047) for d in day if d.get(0x000047)]
        kiem(pha and all(p == b"ping" for p in pha)
             and b"382us / 427us / 800us" in png,
             f"T3 Speed Test phat lai pha 'ping' + so do THAT ({len(png)} mau)",
             f"pha={set(pha)} png_cuoi={png[-1] if png else None!r}")

        # T4 — Import .ovpn khong chon tep: thiet bi tra dung chuoi
        # 'config file is empty' o truong 0x194. Neu ai do bia thanh 'OK' thi
        # phep kiem nay bao ngay.
        _, day = chay_action([27, 53], 401, 403, 402, 2, 1750)
        tb = [d.get(0x000194) for d in day if d.get(0x000194)]
        kiem(tb and tb[0] == b"config file is empty",
             "T4 Import .ovpn (khong co tep) -> 'config file is empty'",
             f"{tb}")

        # T5 — PHUC HOI 2026-08-28 (dot 3). Truoc do phep kiem nay bi RUT vi em
        # do duoc khung that roi XOA NHAM chinh tep bang chung, khong bat lai
        # duoc trong phien ay. Nay da thu lai tren thiet bi that:
        # Tools >> Traffic Generator >> Quick Start >> Start, khi router chua
        # dinh nghia stream nao. Bang chung: reference/khung_query_loi/119-1.bin
        #
        # Dac ta .jg (roteros): Quick Start la type:'query' voi
        # startcmd=1 cancelcmd=2 — em suyt dien 0xfe000f theo thoi quen, phai
        # tra .jg moi ra dung. Cung bai hoc nhu [77] ngay trong cung buoi.
        r5 = goi_hoi([(0xFF0001, 0x88, [119, 1]), (0xFF0007, 0x08, 1),
                      (0xFF0006, 0x08, 1880)])
        kiem(r5.get(0xFF0008) == 0xFE0006
             and r5.get(0xFF0009) == b"no streams defined",
             "T5 [119,1] Quick Start -> loi THAT 'no streams defined' (0xfe0006)",
             f"ma={hex(r5.get(0xFF0008)) if r5.get(0xFF0008) else None} "
             f"mo_ta={r5.get(0xFF0009)!r}")

        # T6 — Wizard Hotspot Setup [63]: moi lan hoi tra ve BUOC KE TIEP,
        # the 0xfe000e = so buoc, 0xfe000f = trang thai CONG DON.
        #
        # BAI HOC 2026-08-28: ban dau em viet ky vong [2,3,4,5,5,4,6,7,8,9]
        # tu tri nho, khong tu so do -> phep kiem bao SAI. Day chinh la loi ma
        # CLAUDE.md muc 5b canh bao: KET LUAN TRUOC KHI DO. Day duoi la day
        # DO DUOC tu 12 khung that; buoc 5 lap 3 lan vi em thu 'import other
        # certificate' 3 lan, roi quay lai buoc 4 khi chon 'none'.
        #
        # Em con doan SAI LAN THU HAI ngay trong cung phep kiem nay: viet
        # `len(loi_ssl) == 3` vi thay buoc 5 lap 3 lan. Do that thi chi 2 khung
        # mang chuoi loi (khung buoc 5 dau tien chua co loi). Lan nay em ngoi
        # dem tren tep thay vi nho. Cung mot bai hoc, hai lan trong mot gio.
        buoc, loi_ssl = [], []
        for k in range(12):
            r = goi_hoi([(0xFF0001, 0x88, [63]), (0xFF0006, 0x08, 1800 + k)])
            if r.get(0xFE000E) is not None:
                buoc.append(r[0xFE000E])
            if r.get(0xFF0009):
                loi_ssl.append(r[0xFF0009])
        kiem(buoc == [2, 3, 4, 5, 5, 5, 4, 6, 7, 8, 9]
             and len(loi_ssl) == 2
             and all(b"decrypted private key" in x for x in loi_ssl),
             f"T6 wizard [63] phat lai dung {len(buoc)} buoc that "
             f"+ 2 khung loi SSL that",
             f"buoc={buoc} loi={len(loi_ssl)}")

        # T7 — Ping Speed [77]: do that 2026-08-28 tren thiet bi (dia chi
        # 127.0.0.1). Dac ta .jg advtool: startcmd=2 pollcmd=1 cancelcmd=3 —
        # KHONG phai 0xfe000f/10/11 mac dinh. Moi khung poll mang u1(Current)
        # + u2(Average) bitrate; ping loopback nen ca hai deu 0.
        _, day = chay_action([77], 2, 1, 3, 11, 1900)
        cur = [d.get(0x000001) for d in day if 0x000001 in d]
        avg = [d.get(0x000002) for d in day if 0x000002 in d]
        kiem(len(cur) == 10 and len(avg) == 10
             and all(x == 0 for x in cur) and all(x == 0 for x in avg),
             f"T7 Ping Speed phat lai {len(cur)} khung u1/u2 THAT (ping loopback = 0 bps)",
             f"cur={cur[:4]} avg={avg[:4]}")

        # T8 — LECH MOT NHIP: khung ACK Start nam trong kho KHONG duoc phat
        # lai o lan poll dau. Do that 2026-08-28: tren thiet bi that, Start
        # tra ACK roi poll DAU TIEN da co du lieu. Bo giai lap TU SINH ACK,
        # nen neu poll cung bat dau tu g0 thi may khach nhan ACK hai lan.
        # Loi nay tung dinh CA 7 cong cu (Supout, Traceroute, Bandwidth,
        # Speed Test, Torch, Profile, Ping Speed) — xem _bo_qua_ack_dau().
        # Kiem tren CA 7, khong chi cai vua sua.
        lech = []
        for dd, st, pl, cc in [([24, 25], 0xFE000F, 0xFE0010, 0xFE0011),
                               ([26], 0xFE000F, 0xFE0004, 0xFE0011),
                               ([29], 2, 1, 3), ([29, 2], 2, 1, 3),
                               ([45, 5], 1, 0xFE0004, 2),
                               ([49], 0xFE000F, 0xFE0004, 0xFE0011),
                               ([77], 2, 1, 3)]:
            _, d7 = chay_action(dd, st, pl, cc, 1, 1950 + len(lech) * 7)
            if d7 and 0xFE0001 in d7[0]:
                lech.append(dd)
        kiem(not lech,
             "T8 7 cong cu action/query: poll dau KHONG tra lai ACK (khong lech nhip)",
             f"con lech o: {lech}")

        print("\n--- J. Khong con tro treo -> khong the lap vo han ---")
        # ObjectMap.getall: khung nao con the 0xfe0003 (hoac mfe0015) thi
        # trinh duyet XIN TIEP NGAY. Vay khung CUOI CUNG cua moi duong dan
        # BAT BUOC khong duoc con the do, neu khong tab treo cung.
        # Da vap that 2026-08-25: [17], [3,4], [123,2].
        nhom = {}
        for ten in os.listdir(goc_kho):
            if not ten.endswith(".bin"):
                continue
            g = ten[:-4]
            p, i = (g.split("__p")[0], int(g.split("__p")[1])) if "__p" in g else (g, 0)
            nhom.setdefault(p, {})[i] = ten
        treo = []
        for p, m in sorted(nhom.items()):
            cuoi = m[max(m)]
            d = {a: c for a, b, c in m2.giai_ma(open(os.path.join(goc_kho, cuoi), "rb").read())["the"]}
            if d.get(0xFE0003) is not None or d.get(0xFE0015) is not None:
                treo.append(f"{cuoi} (fe0003={d.get(0xFE0003)})")
        kiem(not treo, f"J1 {len(nhom)} duong dan: trang cuoi khong con con tro",
             "; ".join(treo[:5]))
        # va moi trang GIUA thi PHAI co con tro (neu khong se dut giua chung)
        thieu = []
        for p, m in sorted(nhom.items()):
            for i in sorted(m)[:-1]:
                d = {a: c for a, b, c in m2.giai_ma(open(os.path.join(goc_kho, m[i]), "rb").read())["the"]}
                if d.get(0xFE0003) is None and d.get(0xFE0015) is None:
                    thieu.append(m[i])
        nhieu_trang = sum(1 for m in nhom.values() if len(m) > 1)
        kiem(not thieu, f"J2 {nhieu_trang} duong dan nhieu trang: trang giua deu co con tro",
             "; ".join(thieu[:5]))

        print("\n" + "=" * 66)
        if loi:
            print(f"  KET LUAN: CHUA DAT — {len(loi)}/{so_kiem} phep kiem sai.")
            return 1
        print(f"  KET LUAN: {so_kiem}/{so_kiem} phep kiem DAT.")
        return 0
    finally:
        srv.terminate()
        srv.wait(timeout=5)


if __name__ == "__main__":
    sys.exit(main())
