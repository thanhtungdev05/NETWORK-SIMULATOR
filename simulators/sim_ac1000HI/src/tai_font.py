#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TAI 3 TEP CON THIEU — ONT AC1000HI
===================================
Tai /BeVietnam-Regular.ttf, /BeVietnam-Bold.ttf, /PIE.htc ve reference/.

VI SAO CAN SCRIPT RIENG
-----------------------
Lan crawl truoc, 3 tep nay tra 401 nen Claude ket luan nham la "thiet bi
khong co font". Anh Huynn nghi ngo va bao kiem lai — do lai bang Chrome ngay
BEN TRONG frame main (da dang nhap) thi ca 3 deu tra 200:

    /BeVietnam-Regular.ttf  -> 200, 86.308 byte
    /BeVietnam-Bold.ttf     -> 200, 88.456 byte
    /PIE.htc                -> 200, 41.137 byte

Va document.fonts trong frame main bao "BeVietnamRegular=loaded" — font CO
THAT va DUOC DUNG. Do chieu rong chu 'Working Mode Serial Number Model' co 13px:
    thiet bi that (co font) : 220.47 px
    ban gia lap (thieu font): 195.36 px  (roi ve Times New Roman)

=> Phai lay font ve, neu khong ban gia lap hien SAI font so voi that.

Khac biet ky thuat: 3 tep nay chi phuc vu khi request co Referer tro toi mot
trang BEN TRONG (da dang nhap). Cac tep .css/.js/.png khac thi khong doi
Referer nen lan truoc van tai duoc binh thuong.

CACH CHAY
---------
    cd C:\\Claude_Code\\gia_lap_thiet_bi_mang\\devices\\ac1000hi\\src
    python tai_font.py

Script hoi tai khoan giong crawl_that.py. Chi gui GET, khong ghi gi len thiet bi.
"""
import hashlib
import http.cookiejar
import json
import os
import sys
import urllib.error
import urllib.request
from getpass import getpass

IP = "192.168.1.1"
GOC = f"http://{IP}"
_HERE = os.path.dirname(os.path.abspath(__file__))
REF = os.path.abspath(os.path.join(_HERE, "..", "reference"))

CAN_TAI = [
    ("/BeVietnam-Regular.ttf", "font", 86308),
    ("/BeVietnam-Bold.ttf",    "font", 88456),
    ("/PIE.htc",               "htc",  41137),
]


def dat_cookie(cj, ten, gt):
    cj.set_cookie(http.cookiejar.Cookie(
        version=0, name=ten, value=gt, port=None, port_specified=False,
        domain=IP, domain_specified=True, domain_initial_dot=False,
        path="/", path_specified=True, secure=False, expires=None,
        discard=True, comment=None, comment_url=None, rest={}, rfc2109=False))


def main():
    print("=" * 68)
    print("TAI 3 TEP CON THIEU (2 font Be Vietnam + PIE.htc)")
    print("=" * 68)

    cj = http.cookiejar.CookieJar()
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    op.addheaders = [
        ("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                       "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"),
        ("Accept", "*/*"),
    ]

    def goi(dp, referer=None):
        req = urllib.request.Request(GOC + dp)
        if referer:
            req.add_header("Referer", GOC + referer)
        try:
            with op.open(req, timeout=20) as r:
                return r.status, r.read()
        except urllib.error.HTTPError as e:
            return e.code, e.read()
        except Exception as e:                               # noqa: BLE001
            return 0, str(e).encode()

    # Dang nhap (giong crawl_that.py)
    goi("/cgi-bin/login.asp")
    user = input("  Ten dang nhap [admin]: ").strip() or "admin"
    pw = getpass("  Mat khau           : ")
    goi("/cgi-bin/index.asp")                 # buoc "moi" de duoc cap SESSIONID
    dat_cookie(cj, "uid", user)
    dat_cookie(cj, "psw", pw)
    ma, _ = goi("/cgi-bin/reqLogin", referer="/cgi-bin/login.asp")
    ma_kt, _ = goi("/cgi-bin/status_deviceinfo.asp")
    if ma_kt != 200:
        print(f"[X] Dang nhap that bai (status_deviceinfo tra {ma_kt}).")
        return 1
    print("[v] Dang nhap thanh cong.\n")

    ket = []
    for dp, loai, byte_mong_doi in CAN_TAI:
        # Diem mau chot: gui kem Referer tro toi trang BEN TRONG
        ma, du_lieu = goi(dp, referer="/cgi-bin/status_deviceinfo.asp")
        ten = dp.lstrip("/")
        thu_muc = os.path.join(REF, "img")     # de chung cho de tim
        os.makedirs(thu_muc, exist_ok=True)
        with open(os.path.join(thu_muc, ten), "wb") as f:
            f.write(du_lieu)
        dau = "v" if (ma == 200 and len(du_lieu) == byte_mong_doi) else "?"
        print(f"  [{dau}] {ma}  {len(du_lieu):>7} byte  {dp}"
              f"   (mong doi {byte_mong_doi})")
        ket.append({
            "duong_dan": dp, "ma_http": ma, "byte": len(du_lieu),
            "byte_mong_doi": byte_mong_doi,
            "khop": ma == 200 and len(du_lieu) == byte_mong_doi,
            "sha256": hashlib.sha256(du_lieu).hexdigest(),
        })

    p = os.path.join(REF, "source", "manifest_font.json")
    with open(p, "w", encoding="utf-8") as f:
        json.dump({
            "_tieu_de": "Bang ke 3 tep tai bo sung (font Be Vietnam + PIE.htc)",
            "_ngay": "2026-08-22",
            "_ghi_chu": "Lan crawl dau bi 401 vi thieu Referer tro toi trang ben "
                        "trong. Anh Huynn phat hien font hien sai nen kiem lai.",
            "danh_sach": ket,
        }, f, ensure_ascii=False, indent=2)

    du = all(x["khop"] for x in ket)
    print("\n" + "=" * 68)
    print("XONG — " + ("ca 3 tep DUNG kich thuoc mong doi." if du
                       else "CO TEP CHUA DUNG, xem lai o tren."))
    print("Bang ke:", p)
    print("=" * 68)
    return 0 if du else 1


if __name__ == "__main__":
    sys.exit(main())
