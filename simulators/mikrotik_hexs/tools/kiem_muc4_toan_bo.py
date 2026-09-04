#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
KIEM MUC 4 TOAN BO — quet TAT CA duong dan map/item co du lieu that
=====================================================================

CAU HOI can tra loi bang may do, khong doan: kho_cau_hinh.py + nhanh ghi
trong server.py (0xfe000e/0xfe0003/0xfe0005/0xfe0006) la CO CHE CHUNG, khong
co mot dong ma nao rieng cho tung duong dan. Vay no co THAT SU chay dung cho
MOI duong dan map/item, hay chi dung cho vai duong dan da tung thu cong kiem
(Identity, [20,35], [14,3])?

CACH DO: voi TUNG duong dan kieu 'item' trong spec/duong-dan-lenh.json (co du
lieu that o src/du_lieu_goc/):
    1. Ghi mot truong danh dau (0xfe000e).
    2. Doc lai bang lenh fetch (0xfe000d) — phai thay dung truong vua ghi.

Voi TUNG duong dan kieu 'map':
    1. THEM mot dong danh dau (0xfe0005) -> lay id moi.
    2. Doc lai bang getall (0xfe0004) — phai thay dong moi.
    3. SUA dong do (0xfe0003) — doc lai phai thay truong moi.
    4. XOA dong do (0xfe0006) — doc lai bang phai rong lai dung cho.

Dung MOT phien HTTP xuyen suot (khong bat tay lai moi duong dan) cho nhanh.
Dung port RIENG + xoa cau_hinh.json truoc/sau — KHONG dung chung voi may chu
anh Huynn dang chay o cong khac (neu co), de khong lam ban cau hinh dang hoc.
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

CONG = 8099
CS = f"http://127.0.0.1:{CONG}"
TEP_KHO = os.path.join(_GOC, "src", "cau_hinh.json")

# Tag danh dau — dung mot cap khong trung he thong (kho_cau_hinh.HE_THONG)
T_DANH_DAU_1 = 0x0000F1
T_DANH_DAU_2 = 0x0000F2


def dang(dp, than):
    rq = urllib.request.Request(CS + dp, data=than, method="POST")
    with urllib.request.urlopen(rq, timeout=15) as r:
        return r.read()


