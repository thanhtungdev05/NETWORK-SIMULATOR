#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
KIEM CHUNG BO GIAI MA M2 TREN KHUNG TIN THAT
=============================================
Nguyen tac: KHONG tin vao viec "doc code thay hop ly". Bo giai ma phai
tieu thu VUA DUNG het byte cua ca 46 khung tin that thu tu thiet bi.
Con du byte hoac thieu byte = gia thuyet ve cau truc SAI.
"""
import glob
import os
import sys
import collections

_HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(_HERE, "..", "src"))
import m2  # noqa: E402

HAR = os.path.join(_HERE, "..", "reference", "har")


def main():
    tep = sorted(glob.glob(os.path.join(HAR, "*-resp.bin")))
    dat, loi = 0, []
    kieu_gap = collections.Counter()
    ten_gap = collections.Counter()

    for f in tep:
        d = open(f, "rb").read()
        try:
            kq = m2.giai_ma(d)
        except Exception as e:
            loi.append((os.path.basename(f), len(d), str(e)))
            continue

        def duyet(the):
            for ten, kieu, gt in the:
                kieu_gap[kieu] += 1
                ten_gap[ten] += 1
                if kieu == 0xA8:
                    for con in gt:
                        duyet(con["the"])
                elif kieu in (0x28, 0x29):
                    duyet(gt["the"])

        duyet(kq["the"])

        # PHEP KIEM NGHIEM NHAT: dung nguoc lai phai ra DUNG BYTE GOC.
        # "Tieu thu het byte" khong du — the 0x21 tung doc sai do dai ma van
        # chay het (nuot nham roi tinh co khop lai). Chi co dung nguoc va so
        # tung byte moi loai duoc kieu bao dong gia do.
        try:
            lam_lai = m2.dung_goi(kq["ma_phien"], kq["so_thu_tu"], kq["the"],
                                  magic=kq["magic"], dem=kq["dem"])
        except Exception as e:
            loi.append((os.path.basename(f), len(d), "dung nguoc that bai: " + str(e)))
            continue
        if lam_lai != d:
            n = min(len(lam_lai), len(d))
            lech = next((k for k in range(n) if lam_lai[k] != d[k]), n)
            loi.append((os.path.basename(f), len(d),
                        f"dung nguoc KHAC byte goc tai {lech} "
                        f"(goc {len(d)}B, dung lai {len(lam_lai)}B)"))
            continue
        dat += 1

    print("=" * 66)
    print("  KIEM BO GIAI MA M2 TREN KHUNG TIN THAT")
    print("=" * 66)
    print(f"  Tong khung : {len(tep)}")
    print(f"  Giai duoc  : {dat}")
    print(f"  Loi        : {len(loi)}")
    for ten, n, e in loi[:12]:
        print(f"     - {ten} ({n} byte): {e}")

    if kieu_gap:
        print("\n  KIEU DA GAP (kieu: so lan):")
        for k in sorted(kieu_gap):
            print(f"     0x{k:02x}: {kieu_gap[k]}")
        print(f"\n  So ten the khac nhau: {len(ten_gap)}")
        pho_bien = ten_gap.most_common(12)
        print("  12 the pho bien nhat:", ", ".join(f"0x{t:06x}({n})" for t, n in pho_bien))

    print("\n" + "=" * 66)
    if loi:
        print(f"  KET LUAN: CHUA DAT — con {len(loi)}/{len(tep)} khung chua giai duoc.")
        return 1
    print(f"  KET LUAN: {dat}/{len(tep)} khung giai ma KHOP TUNG BYTE.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
