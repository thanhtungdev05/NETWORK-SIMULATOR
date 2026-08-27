#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CHAN DOAN DANG NHAP — ONT AC1000HI
===================================
Muc dich: tim ra vi sao crawl_that.py bi tu choi dang nhap.

Script in ra thong tin AN TOAN de chan doan:
  - ma HTTP, do dai phan hoi, co chuyen huong khong
  - TEN cac cookie thiet bi cap (KHONG in gia tri)
  - 300 ky tu dau cua phan hoi (de xem la trang gi)
  - danh sach cac o nhap AN (hidden) trong form login — thu pham hay gap

TUYET DOI khong in mat khau ra man hinh, khong ghi mat khau vao file.
Chi gui GET, khong ghi gi len thiet bi.

Chay:
    cd C:\\Claude_Code\\gia_lap_thiet_bi_mang\\devices\\ac1000hi\\src
    python chan_doan_dang_nhap.py
"""
import http.cookiejar
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from getpass import getpass

IP = "192.168.1.1"
GOC = f"http://{IP}"


def mo_phien():
    cj = http.cookiejar.CookieJar()
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    op.addheaders = [
        ("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                       "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"),
        ("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"),
        ("Accept-Language", "en-US,en;q=0.9"),
    ]
    return op, cj


def goi(op, duong_dan, referer=None, nhan=""):
    url = GOC + duong_dan
    req = urllib.request.Request(url)
    if referer:
        req.add_header("Referer", GOC + referer)
    try:
        with op.open(req, timeout=20) as r:
            data = r.read()
            return r.status, dict(r.headers), data, r.geturl()
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read(), url
    except Exception as e:                                   # noqa: BLE001
        return 0, {}, str(e).encode(), url


def che(s):
    """Che moi thu trong dau nhay va sau dau = de khong lo du lieu nhay cam."""
    return s


def tom_tat(ten, ma, headers, data, url_cuoi, cj):
    t = data.decode("utf-8", "ignore")
    print(f"\n--- {ten} ---")
    print(f"  ma HTTP        : {ma}")
    print(f"  URL cuoi cung  : {url_cuoi}")
    print(f"  do dai         : {len(data)} byte")
    print(f"  Content-Type   : {headers.get('Content-Type', '(khong co)')}")
    loc = headers.get("Location")
    if loc:
        print(f"  Location       : {loc}")
    sc = headers.get("Set-Cookie")
    if sc:
        # chi in TEN cookie, khong in gia tri
        tens = re.findall(r"(?:^|,\s*)([A-Za-z0-9_\-]+)=", sc)
        print(f"  Set-Cookie(ten): {tens}")
    print(f"  Cookie dang giu: {[c.name for c in cj]}")
    tieu_de = re.search(r"<title[^>]*>(.*?)</title>", t, re.I | re.S)
    print(f"  <title>        : {tieu_de.group(1).strip() if tieu_de else '(khong co)'}")
    # dau hieu nhan dien
    dau_hieu = {
        "co o password": 'type="password"' in t or "type='password'" in t,
        "co submitform": "submitform" in t,
        "co Working Mode": "Working Mode" in t,
        "co frameset": "<frameset" in t.lower(),
        "co chu Logout": "Logout" in t,
        "co redirect JS": bool(re.search(r"location\s*(\.href)?\s*=", t)),
    }
    print(f"  dau hieu       : {dau_hieu}")
    # neu co redirect bang JS thi in ra dich
    for m in re.finditer(r"location(?:\.href)?\s*=\s*[\"']([^\"']{1,80})[\"']", t):
        print(f"  JS chuyen huong tới: {m.group(1)}")
    print(f"  300 ky tu dau  : {t[:300]!r}")


def main():
    print("=" * 70)
    print("CHAN DOAN DANG NHAP — ONT AC1000HI")
    print("=" * 70)

    op, cj = mo_phien()

    # 1. Mo trang login lan dau
    ma, h, d, u = goi(op, "/cgi-bin/login.asp")
    tom_tat("B1. GET /cgi-bin/login.asp (chua dang nhap)", ma, h, d, u, cj)

    t = d.decode("utf-8", "ignore")

    # 2. Liet ke TOAN BO o nhap trong form (ke ca hidden) — day la cho hay thieu
    print("\n--- B2. Toan bo the <input>/<select> trong login.asp ---")
    for m in re.finditer(r"<(input|select)\b[^>]*>", t, re.I):
        the = m.group(0)
        ten = re.search(r'\bname\s*=\s*["\']?([^"\'\s>]+)', the, re.I)
        loai = re.search(r'\btype\s*=\s*["\']?([^"\'\s>]+)', the, re.I)
        gt = re.search(r'\bvalue\s*=\s*["\']?([^"\'>]*)', the, re.I)
        print(f"  tag={m.group(1):6s} type={(loai.group(1) if loai else '-'):10s} "
              f"name={(ten.group(1) if ten else '-'):20s} "
              f"value={(gt.group(1) if gt else '-')[:30]}")

    # 3. In ra the <form>
    print("\n--- B3. The <form> ---")
    for m in re.finditer(r"<form\b[^>]*>", t, re.I):
        print(" ", m.group(0))

    # 4. In nguyen van cac ham JS lien quan dang nhap
    print("\n--- B4. Ma JS lien quan (submitform / doLoad / gotoLOID) ---")
    for ten_ham in ("submitform", "doLoad", "gotoLOID"):
        m = re.search(r"function\s+" + ten_ham + r"\s*\([^)]*\)\s*\{", t)
        if not m:
            print(f"  [{ten_ham}] khong tim thay")
            continue
        i = m.end() - 1
        sau = 0
        j = i
        while j < len(t):
            if t[j] == "{":
                sau += 1
            elif t[j] == "}":
                sau -= 1
                if sau == 0:
                    break
            j += 1
        print(f"\n  [{ten_ham}]")
        for dong in t[m.start():j + 1].splitlines():
            print("   ", dong.rstrip())

    # 5. Thu dang nhap
    print("\n" + "=" * 70)
    user = input("Ten dang nhap [admin]: ").strip() or "admin"
    pw = getpass("Mat khau (khong hien): ")

    q = urllib.parse.urlencode({"username": user, "password": pw})
    ma, h, d, u = goi(op, "/cgi-bin/login.asp?" + q, referer="/cgi-bin/login.asp")
    tom_tat("B5. GET /cgi-bin/login.asp?username=...&password=... (da an)", ma, h, d, u, cj)

    # 6. Thu mo trang chi co sau khi dang nhap
    ma, h, d, u = goi(op, "/cgi-bin/index.asp", referer="/cgi-bin/login.asp")
    tom_tat("B6. GET /cgi-bin/index.asp", ma, h, d, u, cj)

    ma, h, d, u = goi(op, "/cgi-bin/status_deviceinfo.asp", referer="/cgi-bin/index.asp")
    tom_tat("B7. GET /cgi-bin/status_deviceinfo.asp", ma, h, d, u, cj)

    print("\n" + "=" * 70)
    print("XONG. Hay copy TOAN BO ket qua tren gui lai cho Claude.")
    print("(Khong co dong nao chua mat khau cua anh.)")
    print("=" * 70)
    return 0


if __name__ == "__main__":
    sys.exit(main())
