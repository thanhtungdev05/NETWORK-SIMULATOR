#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CRAWL THIET BI THAT — ONT AC1000HI (FPT Telecom, "GPON Home Gateway")
=====================================================================

MUC DICH
--------
Tai NGUYEN VAN toan bo file goc cua thiet bi that (HTML/JS/CSS/anh) ve thu muc
`devices/ac1000hi/reference/`, de lam BANG CHUNG GOC cho ban gia lap.

Vi sao phai chay tay tren may anh Huynn (khong tu dong duoc):
  - Claude dieu khien Chrome doc DUOC noi dung, nhung kenh tra ket qua ve co bo
    loc an toan, chan cac khoi du lieu lon co chua "cookie"/query string. Ma
    nguon firmware nay chua chu "cookie" 14 lan trong login.asp nen bi chan.
  - Moi truong chay lenh cua Claude (Linux sandbox) KHONG cung mang LAN voi
    thiet bi 192.168.1.1 nen khong tu tai duoc.
  => Script nay chay tren chinh may anh Huynn (cung LAN) va ghi thang vao thu
     muc du an. Lay dung tung byte tu server, khong qua DOM, khong bien dang.

CACH CHAY
---------
    cd C:\\Claude_Code\\gia_lap_thiet_bi_mang\\devices\\ac1000hi\\src
    python crawl_that.py

Script se hoi ten dang nhap va mat khau. Mat khau go vao KHONG hien tren man
hinh va KHONG duoc ghi vao bat ky file nao (chi dung de mo phien dang nhap).

CHI DOC — script nay TUYET DOI khong ghi/sua gi tren thiet bi:
  - chi gui GET, khong gui POST/PUT/DELETE
  - khong bam Apply/Save/Reboot
  - khong goi /cgi-bin/logout.cgi (de khong lam mat phien dang nhap tren Chrome)

KET QUA
-------
  reference/html/<ten>.html      45 trang (43 tra 200, 2 tra 404 — giu nguyen)
  reference/js/<ten>.js          9 file JS goc
  reference/css/style.css        1 file CSS goc
  reference/img/<ten>            3 anh
  reference/source/manifest_crawl.json   bang ke: duong dan, ma HTTP, so byte,
                                         sha256 — de doi chieu ve sau
