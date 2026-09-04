#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ghep emotion.css cho ONT-BE6500C tu cac file CSSOM that trong reference/.

TAI SAO CO FILE NAY (2026-08-12): ban emotion.css cu duoc ghep bang lenh
Python/bash tam thoi (khong luu script), dung cach noi chuoi ngay tho lam
mat can bang dau {} o doan '@media print' + 4 khoi '@keyframes mui-auto-fill*'
(cssom_toan_bo.css that CAN BANG 100%, loi la o buoc ghep). Hau qua: trinh
duyet coi ~317KB cuoi file la noi dung khong hop le va BO QUA toan bo,
trong do co luat '.css-vubbuv { width:1em; height:1em; ... }' dinh co icon
-- day la nguyen nhan THAT cua loi "tam giac den", KHONG PHAI Content-Type
nhu chuan doan truoc do.

Script nay parse CSS THEO KHOI (dem do sau {} dung cach, khong tach chuoi
ngay tho), dedupe theo noi dung khoi giong het nhau, giu thu tu xuat hien
dau tien. Nguon: 100% tu reference/source/ (chi doc), khong bia them.
"""
import os

REF = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                    "..", "reference", "source")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                    "www", "emotion.css")

# Thu tu ghep: file tinh truoc, roi cac ban CSSOM theo thu tu thu thap.
NGUON = [
    "assets_goc/index-Cg7w-6E0.css",
    "cssom_toan_bo.css",
    "cssom_login.css",
    "cssom_mobile_toan_bo.css",
    "cssom_mobile_ngan_keo.css",
    "cssom_dialog_reboot.css",
    "cssom_dialog_wifi_save.css",
    "cssom_dialog_portforward_add.css",
    "cssom_dialog_reserved_add.css",
    "cssom_dialog_routing_add.css",
    "cssom_thanh_save.css",
]


def tach_khoi(text):
    """Tach text CSS thanh danh sach cac khoi cap cao nhat, dem do sau {}
    dung cach de khong cat nham giua @media/@keyframes long nhau. Bo qua
    comment /* ... */ khi dem (comment CSSOM khong chua {} that su nhung
    de phong truong hop dac biet)."""
    khoi = []
    depth = 0
    start = None
    i = 0
    n = len(text)
    while i < n:
        c = text[i]
        if c == "/" and i + 1 < n and text[i + 1] == "*":
            j = text.find("*/", i + 2)
            i = (j + 2) if j != -1 else n
            continue
        if c == "{":
            if depth == 0:
                start = i if start is None else start
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0 and start is not None:
                # tim diem bat dau THAT (lui ve dau dong selector truoc do)
                khoi.append(text[_diem_dau(text, start):i + 1].strip())
                start = None
        i += 1
    if depth != 0:
        raise SystemExit(f"LOI: file khong can bang {{}} sau khi parse (depth={depth})")
    return khoi


def _diem_dau(text, vi_tri_ngoac_dau):
    """Lui tu vi tri '{' dau tien cua khoi ve diem bat dau selector/@rule,
    la sau dau ';' hoac '}' hoac '*/' gan nhat, hoac dau file."""
    j = vi_tri_ngoac_dau - 1
    while j >= 0 and text[j] not in ";}":
        j -= 1
    return j + 1


def main():
    da_thay = set()
    ket_qua = []
    tong_khoi_tho = 0
    for ten in NGUON:
        p = os.path.join(REF, ten)
        if not os.path.exists(p):
            print(f"BO QUA (khong ton tai): {ten}")
            continue
        with open(p, encoding="utf-8") as f:
            text = f.read()
        khoi_list = tach_khoi(text)
        tong_khoi_tho += len(khoi_list)
        moi = 0
        for k in khoi_list:
            if k and k not in da_thay:
                da_thay.add(k)
                ket_qua.append(k)
                moi += 1
        print(f"{ten}: {len(khoi_list)} khoi, moi {moi}")

    noi_dung = "\n".join(ket_qua) + "\n"
    o = noi_dung.count("{")
    c = noi_dung.count("}")
    if o != c:
        raise SystemExit(f"LOI: ket qua khong can bang open={o} close={c}")

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(noi_dung)
    print(f"\nTong khoi tho: {tong_khoi_tho}, sau dedupe: {len(ket_qua)}")
    print(f"Ghi {OUT}: {len(noi_dung)} bytes, can bang {{}} OK ({o}=={c})")


if __name__ == "__main__":
    main()
