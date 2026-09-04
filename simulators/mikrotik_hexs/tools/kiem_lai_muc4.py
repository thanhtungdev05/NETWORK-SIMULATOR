#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Kiem 7 duong dan LAI (hybrid) bi loc sot khoi kiem_muc4_toan_bo.py vi bo loc
cu chi xet kieu[0], trong khi 7 duong dan nay co 'item'/'map' o VI TRI THU HAI.
Dung lai dung logic ghi+doc cua kiem_muc4_toan_bo.py, chi doi nguon duong dan.
"""
import json
import os
import subprocess
import sys
import time
import urllib.request

import os as _os
_GOC = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(_GOC, "src"))
import m2        # noqa: E402
import mat_ma    # noqa: E402

CONG = 8097
CS = f"http://127.0.0.1:{CONG}"
TEP_KHO = os.path.join(_GOC, "src", "cau_hinh.json")
T1, T2 = 0x0000F1, 0x0000F2

TARGETS = [
    ((16, 3), "map", "DHCP Leases/Bridge Hosts/ARP List"),
    ((20, 12), "map", "Queue List Simple/Tree"),
    ((20, 17), "item", "Firewall Connections settings"),
    ((20, 110), "map", "WireGuard Peers"),
    ((24, 24), "item", "Check For Updates"),
    ((44, 16), "map", "Route List / Nexthops"),
    ((44, 33), "map", "Route List (BGP Sessions)"),
]


def dang(dp, than):
    rq = urllib.request.Request(CS + dp, data=than, method="POST")
    with urllib.request.urlopen(rq, timeout=15) as r:
        return r.read()


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
        tl = dang("/jsproxy", b"\x00" * 8 + mat_ma.khoa_cong(priv))
        ma_phien = int.from_bytes(tl[:4], "big")
        master = mat_ma.bi_mat_chung(priv, tl[8:40])
        tx = mat_ma.RC4(mat_ma.dan_xuat_khoa(master, True, False))
        rx = mat_ma.RC4(mat_ma.dan_xuat_khoa(master, False, False))
        seq = [1]

        def goi(the_ds, cho=10):
            nd = m2.dung_than(the_ds, magic=True)
            than = tx.xor(nd + mat_ma.DEM)
            b = ma_phien.to_bytes(4, "big") + seq[0].to_bytes(4, "big") + than
            seq[0] += len(than)
            tl_ = dang("/jsproxy", b)
            ro_ = rx.xor(tl_[8:])
            if ro_[-8:] != b" " * 8:
                raise RuntimeError("8 byte dem sai")
            return {a: c for a, b2, c in m2.giai_ma_than(ro_[:-8])["the"]}

        so_hieu = [5000]

        def sh():
            so_hieu[0] += 1
            return so_hieu[0]

        dat, loi = [], []
        for dd, kieu_test, ten in TARGETS:
            nhan = f"BOSOT-{'-'.join(map(str, dd))}"
            try:
                if kieu_test == "item":
                    goi([(0xFF0001, 0x88, list(dd)), (0xFF0007, 0x08, 0xFE000E),
                         (T1, 0x21, nhan.encode()), (0xFF0006, 0x08, sh())])
                    r = goi([(0xFF0001, 0x88, list(dd)), (0xFF0007, 0x08, 0xFE000D),
                             (0xFF0006, 0x08, sh())])
                    ok = r.get(T1) == nhan.encode()
                    (dat if ok else loi).append(
                        (dd, ten, "OK" if ok else f"doc lai sai: {r.get(T1)!r}"))
                else:
                    r1 = goi([(0xFF0001, 0x88, list(dd)), (0xFF0007, 0x08, 0xFE0005),
                              (T1, 0x21, nhan.encode()), (0xFF0006, 0x08, sh())])
                    ma_dong = r1.get(0xFE0001)
                    if ma_dong is None:
                        loi.append((dd, ten, f"them dong khong co id moi: {r1}"))
                        continue
                    r2 = goi([(0xFF0001, 0x88, list(dd)), (0xFF0007, 0x08, 0xFE0004),
                              (0xFE000C, 0x08, 5), (0xFF0006, 0x08, sh())])
                    ds = r2.get(0xFE0002) or []
                    dong = None
                    for m in ds:
                        t = {a: c for a, b, c in m.get("the", [])}
                        if t.get(0xFE0001) == ma_dong:
                            dong = t
                            break
                    if dong is None or dong.get(T1) != nhan.encode():
                        loi.append((dd, ten, f"them xong doc lai khong thay ({len(ds)} dong)"))
                        continue
                    goi([(0xFF0001, 0x88, list(dd)), (0xFF0007, 0x08, 0xFE0006),
                         (0xFE0001, 0x09 if ma_dong < 256 else 0x08, ma_dong),
                         (0xFF0006, 0x08, sh())])
                    r3 = goi([(0xFF0001, 0x88, list(dd)), (0xFF0007, 0x08, 0xFE0004),
                              (0xFE000C, 0x08, 5), (0xFF0006, 0x08, sh())])
                    ds3 = r3.get(0xFE0002) or []
                    con = any({a: c for a, b, c in m.get("the", [])}.get(0xFE0001) == ma_dong
                              for m in ds3)
                    (dat if not con else loi).append(
                        (dd, ten, "OK them+xoa dung" if not con else "xoa khong het"))
            except Exception as e:
                loi.append((dd, ten, f"{type(e).__name__}: {e}"))

        print("=" * 72)
        print(f"DAT: {len(dat)}/{len(TARGETS)}  LOI: {len(loi)}")
        for dd, ten, ket in dat:
            print(f"  OK  {dd} {ten} -> {ket}")
        for dd, ten, ly_do in loi:
            print(f"  SAI {dd} {ten} -> {ly_do}")
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