"""
import hashlib
import http.cookiejar
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from getpass import getpass

# --------------------------------------------------------------------------
# 1. Cau hinh
# --------------------------------------------------------------------------
IP = "192.168.1.1"
GOC = f"http://{IP}"

_HERE = os.path.dirname(os.path.abspath(__file__))
REF = os.path.abspath(os.path.join(_HERE, "..", "reference"))

# 45 duong dan da do THAT bang Chrome ngay 2026-08-22 (xem spec/menu-tree.json).
# Giu nguyen thu tu: trang khung truoc, roi 6 nhom menu.
TRANG = [
    # --- khung ---
    "/cgi-bin/login.asp",
    "/cgi-bin/index.asp",
    "/cgi-bin/status.asp",
    "/cgi-bin/blank.asp",
    "/cgi-bin/refresh.asp",
    # --- 6 file navigation ---
    "/cgi-bin/navigation-status.asp",
    "/cgi-bin/navigation-basic.asp",
    "/cgi-bin/navigation-access.asp",
    "/cgi-bin/navigation-advanced.asp",
    "/cgi-bin/navigation-maintenance.asp",
    "/cgi-bin/navigation-help.asp",
    # --- Status (6) ---
    "/cgi-bin/status_deviceinfo.asp",
    "/cgi-bin/status_log.cgi",
    "/cgi-bin/status_statistics.asp",
    "/cgi-bin/EthernetStatus.asp",
    "/cgi-bin/devicetable.asp",
    "/cgi-bin/wirelessSignal.asp",
    # --- Network (7) ---
    "/cgi-bin/home_wizard.asp",
    "/cgi-bin/home_wan.asp",
    "/cgi-bin/home_lan.asp",
    "/cgi-bin/home_wireless.asp",
    "/cgi-bin/home_wireless_5g.asp",
    "/cgi-bin/adv_nat_top.asp",
    "/cgi-bin/adv_qos.asp",
    # --- Access (5) ---
    "/cgi-bin/access_upnp.asp",
    "/cgi-bin/access_ddns.asp",
    "/cgi-bin/access_cwmp.asp",          # thiet bi tra 404 — VAN tai de luu bang chung
    "/cgi-bin/access_auth.asp",
    "/cgi-bin/access_parentalControl.asp",
    # --- Advanced (6) ---
    "/cgi-bin/adv_firewall.asp",
    "/cgi-bin/adv_routing_table.asp",
    "/cgi-bin/adv_portbinding.asp",      # thiet bi tra 404 — VAN tai de luu bang chung
    "/cgi-bin/adv_nat_alg_switch.asp",
    # --- Maintenance (7) ---
    "/cgi-bin/tools_admin.asp",
    "/cgi-bin/tools_time.asp",
    "/cgi-bin/tools_update.asp",
    "/cgi-bin/tools_system.asp",
    "/cgi-bin/tools_test.asp",
    "/cgi-bin/tools_wifitimer.asp",
    "/cgi-bin/tools_reboottimer.asp",
    # --- Help (5) ---
    "/cgi-bin/help_status.asp",
    "/cgi-bin/help_interface.asp",
    "/cgi-bin/help_access.asp",
    "/cgi-bin/help_advanced.asp",
    "/cgi-bin/help_maintenance.asp",
]

TAI_NGUYEN = [
    # --- lay tu thuoc tinh src=/href= trong HTML ---
    "/style.css",
    "/jsl.js", "/general.js", "/ip.js", "/val.js",
    "/wanfunc.js", "/mac.js", "/ip_new.js", "/spin.js", "/pvc.js",
    "/exclamation.gif", "/login.png", "/logo.png",
    # --- BO SUNG: nam trong url(...) cua CSS, KHONG co trong src=/href= ---
    # Bai hoc cu cua du an (xem memory 'AX3000GZ sim'): phai quet ca url() trong
    # CSS, neu khong se thieu anh/nen/font va giao dien lech ma khong biet vi sao.
    "/bg.gif",                  # nen ke soc cua khung dang nhap (#div_visite)
    "/usr.png",                 # icon nguoi dung trong o username
    "/pwd.png",                 # icon chia khoa trong o password
    "/PIE.htc",                 # behavior cho IE cu (bo goc) — tai de day du
    "/BeVietnam-Regular.ttf",   # font chu thuong
    "/BeVietnam-Bold.ttf",      # font chu dam
]


# --------------------------------------------------------------------------
# 2. Tien ich
# --------------------------------------------------------------------------
def mo_phien():
    """Tao mot opener giu cookie phien (giong trinh duyet)."""
    cj = http.cookiejar.CookieJar()
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    op.addheaders = [
        ("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                       "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"),
        ("Accept", "text/html,application/xhtml+xml,*/*"),
    ]
    return op, cj


def dat_cookie(cj, ten, gia_tri):
    """Dat mot cookie thuong (path=/) vao cookiejar, y het document.cookie cua JS."""
    c = http.cookiejar.Cookie(
        version=0, name=ten, value=gia_tri, port=None, port_specified=False,
        domain=IP, domain_specified=True, domain_initial_dot=False,
        path="/", path_specified=True, secure=False, expires=None,
        discard=True, comment=None, comment_url=None, rest={}, rfc2109=False,
    )
    cj.set_cookie(c)


def tai(op, duong_dan, referer=None):
    """GET mot duong dan. Tra ve (ma_http, bytes). Khong nem loi khi 404/401."""
    url = GOC + duong_dan
    req = urllib.request.Request(url)
    if referer:
        req.add_header("Referer", GOC + referer)
    try:
        with op.open(req, timeout=20) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()
    except Exception as e:                                   # noqa: BLE001
        return 0, str(e).encode("utf-8", "replace")


def ghi(thu_muc, ten, du_lieu):
    os.makedirs(thu_muc, exist_ok=True)
    p = os.path.join(thu_muc, ten)
    with open(p, "wb") as f:
        f.write(du_lieu)
    return p


def ten_file(duong_dan):
    """/cgi-bin/home_wan.asp -> home_wan.asp ; /style.css -> style.css"""
    return duong_dan.rstrip("/").split("/")[-1] or "index"


def la_trang_login(du_lieu):
    """Nhan dien bi da ve trang dang nhap (dau hieu phien khong hop le)."""
    t = du_lieu[:4000].decode("utf-8", "ignore").lower()
    return ("id=\"password\"" in t or "id='password'" in t) and "submitform" in t


# --------------------------------------------------------------------------
# 3. Chuong trinh chinh
# --------------------------------------------------------------------------
def main():
    print("=" * 70)
    print("CRAWL ONT AC1000HI — chi doc, khong ghi gi len thiet bi")
    print("Thiet bi:", GOC)
    print("Luu vao :", REF)
    print("=" * 70)

    op, cj = mo_phien()

    # --- Buoc 1: lay trang login TRUOC khi dang nhap (ban goc, chua co phien) ---
    ma, noi_dung = tai(op, "/cgi-bin/login.asp")
    if ma != 200:
        print(f"[X] Khong mo duoc trang login (ma {ma}). Kiem tra lai ket noi toi {IP}.")
        return 1
    ghi(os.path.join(REF, "html"), "login.asp.html", noi_dung)
    print(f"[v] login.asp (chua dang nhap) — {len(noi_dung)} byte")

    # --- Buoc 2: dang nhap ---
    print("\nNhap tai khoan quan tri cua thiet bi (mat khau se KHONG hien ra"
          " va KHONG duoc luu vao file nao):")
    user = input("  Ten dang nhap [admin]: ").strip() or "admin"
    pw = getpass("  Mat khau           : ")

    # CO CHE DANG NHAP THAT (doc nguyen van ham submitform() trong login.asp,
    # 2026-08-22 — xem reference/source/do_co_che_dang_nhap.json):
    #
    #     var cookie = "uid=" + username.value + ";path=/;";  document.cookie = cookie;
    #     var cookie = "psw=" + password.value + ";path=/;";  document.cookie = cookie;
    #     top.location.replace("/cgi-bin/reqLogin");
    #
    # Tuc la: KHONG submit form (nut la type=button, ham khong goi form.submit()).
    # JS chi dat 2 cookie 'uid'/'psw' roi GOI /cgi-bin/reqLogin. Server doc 2
    # cookie do, xac thuc, cap SESSIONID roi chuyen huong vao trong.
    # (Doan dat SESSIONID=0a3b9256 co san trong ma nhung DA BI CHU THICH — khong dung.)
    #
    # Ban dau script nay doan sai la form GET ?username=&password= — thiet bi tra
    # nguyen trang login (200) va moi trang trong deu 401. Da sua theo ma that.
    # Buoc "moi": phai cham vao mot trang trong TRUOC de thiet bi cap SESSIONID.
    # Do that: GET /cgi-bin/index.asp khi chua co phien -> 401 + Set-Cookie: SESSIONID.
    # Trinh duyet that cung di qua buoc nay (nguoi dung go 192.168.1.1 -> bi 401 ->
    # JS chuyen ve login.asp), nen luc bam Login da co san SESSIONID trong tui cookie.
    tai(op, "/cgi-bin/index.asp")
    ten_ck = [c.name for c in cj]
    print(f"    (cookie sau buoc moi: {ten_ck})")

    dat_cookie(cj, "uid", user)
    dat_cookie(cj, "psw", pw)
    ma, noi_dung = tai(op, "/cgi-bin/reqLogin", referer="/cgi-bin/login.asp")
    if ma not in (200, 302):
        print(f"[X] Dang nhap that bai tai /cgi-bin/reqLogin, ma HTTP {ma}.")
        print(f"    cookie dang giu : {[c.name for c in cj]}")
        print(f"    do dai phan hoi : {len(noi_dung)} byte")
        print(f"    200 ky tu dau   : {noi_dung[:200].decode('utf-8','ignore')!r}")
        print("\n    => Hay gui nguyen doan tren cho Claude.")
        return 1

    # Kiem chung phien: thu mo mot trang chi co sau khi dang nhap
    ma_kt, kt = tai(op, "/cgi-bin/status_deviceinfo.asp")
    if ma_kt != 200 or la_trang_login(kt):
        print("[X] Dang nhap KHONG thanh cong (van bi tra ve trang login).")
        print("    Kiem tra lai ten dang nhap / mat khau, hoac thiet bi chi cho")
        print("    mot phien dang nhap — hay dong tab Chrome dang mo thiet bi")
        print("    roi chay lai script nay.")
        return 1
    print("[v] Dang nhap thanh cong, phien hop le.\n")

    # --- Buoc 3: tai toan bo trang ---
    bang_ke = []
    print("--- Tai cac trang HTML ---")
    for dp in TRANG:
        ma, du_lieu = tai(op, dp)
        canh_bao = ""
        if ma == 200 and la_trang_login(du_lieu) and dp != "/cgi-bin/login.asp":
            canh_bao = "  <== CANH BAO: noi dung la trang LOGIN, phien co the da het han"
        ghi(os.path.join(REF, "html"), ten_file(dp) + ".html", du_lieu)
        bang_ke.append({
            "duong_dan": dp,
            "ma_http": ma,
            "byte": len(du_lieu),
            "sha256": hashlib.sha256(du_lieu).hexdigest(),
            "luu_tai": "reference/html/" + ten_file(dp) + ".html",
        })
        print(f"  {ma}  {len(du_lieu):>7} byte  {dp}{canh_bao}")

    # --- Buoc 4: tai tai nguyen tinh ---
    # BAI HOC 2026-08-22: script Python nay (dung urllib) bi thiet bi TU CHOI
    # (tra ve than 401, 140 byte) khi tai dung 3 file duoi day, KE CA khi da
    # dang nhap thanh cong — trong khi Chrome that tai duoc binh thuong (200,
    # dung kich thuoc). Co che phan biet client chua ro. Neu ghi de mu quang,
    # 3 file font/htc trong reference/img/ se bi hong thanh 140 byte loi.
    # Xem devices/ac1000hi/CLAUDE.md muc 5.2c va ISSUES.md.
    KHONG_TIN_PYTHON = {"/PIE.htc", "/BeVietnam-Regular.ttf", "/BeVietnam-Bold.ttf"}
    print("\n--- Tai tai nguyen tinh (CSS/JS/anh) ---")
    for dp in TAI_NGUYEN:
        ma, du_lieu = tai(op, dp)
        ten = ten_file(dp)
        if ten.endswith(".css"):
            tm = os.path.join(REF, "css")
        elif ten.endswith(".js"):
            tm = os.path.join(REF, "js")
        else:
            tm = os.path.join(REF, "img")
        duong_luu = os.path.join(tm, ten)
        if dp in KHONG_TIN_PYTHON and (ma != 200 or len(du_lieu) < 1000):
            print(f"  {ma}  {len(du_lieu):>7} byte  {dp}  <== BO QUA, KHONG GHI "
                  f"(Python hay bi tu choi voi file nay — xem CLAUDE.md 5.2c). "
                  f"Giu nguyen file cu tren dia, dung Chrome de tai lai neu can.")
            bang_ke.append({
                "duong_dan": dp, "ma_http": ma, "byte": len(du_lieu),
                "sha256": None, "luu_tai": os.path.relpath(duong_luu, REF).replace("\\", "/"),
                "ghi_chu": "BO QUA — Python bi tu choi, xem CLAUDE.md 5.2c. Da giu file cu.",
            })
            continue
        ghi(tm, ten, du_lieu)
        bang_ke.append({
            "duong_dan": dp,
            "ma_http": ma,
            "byte": len(du_lieu),
            "sha256": hashlib.sha256(du_lieu).hexdigest(),
            "luu_tai": os.path.relpath(duong_luu, REF).replace("\\", "/"),
        })
        print(f"  {ma}  {len(du_lieu):>7} byte  {dp}")

    # --- Buoc 5: ghi bang ke ---
    tong = sum(x["byte"] for x in bang_ke)
    so_200 = sum(1 for x in bang_ke if x["ma_http"] == 200)
    so_404 = sum(1 for x in bang_ke if x["ma_http"] == 404)
    bao_cao = {
        "_tieu_de": "Bang ke crawl thiet bi that ONT AC1000HI",
        "_thiet_bi": GOC,
        "_ghi_chu": "Chay bang devices/ac1000hi/src/crawl_that.py tren may anh Huynn "
                    "(cung LAN voi thiet bi). Chi gui GET, khong ghi gi len thiet bi.",
        "tong_ket": {
            "so_muc": len(bang_ke),
            "tra_200": so_200,
            "tra_404": so_404,
            "tong_byte": tong,
        },
        "danh_sach": bang_ke,
    }
    os.makedirs(os.path.join(REF, "source"), exist_ok=True)
    p = os.path.join(REF, "source", "manifest_crawl.json")
    with open(p, "w", encoding="utf-8") as f:
        json.dump(bao_cao, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 70)
    print(f"XONG: {len(bang_ke)} muc — {so_200} tra 200, {so_404} tra 404 — "
          f"tong {tong:,} byte")
    print("Bang ke:", p)
    print("=" * 70)
    return 0


if __name__ == "__main__":
    sys.exit(main())