def tai_duong_dan():
    p = os.path.join(_GOC, "spec", "duong-dan-lenh.json")
    d = json.load(open(p, encoding="utf-8"))
    goc = os.path.join(_GOC, "src", "du_lieu_goc")
    co_du_lieu = set()
    for f in os.listdir(goc):
        if f.endswith(".bin") and "__" not in f:
            co_du_lieu.add(tuple(int(x) for x in f[:-4].split("-")))
    ra = []
    for x in d:
        kieu = (x.get("kieu") or [None])[0]
        if kieu not in ("item", "map"):
            continue
        dd = tuple(x["path"])
        if dd not in co_du_lieu:
            continue
        ra.append((dd, kieu, (x.get("duongMenu") or [""])[0]))
    return ra


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

        priv = os.urandom(32)
        pub = mat_ma.khoa_cong(priv)
        tl = dang("/jsproxy", b"\x00" * 8 + pub)
        ma_phien = int.from_bytes(tl[:4], "big")
        pub_chu = tl[8:40]
        master = mat_ma.bi_mat_chung(priv, pub_chu)
        tx = mat_ma.RC4(mat_ma.dan_xuat_khoa(master, True, False))
        rx = mat_ma.RC4(mat_ma.dan_xuat_khoa(master, False, False))
        seq_gui = [1]

        def goi(the_ds, cho=10):
            nd = m2.dung_than(the_ds, magic=True)
            than = tx.xor(nd + mat_ma.DEM)
            b = ma_phien.to_bytes(4, "big") + seq_gui[0].to_bytes(4, "big") + than
            seq_gui[0] += len(than)
            tl_ = dang("/jsproxy", b)
            ro_ = rx.xor(tl_[8:])
            if ro_[-8:] != b" " * 8:
                raise RuntimeError("8 byte dem sai — khoa lech")
            return {a: c for a, b2, c in m2.giai_ma_than(ro_[:-8])["the"]}

        duong_dan_ds = tai_duong_dan()
        print("=" * 72)
        print("  KIEM MUC 4 TOAN BO — MikroTik hEX S")
        print(f"  {len(duong_dan_ds)} duong dan item/map co du lieu that de kiem")
        print("=" * 72)

        so_hieu = [2000]

        def sh():
            so_hieu[0] += 1
            return so_hieu[0]

        dat = []
        loi = []

        for i, (dd, kieu, ten) in enumerate(duong_dan_ds):
            nhan = f"KIEM4-{'-'.join(map(str, dd))}"
            try:
                if kieu == "item":
                    goi([(0xFF0001, 0x88, list(dd)), (0xFF0007, 0x08, 0xFE000E),
                         (T_DANH_DAU_1, 0x21, nhan.encode()), (0xFF0006, 0x08, sh())])
                    r = goi([(0xFF0001, 0x88, list(dd)), (0xFF0007, 0x08, 0xFE000D),
                             (0xFF0006, 0x08, sh())])
                    ok = r.get(T_DANH_DAU_1) == nhan.encode()
                    if ok:
                        dat.append((dd, kieu, ten))
                    else:
                        loi.append((dd, kieu, ten, f"doc lai khong thay danh dau: {r.get(T_DANH_DAU_1)!r}"))

                else:  # map
                    r1 = goi([(0xFF0001, 0x88, list(dd)), (0xFF0007, 0x08, 0xFE0005),
                              (T_DANH_DAU_1, 0x21, nhan.encode()), (0xFF0006, 0x08, sh())])
                    ma_dong = r1.get(0xFE0001)
                    if ma_dong is None:
                        loi.append((dd, kieu, ten, "them dong: khong co ufe0001 (id moi)"))
                        continue

                    r2 = goi([(0xFF0001, 0x88, list(dd)), (0xFF0007, 0x08, 0xFE0004),
                              (0xFE000C, 0x08, 5), (0xFF0006, 0x08, sh())])
                    ds = r2.get(0xFE0002) or []
                    dong_moi = None
                    for m in ds:
                        t = {a: c for a, b, c in m.get("the", [])}
                        if t.get(0xFE0001) == ma_dong:
                            dong_moi = t
                            break
                    if dong_moi is None or dong_moi.get(T_DANH_DAU_1) != nhan.encode():
                        loi.append((dd, kieu, ten, f"them xong doc lai KHONG thay dong (co {len(ds)} dong)"))
                        continue

                    goi([(0xFF0001, 0x88, list(dd)), (0xFF0007, 0x08, 0xFE0003),
                         (0xFE0001, 0x09 if ma_dong < 256 else 0x08, ma_dong),
                         (T_DANH_DAU_2, 0x21, b"DA-SUA"), (0xFF0006, 0x08, sh())])
                    r3 = goi([(0xFF0001, 0x88, list(dd)), (0xFF0007, 0x08, 0xFE0004),
                              (0xFE000C, 0x08, 5), (0xFF0006, 0x08, sh())])
                    ds3 = r3.get(0xFE0002) or []
                    dong_sua = None
                    for m in ds3:
                        t = {a: c for a, b, c in m.get("the", [])}
                        if t.get(0xFE0001) == ma_dong:
                            dong_sua = t
                            break
                    if (dong_sua is None or dong_sua.get(T_DANH_DAU_2) != b"DA-SUA"
                            or dong_sua.get(T_DANH_DAU_1) != nhan.encode()):
                        loi.append((dd, kieu, ten, "sua dong: doc lai khong dung (truong moi hoac truong cu mat)"))
                        continue

                    goi([(0xFF0001, 0x88, list(dd)), (0xFF0007, 0x08, 0xFE0006),
                         (0xFE0001, 0x09 if ma_dong < 256 else 0x08, ma_dong),
                         (0xFF0006, 0x08, sh())])
                    r4 = goi([(0xFF0001, 0x88, list(dd)), (0xFF0007, 0x08, 0xFE0004),
                              (0xFE000C, 0x08, 5), (0xFF0006, 0x08, sh())])
                    ds4 = r4.get(0xFE0002) or []
                    con_khong = any(
                        {a: c for a, b, c in m.get("the", [])}.get(0xFE0001) == ma_dong
                        for m in ds4)
                    if con_khong:
                        loi.append((dd, kieu, ten, "xoa dong: dong van con sau khi xoa"))
                        continue

                    dat.append((dd, kieu, ten))

            except Exception as e:
                loi.append((dd, kieu, ten, f"loi khi goi: {type(e).__name__}: {e}"))

            if (i + 1) % 50 == 0:
                print(f"  ... da kiem {i + 1}/{len(duong_dan_ds)}")

        print("=" * 72)
        print(f"  DAT muc 4 (ghi + doc lai dung): {len(dat)}/{len(duong_dan_ds)}")
        print(f"  LOI: {len(loi)}")
        if loi:
            print("-" * 72)
            for dd, kieu, ten, lydo in loi:
                print(f"  SAI  [{','.join(map(str, dd))}] {kieu:5s} {ten}\n"
                      f"       -> {lydo}")
        print("=" * 72)

        bao = {
            "tong": len(duong_dan_ds),
            "dat": [{"path": list(dd), "kieu": k, "ten": t} for dd, k, t in dat],
            "loi": [{"path": list(dd), "kieu": k, "ten": t, "ly_do": l}
                    for dd, k, t, l in loi],
        }
        p_bao = os.path.join(_GOC, "spec", "bao-cao-muc4.json")
        json.dump(bao, open(p_bao, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print(f"  Bao cao day du: {os.path.relpath(p_bao, _GOC)}")
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
