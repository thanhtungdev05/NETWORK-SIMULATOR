#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GD3 -- Trich dac ta API tu MA GOC bundle index-CW0UhNxy.js.

Sinh ra spec/api_methods.json: voi moi resource, liet ke chinh xac nhung
HTTP method ma UNG DUNG THAT su dung, kem TEN HAM goc trong bundle.

Day la DAC TA CHINH THUC, khong phai suy luan. Nguon duy nhat: cac loi goi
dang
    <tenHam>:async({...})=> ... Ae({resource:"<res>",method:"<METHOD>",...})
trong bundle. Ham `Ae` la lop bao HTTP chung (xem _doc_ham_Ae de biet chi
tiet header/duong dan).

Resource NAO KHONG XUAT HIEN o day thi ung dung KHONG BAO GIO goi -- neu
gia lap nhan duoc request toi no thi do la loi, khong duoc doan.
"""
import json
import os
import re

GOC = os.path.dirname(os.path.abspath(__file__))
BUNDLE = os.path.join(GOC, "..", "reference", "source", "assets_goc",
                      "index-CW0UhNxy.js")
OUT = os.path.join(GOC, "..", "spec", "api_methods.json")

# Bat cap (tenHam, resource, method). Cho phep resource co ${...} (template
# literal) -- se chuan hoa thanh tham so duong dan.
MAU = re.compile(
    r"(?P<ham>[A-Za-z_$][\w$]*)\s*:\s*async\s*\([^)]*\)\s*=>\s*\{?\s*"
    r"(?:return\s+)?await\s+Ae\(\{\s*resource\s*:\s*"
    r"[\"'`](?P<res>api/v1/data/[^\"'`]*)[\"'`]\s*,\s*"
    r"method\s*:\s*[\"'](?P<method>GET|POST|PATCH|DELETE|PUT)[\"']"
)


def chuan_hoa(res):
    """api/v1/data/tcpdump/interfaces/${t} -> api/v1/data/tcpdump/interfaces/{id}
    Giu nguyen dau '/' cuoi neu co (vd speedTest/records/${t} khi t rong
    thi duong dan THAT la '.../records/')."""
    return re.sub(r"\$\{[^}]*\}", "{id}", res)


def main():
    with open(BUNDLE, encoding="utf-8") as f:
        data = f.read()

    ket_qua = {}
    for m in MAU.finditer(data):
        res = chuan_hoa(m.group("res"))
        method = m.group("method")
        ham = m.group("ham")
        muc = ket_qua.setdefault(res, {"methods": {}, "_vi_tri": []})
        muc["methods"].setdefault(method, []).append(ham)
        muc["_vi_tri"].append(m.start())

    # Kiem tra: moi lan xuat hien 'api/v1/data' trong bundle phai duoc bat
    # het. Neu con sot thi bao ro de nguoi doc kiem lai, KHONG lang le bo.
    tong_xuat_hien = len(re.findall(r"api/v1/data", data))
    tong_bat_duoc = sum(len(v["_vi_tri"]) for v in ket_qua.values())
    sot = tong_xuat_hien - tong_bat_duoc

    if sot:
        print(f"CANH BAO: {sot}/{tong_xuat_hien} lan xuat hien 'api/v1/data' "
              f"KHONG khop mau. Liet ke de kiem tay:")
        da_bat = set()
        for v in ket_qua.values():
            da_bat.update(v["_vi_tri"])
        # vi tri trong _vi_tri la diem bat dau cua ca cum match, can doi
        # chieu theo vung phu song thay vi diem chinh xac
        vung = []
        for m in MAU.finditer(data):
            vung.append((m.start(), m.end()))
        for m in re.finditer(r"api/v1/data", data):
            i = m.start()
            if not any(a <= i < b for a, b in vung):
                print(f"  [{i}] ...{data[max(0,i-90):i+90]}...")

    # Don dep truong noi bo truoc khi ghi
    xuat = {}
    for res in sorted(ket_qua):
        xuat[res] = {
            m: sorted(set(ket_qua[res]["methods"][m]))
            for m in sorted(ket_qua[res]["methods"])
        }

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump({
            "_nguon": "reference/source/assets_goc/index-CW0UhNxy.js",
            "_cach_trich": ("regex bat mau <tenHam>:async(...)=>Ae({resource,"
                            "method}) -- xem src/trich_api_methods.py"),
            "_ngay": "2026-08-12",
            "_tong_resource": len(xuat),
            "_ghi_chu": ("Gia tri la {METHOD: [ten ham goc trong bundle]}. "
                         "Resource khong co trong bang nay = ung dung KHONG "
                         "bao gio goi."),
            "resources": xuat,
        }, f, ensure_ascii=False, indent=2)

    print(f"\nTrich duoc {len(xuat)} resource, {tong_bat_duoc} loi goi.")
    for res in sorted(xuat):
        print(f"  {res:52s} {','.join(sorted(xuat[res]))}")
    print(f"\nGhi: {OUT}")


if __name__ == "__main__":
    main()
