#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""so_dom — doi chieu DOM giua thiet bi that va ban gia lap.

Day la cong cu nghiem thu muc 2 va muc 3 (CLAUDE.md muc 4.1).
Thay cho viec so anh bang mat, vi mat nguoi bo sot dung nhung thu quan trong nhat:
sai thuoc tinh name, thieu input an, lech thu tu phan tu.

Dau vao: hai file JSON sinh boi tools/van_tay_dom.js
    that.json      chay tren http://192.168.1.1
    gia_lap.json   chay tren http://localhost:8098

Chay:
    python so_dom.py <that.json> <gia_lap.json> [--dungsai 2]

Ma thoat: 0 neu sach loi, 1 neu con lech.
"""
import argparse
import json
import re
import sys
from difflib import SequenceMatcher

RE_TOA_DO = re.compile(r"<(-?\d+),(-?\d+),(\d+),(\d+)>$")

# Truong DONG — gia tri doi theo thoi gian, khac nhau giua hai ben la BINH THUONG.
# Van so cau truc (co mat, dung id, dung trang thai an/hien) nhung BO QUA gia tri.
# Khai bao trung voi TRUONG_DONG trong src/config_store.py.
MAU_DONG = [
    re.compile(r"#CurrentLocalTime\b"),
    re.compile(r"#CCurrentLocalTime\b"),
    re.compile(r"#_DevCurrTime"),          # dong ho tren thanh tieu de
    re.compile(r"#_DevCurrTime_footer"),   # dong ho duoi chan trang
    # giay la TUY CHON: thiet bi hien "1970-01-01T00:29" o thanh tieu de
    # nhung "1970-01-01T00:29:57" trong o du lieu.
    re.compile(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?"),
]

# Ham JS do CHINH CONG CU nay tao ra, khong phai cua thiet bi — phai loai.
HAM_CONG_CU = {"__vt", "vanTayDOM", "guiVanTay", "bam", "vt", "so", "kq"}


def la_dong_dong(mo_ta):
    return any(m.search(mo_ta) for m in MAU_DONG)


def bo_gia_tri_dong(mo_ta):
    """Giu cau truc, thay gia tri thoi gian bang <DONG> de hai ben so duoc.

    Giay la TUY CHON: thanh tieu de hien "1970-01-01T00:29",
    con o du lieu hien "1970-01-01T00:29:57". Regex cu bat buoc co giay
    nen bo sot dong ho o thanh tieu de va chan trang (loi da mac 2026-08-04).
    """
    return re.sub(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?", "<DONG>", mo_ta)


def tach_toa_do(dong):
    m = RE_TOA_DO.search(dong)
    if not m:
        return dong, None
    return dong[: m.start()].rstrip(), tuple(int(x) for x in m.groups())


def lech_toa_do(a, b, dung_sai):
    if a is None or b is None:
        return a != b
    return any(abs(x - y) > dung_sai for x, y in zip(a, b))


def main():
    p = argparse.ArgumentParser()
    p.add_argument("that")
    p.add_argument("gia_lap")
    p.add_argument("--dungsai", type=int, default=2, help="dung sai toa do, pixel")
    p.add_argument("--chitiet", action="store_true")
    p.add_argument("--giu-gia-tri-dong", action="store_true",
                   help="KHONG bo qua gia tri cua truong dong (dong ho, uptime)")
    a = p.parse_args()

    with open(a.that, "r", encoding="utf-8") as f:
        T = json.load(f)
    with open(a.gia_lap, "r", encoding="utf-8") as f:
        G = json.load(f)

    print("=" * 74)
    print("  DOI CHIEU DOM")
    print("  That    : %-28s %s" % (T.get("url"), T.get("khoMan")))
    print("  Gia lap : %-28s %s" % (G.get("url"), G.get("khoMan")))
    print("  Goc     : %s   | dung sai toa do: %dpx" % (T.get("goc"), a.dungsai))
    print("=" * 74)

    if T.get("khoMan") != G.get("khoMan"):
        print("  !! CANH BAO: hai ben khac kho man hinh, so sanh toa do se vo nghia.")

    dt, dg = T.get("dong") or [], G.get("dong") or []
    print("  So phan tu: that %d | gia lap %d" % (len(dt), len(dg)))
    print()

    # tach phan mo ta va toa do de so rieng
    mt = [tach_toa_do(x) for x in dt]
    mg = [tach_toa_do(x) for x in dg]
    kt = [x[0] for x in mt]
    kg = [x[0] for x in mg]

    so_dong_dong = 0
    if not a.giu_gia_tri_dong:
        so_dong_dong = sum(1 for x in kt if la_dong_dong(x))
        kt = [bo_gia_tri_dong(x) for x in kt]
        kg = [bo_gia_tri_dong(x) for x in kg]
        if so_dong_dong:
            print("  Bo qua gia tri cua %d truong dong (dong ho) — van so cau truc." % so_dong_dong)
            print()

    thieu, thua, lech_vt, khop = [], [], [], 0
    sm = SequenceMatcher(None, kt, kg, autojunk=False)
    for thao_tac, i1, i2, j1, j2 in sm.get_opcodes():
        if thao_tac == "equal":
            for k in range(i2 - i1):
                khop += 1
                if lech_toa_do(mt[i1 + k][1], mg[j1 + k][1], a.dungsai):
                    lech_vt.append((kt[i1 + k], mt[i1 + k][1], mg[j1 + k][1]))
        elif thao_tac == "delete":
            thieu += kt[i1:i2]
        elif thao_tac == "insert":
            thua += kg[j1:j2]
        elif thao_tac == "replace":
            thieu += kt[i1:i2]
            thua += kg[j1:j2]

    def in_nhom(ten, ds, gioi_han=40):
        if not ds:
            return
        print("  %s (%d):" % (ten, len(ds)))
        for x in ds[:gioi_han]:
            print("     " + (x if isinstance(x, str) else str(x)))
        if len(ds) > gioi_han:
            print("     ... con %d dong nua" % (len(ds) - gioi_han))
        print()

    in_nhom("THIEU o ban gia lap (co o thiet bi that)", thieu)
    in_nhom("THUA o ban gia lap (khong co o thiet bi that)", thua)

    if lech_vt:
        print("  LECH TOA DO qua %dpx (%d):" % (a.dungsai, len(lech_vt)))
        for mo_ta, tt, gl in lech_vt[:40]:
            print("     %s" % mo_ta[:70])
            print("        that %s  |  gia lap %s" % (tt, gl))
        if len(lech_vt) > 40:
            print("     ... con %d dong nua" % (len(lech_vt) - 40))
        print()

    # ham JS toan cuc — ten ham goc phai con nguyen (CLAUDE.md muc 3.6)
    ht = set(T.get("hamJS") or []) - HAM_CONG_CU
    hg = set(G.get("hamJS") or []) - HAM_CONG_CU
    ham_thieu = sorted(ht - hg)
    if ham_thieu:
        print("  HAM JS TOAN CUC BI THIEU (%d):" % len(ham_thieu))
        print("     " + ", ".join(ham_thieu[:60]))
        print()

    tong_loi = len(thieu) + len(thua) + len(lech_vt) + len(ham_thieu)
    print("=" * 74)
    print("  Khop        : %d phan tu" % khop)
    print("  Thieu       : %d" % len(thieu))
    print("  Thua        : %d" % len(thua))
    print("  Lech toa do : %d" % len(lech_vt))
    print("  Ham JS thieu: %d" % len(ham_thieu))
    print("  => %s" % ("SACH LOI — du dieu kien len muc tuong ung"
                       if tong_loi == 0 else "CON %d CHO LECH" % tong_loi))
    print("=" * 74)
    return 0 if tong_loi == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
