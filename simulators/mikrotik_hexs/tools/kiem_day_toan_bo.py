#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
KIEM CO CHE DAY (push) tren MOT MAU dai dien nhieu nhom menu
=============================================================

Muc 4 co HAI nua: (1) ghi roi doc lai o CHINH duong dan do — da kiem het
397/397 o kiem_muc4_toan_bo.py; (2) DAY sang PHIEN KHAC dang subscribe cung
duong dan — day moi la "sua trang A thi trang B doi theo" thuc su.

_day_cho_cac_phien() trong server.py khong co mot dong ma nao rieng cho tung
duong dan (xem code) — VAN phai do de xac nhan, khong suy tu doc code.

Chon 1 duong dan kieu 'item' dai dien MOI nhom menu cap 1 (System, IP,
Routing, IPv6, Switch, MPLS, Tools, khong-nhom) de dam bao khong bo sot nhom
nao vi mot ly do nao do chi ap dung rieng cho mot nhom.
"""
import json
import os
import subprocess
import sys
import time
import urllib.request

_HERE = os.path.dirname(os.path.abspath(__file__))
_GOC = os.path.join(_HERE, "..")
sys.path.insert(0, os.path.join(_GOC, "src"))
import m2        # noqa: E402
import mat_ma    # noqa: E402

CONG = 8098
CS = f"http://127.0.0.1:{CONG}"
TEP_KHO = os.path.join(_GOC, "src", "cau_hinh.json")
T_DANH_DAU = 0x0000F3


def dang(dp, than):
    rq = urllib.request.Request(CS + dp, data=than, method="POST")
    with urllib.request.urlopen(rq, timeout=30) as r:
        return r.read()


def phien_moi():
    priv = os.urandom(32)
    tl = dang("/jsproxy", b"\x00" * 8 + mat_ma.khoa_cong(priv))
    ma = int.from_bytes(tl[:4], "big")
    master = mat_ma.bi_mat_chung(priv, tl[8:40])
    tx = mat_ma.RC4(mat_ma.dan_xuat_khoa(master, True, False))
    rx = mat_ma.RC4(mat_ma.dan_xuat_khoa(master, False, False))
    seq = [1]

    def goi(the_ds, cho=30):
        nd = m2.dung_than(the_ds, magic=True)
        than = tx.xor(nd + mat_ma.DEM)
        b = ma.to_bytes(4, "big") + seq[0].to_bytes(4, "big") + than
        seq[0] += len(than)
        tl_ = dang("/jsproxy", b)
        ro_ = rx.xor(tl_[8:])
        if ro_[-8:] != b" " * 8:
            raise RuntimeError("8 byte dem sai")
        return {a: c for a, b2, c in m2.giai_ma_than(ro_[:-8])["the"]}

    return ma, goi


def main():
    if os.path.exists(TEP_KHO):
        os.remove(TEP_KHO)
    srv = subprocess.Popen(
        [sys.executable, os.path.join(_GOC, "src", "server.py"), str(CONG)],
        stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
    try:
        for _ in range(60):
            time.sleep(0.25)
            try:
                urllib.request.urlopen(CS + "/", timeout=2)
                break
            except Exception:
                continue

        d = json.load(open(os.path.join(_GOC, "spec", "duong-dan-lenh.json"),
                            encoding="utf-8"))
        goc = os.path.join(_GOC, "src", "du_lieu_goc")
        co_du_lieu = set()
        for f in os.listdir(goc):
            if f.endswith(".bin") and "__" not in f:
                co_du_lieu.add(tuple(int(x) for x in f[:-4].split("-")))

        items = [x for x in d if (x.get("kieu") or [None])[0] == "item"
                 and tuple(x["path"]) in co_du_lieu]

        nhom_muon = {}
        for x in items:
            nhom = x["path"][0]
            nhom_muon.setdefault(nhom, x)
        mau = list(nhom_muon.values())[:20]

        print("=" * 72)
        print(f"  KIEM CO CHE DAY — {len(mau)} duong dan dai dien "
              f"({len(nhom_muon)} nhom menu cap 1 co mat)")
        print("=" * 72)

        dat, loi = [], []
        so_hieu = [3000]

        def sh():
            so_hieu[0] += 1
            return so_hieu[0]

        for x in mau:
            dd = tuple(x["path"])
            ten = (x.get("duongMenu") or [""])[0]
            nhan = f"DAY-{'-'.join(map(str, dd))}".encode()
            try:
                # Phien 1: dang ky (subscribe) duong dan nay
                _, goi1 = phien_moi()
                r_sub = goi1([(0xFF0001, 0x88, list(dd)),
                              (0xFF0007, 0x08, 0xFE0012), (0xFF0006, 0x08, sh())])
                if r_sub.get(0xFF0002) != list(dd):
                    loi.append((dd, ten, f"subscribe khong ACK dung duong dan: {r_sub}"))
                    continue

                # Phien 1 mo KENH CHO DAI (khong duong dan, khong lenh) — cho
                # toi 25s de nhan goi DAY. Chay trong luong rieng.
                import threading
                ket_qua = {}

                def cho_day():
                    try:
                        ket_qua["r"] = goi1([(0xFF001C, 0xA0, [b"t"])], cho=28)
                    except Exception as e:
                        ket_qua["loi"] = str(e)

                th = threading.Thread(target=cho_day)
                th.start()
                time.sleep(0.5)  # dam bao kenh cho dai da mo truoc khi ghi

                # Phien 2: ghi truong danh dau len duong dan do
                _, goi2 = phien_moi()
                goi2([(0xFF0001, 0x88, list(dd)), (0xFF0007, 0x08, 0xFE000E),
                      (T_DANH_DAU, 0x21, nhan), (0xFF0006, 0x08, sh())])

                th.join(timeout=30)
                r = ket_qua.get("r")
                if r is None:
                    loi.append((dd, ten, f"khong nhan duoc goi day trong 28s "
                                          f"({ket_qua.get('loi', 'timeout')})"))
                    continue
                if r.get(0xFF0002) != list(dd) or r.get(T_DANH_DAU) != nhan:
                    loi.append((dd, ten, f"goi day sai noi dung: duong_dan="
                                          f"{r.get(0xFF0002)}, danh_dau={r.get(T_DANH_DAU)!r}"))
                    continue
                dat.append((dd, ten))
            except Exception as e:
                loi.append((dd, ten, f"loi khi chay: {type(e).__name__}: {e}"))

        print(f"  DAT: {len(dat)}/{len(mau)}   LOI: {len(loi)}")
        for dd, ten, ly_do in loi:
            print(f"  SAI [{','.join(map(str, dd))}] {ten}\n       -> {ly_do}")
        for dd, ten in dat:
            print(f"  OK  [{','.join(map(str, dd))}] {ten} — nhan duoc goi DAY dung noi dung")
        print("=" * 72)
        return 0 if not loi else 1
    finally:
        srv.terminate()
        try:
            srv.wait(timeout=5)
        except Exception:
            srv.kill()
        if os.path.exists(TEP_KHO):
            os.remove(TEP_KHO)


if __name__ == "__main__":
    sys.exit(main())
