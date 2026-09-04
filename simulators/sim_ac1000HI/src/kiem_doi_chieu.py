#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
BO KIEM DOI CHIEU TOAN DIEN — ONT AC1000HI
==========================================
Doi chieu ban gia lap voi BANG CHUNG GOC tai ve tu thiet bi that.

Chay:
    cd C:\\Claude_Code\\gia_lap_thiet_bi_mang\\devices\\ac1000hi\\src
    python kiem_doi_chieu.py

Script TU BAT server rieng o cong 8096 (khong dung cong 8095 dang chay), chay
xong tu tat — nen chay duoc song song voi server day hoc.
"""
import hashlib
import http.cookiejar
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

_HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, _HERE)
from . import config_store as _kho                                  # noqa: E402


def doc_kho(khoa):
    return _kho.doc(khoa)


REF = os.path.abspath(os.path.join(_HERE, "..", "reference"))
WWW = os.path.join(_HERE, "www")
PORT = 8096
CS = f"http://127.0.0.1:{PORT}"

loi = []
so_kiem = 0


def kiem(dieu_kien, mo_ta, chi_tiet=""):
    global so_kiem
    so_kiem += 1
    if dieu_kien:
        print(f"  OK   {mo_ta}")
    else:
        print(f"  SAI  {mo_ta}" + (f"  [{chi_tiet}]" if chi_tiet else ""))
        loi.append(mo_ta + (f" [{chi_tiet}]" if chi_tiet else ""))


def sha(p):
    with open(p, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()


KHONG_CO_THAT = set()

TEP_TUNG_BO_SOT = {
    "BeVietnam-Regular.ttf": 86308,
    "BeVietnam-Bold.ttf": 88456,
    "PIE.htc": 41137,
}

TRANG_DONG = {
    "status_deviceinfo.asp",
    "status_statistics.asp",
    "status_log.cgi",
    "EthernetStatus.asp",
    "devicetable.asp",
    "home_lan.asp",
}


def _dem_the(p):
    with open(p, encoding="utf-8", errors="ignore") as f:
        t = f.read()
    return len(re.findall(r"<[a-zA-Z][^>]*>", t)), len(t.splitlines())


def dat_ck(cj, k, v):
    ck = http.cookiejar.Cookie(
        0, k, v, None, False, "127.0.0.1", False, False, "/", True, False,
        None, False, None, None, {})
    cj.set_cookie(ck)


def nhom_A_tung_byte():
    print("\n=== A. src/www phai trung khit voi reference/ ===")
    n_tinh = n_dong = 0
    for ten in sorted(os.listdir(os.path.join(REF, "html"))):
        goc = os.path.join(REF, "html", ten)
        ten_that = ten[:-5]
        dich = os.path.join(WWW, "cgi-bin", ten_that)
        if not os.path.exists(dich):
            kiem(False, f"co file gia lap cho {ten}", "thieu " + dich)
            continue
        if ten_that in TRANG_DONG:
            n_dong += 1
            a, b = _dem_the(goc), _dem_the(dich)
            if a != b:
                kiem(False, f"cau truc {ten_that} (trang dong)",
                     f"the/dong goc={a} gia lap={b}")
        else:
            n_tinh += 1
            if sha(goc) != sha(dich):
                kiem(False, f"trung khit tung byte {ten_that}", "sha256 khac nhau")
    kiem(True, f"{n_tinh} trang TINH trung khit tung byte (sha256)")
    kiem(True, f"{n_dong} trang DONG trung khit cau truc (so the + so dong)")

    n_tn = 0
    for thu_muc in ("css", "js", "img"):
        d = os.path.join(REF, thu_muc)
        if not os.path.isdir(d):
            continue
        for ten in sorted(os.listdir(d)):
            if ten in KHONG_CO_THAT:
                dich = os.path.join(WWW, ten)
                kiem(not os.path.exists(dich),
                     f"KHONG tu them {ten} (thiet bi that khong co)",
                     "dang co trong www!" if os.path.exists(dich) else "")
                continue
            goc = os.path.join(d, ten)
            dich = os.path.join(WWW, ten)
            if not os.path.exists(dich):
                kiem(False, f"co tai nguyen {ten}", "thieu " + dich)
                continue
            n_tn += 1
            if sha(goc) != sha(dich):
                kiem(False, f"trung khit {ten}", "sha256 khac nhau")
    kiem(True, f"{n_tn} tai nguyen tinh trung khit tung byte")


def nhom_B_du_file():
    print("\n=== B. Du file so voi bang ke crawl ===")
    p = os.path.join(REF, "source", "manifest_crawl.json")
    if not os.path.exists(p):
        kiem(False, "co bang ke crawl", "thieu manifest_crawl.json")
        return None
    with open(p, encoding="utf-8") as f:
        bk = json.load(f)
    kiem(bk["tong_ket"]["so_muc"] > 0, f"bang ke co {bk['tong_ket']['so_muc']} muc")
    thieu = []
    for m in bk["danh_sach"]:
        dp = m["duong_dan"]
        ten = dp.rstrip("/").split("/")[-1]
        if ten in KHONG_CO_THAT:
            continue
        dich = (os.path.join(WWW, "cgi-bin", ten) if dp.startswith("/cgi-bin/")
                else os.path.join(WWW, ten))
        if not os.path.exists(dich):
            thieu.append(dp)
    kiem(not thieu, "khong thieu file nao so voi bang ke",
         "thieu: " + ", ".join(thieu) if thieu else "")
    return bk


def nhom_C_hop_dong(bk):
    print("\n=== C. Hop dong HTTP (so voi thiet bi that) ===")
    cj = http.cookiejar.CookieJar()
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

    def goi(dp, redirect=True):
        cl = op if redirect else urllib.request.build_opener(
            urllib.request.HTTPCookieProcessor(cj), KhongTheoRedirect)
        try:
            with cl.open(CS + dp, timeout=10) as r:
                return r.status, r.read(), dict(r.headers)
        except urllib.error.HTTPError as e:
            return e.code, e.read(), dict(e.headers)

    class KhongTheoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, *a, **k):
            return None

    than_that = (b'<HTML><HEAD><TITLE>Login</TITLE><script language=javascript>'
                 b'top.location.replace("/cgi-bin/login.asp");</script></HEAD>'
                 b'<body></body></HTML>\n')
    for dp in ("/cgi-bin/index.asp", "/cgi-bin/status_deviceinfo.asp",
               "/cgi-bin/home_wan.asp"):
        ma, than, h = goi(dp)
        kiem(ma == 401, f"C1 {dp} chua dang nhap -> 401", f"nhan {ma}")
        kiem(than == than_that, f"C1 {dp} than 401 dung nguyen van",
             f"lech than: {len(than)} != {len(than_that)} byte")
        kiem("charset=gb2312" in h.get("Content-Type", ""),
             f"C1 {dp} charset gb2312", h.get("Content-Type"))
        kiem("SESSIONID=" in h.get("Set-Cookie", ""),
             f"C1 {dp} co cap SESSIONID", h.get("Set-Cookie"))

    ma, than, _ = goi("/cgi-bin/login.asp")
    kiem(ma == 200, "C2 login.asp cong khai -> 200", f"nhan {ma}")
    kiem(len(than) == 16286, "C2 login.asp dung 16286 byte", f"dang {len(than)}")

    dat_ck(cj, "uid", "admin")
    dat_ck(cj, "psw", "sai_mat_khau")
    ma, than, _ = goi("/cgi-bin/reqLogin", redirect=False)
    kiem(ma == 401, "C3 reqLogin sai mat khau -> 401", f"nhan {ma}")

    dat_ck(cj, "psw", "admin")
    ma, than, h = goi("/cgi-bin/reqLogin", redirect=False)
    kiem(ma == 302 and h.get("Location") == "/cgi-bin/index.asp",
         "C4 reqLogin dung -> vao duoc trang trong", f"nhan {ma} {h.get('Location')}")

    ma, than, _ = goi("/cgi-bin/index.asp")
    kiem(b"<frameset" in than.lower(), "C4 trang trong la frameset")
    kiem(len(than) == 7093, "C4 index.asp dung 7093 byte", f"dang {len(than)}")
    kiem(any(c.name == "SESSIONID" for c in cj), "C4 da cap SESSIONID")

    for dp, n in (("/cgi-bin/status.asp", 9315),
                 ("/cgi-bin/navigation-status.asp", 3763),
                 ("/cgi-bin/blank.asp", 798),
                 ("/cgi-bin/refresh.asp", 399)):
        ma, than, _ = goi(dp)
        kiem(ma == 200 and len(than) == n,
             f"C5 {dp.split('/')[-1]} -> 200, {n} byte",
             f"nhan {ma}, {len(than)} byte")

    ma, than, _ = goi("/cgi-bin/status_deviceinfo.asp")
    kiem(ma == 200, "C5 status_deviceinfo.asp -> 200", f"nhan {ma}")
    t_str = than.decode("utf-8", "ignore")
    nthe = len(re.findall(r"<[a-zA-Z][^>]*>", t_str))
    kiem(nthe == 244, f"C5 status_deviceinfo.asp giu nguyen cau truc ({nthe} the)",
         f"ky vong 244, dang {nthe}")

    for truong, khoa in (("Serial Number", "device.serial_number"),
                         ("Model", "device.model"),
                         ("Software Version", "device.software_version"),
                         ("MAC Address", "device.mac_address"),
                         ("GPON Link Status", "gpon.link_status")):
        gt = doc_kho(khoa)
        co = bool(re.search(r'>\s*' + re.escape(truong) + r'\s*(?:</font>)?\s*</td>', t_str, re.I)) and gt in t_str
        kiem(co, f"C5b {truong} lay dung tu kho cau hinh (= {gt})")

    for dp in ("/cgi-bin/access_cwmp.asp", "/cgi-bin/adv_portbinding.asp"):
        ma, than, _ = goi(dp)
        kiem(ma == 404, f"C6 {dp.split('/')[-1]} -> 404 y het that", f"nhan {ma}")

    goi("/cgi-bin/logout.cgi")
    ma, _, _ = goi("/cgi-bin/index.asp")
    kiem(ma == 401, "C7 sau logout -> index.asp tra 401 lai", f"nhan {ma}")


def nhom_D_tai_nguyen():
    print("\n=== D. Tai nguyen ma HTML/CSS tham chieu deu phuc vu duoc ===")
    cj = http.cookiejar.CookieJar()
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    ds = ["/style.css", "/jsl.js", "/general.js", "/ip.js", "/val.js",
          "/wanfunc.js", "/mac.js", "/ip_new.js", "/spin.js", "/pvc.js",
          "/exclamation.gif", "/login.png", "/logo.png",
          "/bg.gif", "/usr.png", "/pwd.png",
          "/PIE.htc", "/BeVietnam-Regular.ttf", "/BeVietnam-Bold.ttf"]
    loi_tn = []
    for dp in ds:
        try:
            with op.open(CS + dp, timeout=10) as r:
                if r.status != 200:
                    loi_tn.append(f"{dp} -> {r.status}")
        except urllib.error.HTTPError as e:
            loi_tn.append(f"{dp} -> {e.code}")
    kiem(not loi_tn, f"tat ca {len(ds)} tai nguyen deu phuc vu duoc (200)",
         "loi: " + ", ".join(loi_tn) if loi_tn else "")

    loi_kt = []
    for ten, sz in TEP_TUNG_BO_SOT.items():
        try:
            with op.open(CS + "/" + ten, timeout=10) as r:
                b = r.read()
                if len(b) != sz:
                    loi_kt.append(f"{ten}: nhan {len(b)} != {sz}")
        except Exception as e:                               # noqa: BLE001
            loi_kt.append(f"{ten}: {e}")
    kiem(not loi_kt, "3 tep tung bi bo sot (2 font Be Vietnam + PIE.htc) dung kich thuoc that",
         ", ".join(loi_kt) if loi_kt else "")


def nhom_E_font():
    print("\n=== E. Font — 2 tep Be Vietnam phai co that va dung noi dung ===")
    for ten, byte_that in (("BeVietnam-Regular.ttf", 86308),
                           ("BeVietnam-Bold.ttf", 88456)):
        p = os.path.join(WWW, ten)
        if not os.path.exists(p):
            kiem(False, f"E1 co tep {ten}", "KHONG CO trong www/")
            continue
        n = os.path.getsize(p)
        kiem(n == byte_that, f"E1 {ten} dung {byte_that} byte", f"dang la {n}")

        with open(p, "rb") as f:
            dau = f.read(4)
        la_ttf = dau in (b"\x00\x01\x00\x00", b"true", b"ttcf", b"OTTO")
        kiem(la_ttf, f"E2 {ten} that su la font TrueType",
             f"4 byte dau = {dau!r}")

    p = os.path.join(WWW, "PIE.htc")
    if os.path.exists(p):
        with open(p, "rb") as f:
            dau = f.read(5)
        kiem(os.path.getsize(p) == 41137, "E3 PIE.htc dung 41137 byte",
             f"dang la {os.path.getsize(p)}")
        kiem(dau != b"<HTML", "E3 PIE.htc khong phai trang 401 doi lot",
             "dang la trang 401")
    else:
        kiem(False, "E3 co tep PIE.htc", "KHONG CO trong www/")


def nhom_F_nhom_status(goi):
    print("\n=== F. Nhom Status — 4 trang noi vao kho cau hinh (muc 4) ===")
    ma, than, _ = goi("/cgi-bin/status_statistics.asp")
    kiem(ma == 200, "F1 status_statistics.asp -> 200", f"nhan {ma}")
    t = than.decode("utf-8", "ignore")
    kiem(f">{doc_kho('statistics.transmit_frames')}<" in t,
         f"F1 Transmit Frames = {doc_kho('statistics.transmit_frames')} (lay tu kho)")
    kiem(f">{doc_kho('statistics.receive_frames')}<" in t,
         f"F1 Receive Frames = {doc_kho('statistics.receive_frames')} (lay tu kho)")
    kiem(f">{doc_kho('statistics.transmit_total_bytes')}<" in t,
         f"F1 Transmit total Bytes = {doc_kho('statistics.transmit_total_bytes')} (lay tu kho)")
    kiem(f">{doc_kho('statistics.receive_crc_errors')}<" in t,
         f"F1 Receive CRC Errors = {doc_kho('statistics.receive_crc_errors')} (lay tu kho)")

    ma, than, _ = goi("/cgi-bin/EthernetStatus.asp")
    t = than.decode("utf-8", "ignore")
    m = re.search(r"var\s+tableData\s*=\s*\[(.*?)\];", t, re.S)
    kiem(m is not None, "F2 EthernetStatus co mang tableData")
    if m:
        dong = [d.strip() for d in m.group(1).splitlines() if d.strip() and d.strip() != ","]
        kiem(len(dong) == 4, f"F2 dung 4 cong (dang co {len(dong)})")
        kiem('"1"' in dong[0] and '"100"' in dong[0] and '"20666"' in dong[0],
             "F2 cong 1: speed=100 sent=20666 (tu kho)")

    ma, than, _ = goi("/cgi-bin/devicetable.asp")
    t = than.decode("utf-8", "ignore")
    m = re.search(r"var\s+tableData\s*=\s*\[(.*?)\];", t, re.S)
    kiem(m is not None, "F3 devicetable co mang tableData")
    if m:
        dong = [d.strip() for d in m.group(1).splitlines() if d.strip() and d.strip() != ","]
        kiem(len(dong) == 4, "F3 luon ve du 4 dong (giong that)")
        kiem("Admin-PC" in dong[0] and "D8:43:AE:2E:65:45" in dong[0],
             "F3 thiet bi 1 = Admin-PC / D8:43:AE:2E:65:45 (tu kho)")
        kiem(all("N/A" in d for d in dong[1:]),
             "F3 dong thua dien N/A (khong bo di cho gon)")

    ma, than, _ = goi("/cgi-bin/wirelessSignal.asp")
    t = than.decode("utf-8", "ignore")
    kiem("config_store.wireless_clients" in t,
         "F4 wirelessSignal co bom du lieu tu kho")
    kiem("var hostNameTable2 = " in t, "F4 co mang hostNameTable2")
    m_all = re.findall(r"var\s+hostNameTable2\s*=\s*\[(.*?)\];", t, re.S)
    m_valid = [m for m in m_all if m.strip()]
    if m_valid:
        pt = [x.strip() for x in m_valid[0].split(",") if x.strip()]
        kiem(len(pt) == 12, f"F4 ve du 12 dong (giong that, dang {len(pt)})")
    else:
        kiem(False, "F4 tim thay mang hostNameTable2 co 12 phan tu")

    _kho.ghi("wireless_clients", [
        {"ten": "May-Hoc-Vien-Huynn", "ip": "192.168.1.10", "mac": "AA:BB:CC:DD:EE:FF",
         "rssi1": "-45", "rssi2": "-48"}
    ])
    ma, than, _ = goi("/cgi-bin/wirelessSignal.asp")
    t = than.decode("utf-8", "ignore")
    kiem("May-Hoc-Vien-Huynn" in t and "AA:BB:CC:DD:EE:FF" in t,
         "F4 may Wi-Fi trong kho hien dung tren trang")
    _kho.ghi("wireless_clients", [])


def nhom_G_nhom_help(goi):
    print("\n=== G. Nhom Help — 5 trang tinh (muc 3 la tran) ===")
    trang = ["help_status.asp", "help_interface.asp", "help_access.asp",
             "help_advanced.asp", "help_maintenance.asp"]
    for ten in trang:
        ma, than, _ = goi("/cgi-bin/" + ten)
        n = os.path.getsize(os.path.join(REF, "html", ten + ".html"))
        kiem(ma == 200 and len(than) == n, f"G1 {ten} -> 200, dung {n} byte",
             f"nhan {ma}, {len(than)} byte")

    for ten in trang:
        with open(os.path.join(REF, "html", ten + ".html"),
                  encoding="utf-8", errors="ignore") as f:
            t = f.read()
        dong = bool(re.search(r"XMLHttpRequest|fetch\s*\(|setInterval", t))
        kiem(not dong, f"G2 {ten} khong co script dong")

    ma, than, _ = goi("/cgi-bin/navigation-help.asp")
    t = than.decode("utf-8", "ignore")
    thieu = [x for x in trang if x not in t]
    kiem(ma == 200 and not thieu, "G3 navigation-help.asp tro du 5 trang")


def nhom_H_network_lan(goi):
    print("\n=== H. Network > LAN — noi kho cau hinh ===")
    ma, than, _ = goi("/cgi-bin/home_lan.asp")
    kiem(ma == 200, "H1 home_lan.asp -> 200", f"nhan {ma}")
    t = than.decode("utf-8", "ignore")
    lan = doc_kho("lan") or {}
    for ten_o in ("uiViewIPAddr", "uiViewNetMask", "StartIp", "PoolSize",
                  "dhcp_LeaseTime", "uiValidLifetimeRadvd"):
        m = re.search(r'<input\b[^>]*\bname\s*=\s*(?:["\']' + ten_o
                      + r'["\']|' + ten_o + r'(?=[\s>]))[^>]*?\bvalue\s*=\s*["\'](.*?)["\']',
                      t, re.I | re.S)
        kiem(m is not None and m.group(1) == str(lan.get(ten_o)),
             f"H2 o {ten_o} = {lan.get(ten_o)} (lay tu kho)",
             f"dang la {m.group(1) if m else '(khong tim thay)'}")

    radio = re.findall(r'<input\b[^>]*NAME="dnsTypeRadio"[^>]*>', t, re.I)
    kiem(len(radio) == 2, "H3 co dung 2 nut radio dnsTypeRadio", f"co {len(radio)}")
    kiem(all('VALUE="0"' in radio[0] or 'VALUE="1"' in radio[1] for _ in [1]),
         "H3 hai nut giu nguyen VALUE 0 va 1 (khong bi ghi de)")
    da_chon = [r for r in radio if re.search(r'\bchecked\b', r, re.I)]
    kiem(len(da_chon) == 1, "H3 chi MOT nut duoc checked", f"co {len(da_chon)} nut checked")

    ds = doc_kho("dhcp_leases") or []
    m = re.search(r"var\s+tableData\s*=\s*\[(.*?)\];", t, re.S)
    kiem(m is not None, "H4 co bang DHCP lease")
    if m and ds:
        kiem(ds[0]["ten"] in m.group(1) and ds[0]["ip"] in m.group(1),
             f"H4 lease 1 = {ds[0]['ten']} / {ds[0]['ip']} (tu kho)")
        kiem("Ethernet" not in m.group(1),
             "H4 bang lease khong co cot Type (khac devicetable.asp)")


def nhom_I_chieu_ghi(op):
    print("\n=== I. Chieu ghi (bam Save) — theo hop dong tu HAR that ===")
    dp = "/cgi-bin/home_lan.asp"
    cu = doc_kho("lan.uiViewIPAddr")

    than = urllib.parse.urlencode({
        "uiViewIPAddr": "172.16.0.1",
        "uiViewNetMask": "255.255.0.0",
        "StartIp": "172.16.0.50",
        "PoolSize": "100",
        "uiViewAliasIPAddr": "",
        "dnsTypeRadio": "1",
        "truong_la_de_thu": "xyz",
    }).encode()

    req = urllib.request.Request(CS + dp, data=than, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    try:
        with op.open(req, timeout=10) as r:
            ma, body, hd = r.status, r.read(), dict(r.headers)
    except urllib.error.HTTPError as e:
        ma, body, hd = e.code, e.read(), dict(e.headers)

    t = body.decode("utf-8", "ignore")
    kiem(ma == 200, "I1 POST -> 200 (khong redirect)", f"nhan {ma}")
    kiem("text/html" in hd.get("Content-Type", ""),
         "I1 phan hoi la text/html (khong phai JSON)")
    kiem("<frameset" not in t.lower() and "uiViewIPAddr" in t,
         "I1 phan hoi la CHINH TRANG DO (khong phai trang khac)")

    for ten, mong in (("uiViewIPAddr", "172.16.0.1"),
                      ("StartIp", "172.16.0.50"),
                      ("PoolSize", "100")):
        m = re.search(r'<input\b[^>]*\bname\s*=\s*(?:["\']' + ten
                      + r'["\']|' + ten + r'(?=[\s>]))[^>]*?\bvalue\s*=\s*["\'](.*?)["\']', t, re.I | re.S)
        kiem(m is not None and m.group(1) == mong,
             f"I2 phan hoi hien {ten} = {mong}",
             f"dang la {m.group(1) if m else '(khong thay)'}")

    kiem(doc_kho("lan.uiViewIPAddr") == "172.16.0.1", "I3 kho da luu uiViewIPAddr moi")
    kiem(doc_kho("lan.uiViewAliasIPAddr") == "", "I3 truong RONG van duoc luu (dung hop dong)")

    lan = doc_kho("lan") or {}
    kiem("truong_la_de_thu" not in lan, "I4 truong la bi bo qua, khong tao khoa rac trong kho")

    try:
        with op.open(CS + dp, timeout=10) as r:
            t2 = r.read().decode("utf-8", "ignore")
    except urllib.error.HTTPError as e:
        t2 = e.read().decode("utf-8", "ignore")
    m = re.search(r'<input\b[^>]*\bname\s*=\s*(?:["\']uiViewIPAddr["\']|uiViewIPAddr(?=[\s>]))'
                  r'[^>]*?\bvalue\s*=\s*["\'](.*?)["\']', t2, re.I | re.S)
    kiem(m is not None and m.group(1) == "172.16.0.1",
         "I5 tai lai bang GET van giu gia tri da luu")

    op2 = urllib.request.build_opener()
    req2 = urllib.request.Request(CS + dp, data=b"uiViewIPAddr=1.2.3.4", method="POST")
    req2.add_header("Content-Type", "application/x-www-form-urlencoded")
    try:
        with op2.open(req2, timeout=10) as r:
            ma2 = r.status
    except urllib.error.HTTPError as e:
        ma2 = e.code
    kiem(ma2 == 401, "I6 POST khi chua dang nhap -> 401", f"nhan {ma2}")
    kiem(doc_kho("lan.uiViewIPAddr") == "172.16.0.1", "I6 kho KHONG bi sua boi POST khong co phien")

    cur_sid = _kho.doc("session.id_hien_tai")
    _kho.dat_lai_factory()
    if cur_sid:
        _kho.mo_phien(cur_sid)
    kiem(doc_kho("lan.uiViewIPAddr") == cu, f"I7 da dat lai kho ve seed ({cu})")


def nhom_J_maintenance(goi, op):
    print("\n=== J. Nhom Maintenance — Time Zone, Admin, WiFi/Reboot Timer (muc 4) ===")
    ma, than, _ = goi("/cgi-bin/tools_time.asp")
    t = than.decode("utf-8", "ignore")
    kiem(ma == 200, "J1 tools_time.asp GET -> 200")
    kiem('value="GMT+07:00" selected' in t, "J1 Time Zone mac dinh la GMT+07:00")
    kiem(doc_kho("tools_time.uiViewSNTPServer") in t, "J1 NTP Server lay tu kho")

    # POST ghi Time Zone
    body = urllib.parse.urlencode({
        "uiViewdateToolsTZ": "GMT+08:00",
        "uiViewSNTPServer": "pool.ntp.org",
        "SaveTime": "1"
    }).encode()
    req = urllib.request.Request(CS + "/cgi-bin/tools_time.asp", data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with op.open(req, timeout=10) as r:
        post_t = r.read().decode("utf-8", "ignore")
    kiem('value="GMT+08:00" selected' in post_t, "J2 tools_time POST phan hoi GMT+08:00 selected")
    kiem(doc_kho("tools_time.uiViewdateToolsTZ") == "GMT+08:00", "J2 kho da luu GMT+08:00")

    # tools_admin
    ma, than, _ = goi("/cgi-bin/tools_admin.asp")
    kiem(ma == 200, "J3 tools_admin.asp GET -> 200")
    body = urllib.parse.urlencode({"uiViewTools_Password": "newsecretpassword"}).encode()
    req = urllib.request.Request(CS + "/cgi-bin/tools_admin.asp", data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with op.open(req, timeout=10) as r:
        r.read()
    kiem(doc_kho("tools_admin.uiViewTools_Password") == "newsecretpassword",
         "J3 tools_admin POST da luu mat khau moi vao kho")

    # tools_wifitimer & tools_reboottimer
    ma, _, _ = goi("/cgi-bin/tools_wifitimer.asp")
    kiem(ma == 200, "J4 tools_wifitimer.asp GET -> 200")
    body = urllib.parse.urlencode({"wifitimer_enable": "1", "starttime": "07", "endtime": "23"}).encode()
    req = urllib.request.Request(CS + "/cgi-bin/tools_wifitimer.asp", data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with op.open(req, timeout=10) as r:
        r.read()
    kiem(doc_kho("tools_wifitimer.wifitimer_enable") == "1", "J4 tools_wifitimer POST da luu vao kho")

    ma, _, _ = goi("/cgi-bin/tools_reboottimer.asp")
    kiem(ma == 200, "J5 tools_reboottimer.asp GET -> 200")

    for p in ("/cgi-bin/tools_update.asp", "/cgi-bin/tools_system.asp", "/cgi-bin/tools_test.asp"):
        ma, _, _ = goi(p)
        kiem(ma == 200, f"J6 {p.split('/')[-1]} GET -> 200")


def nhom_K_access(goi, op):
    print("\n=== K. Nhom Access — UPnP, DDNS, Auth, Parental Control (muc 4) ===")
    ma, than, _ = goi("/cgi-bin/access_upnp.asp")
    kiem(ma == 200, "K1 access_upnp.asp GET -> 200")

    body = urllib.parse.urlencode({"UPnP_active": "No"}).encode()
    req = urllib.request.Request(CS + "/cgi-bin/access_upnp.asp", data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with op.open(req, timeout=10) as r:
        r.read()
    kiem(doc_kho("access_upnp.UPnP_active") == "No", "K1 access_upnp POST da luu UPnP_active = No vao kho")

    # access_ddns
    ma, than, _ = goi("/cgi-bin/access_ddns.asp")
    kiem(ma == 200, "K2 access_ddns.asp GET -> 200")
    body = urllib.parse.urlencode({"Enable_DyDNS": "Yes", "sysDNSHost": "myhome.dyndns.org"}).encode()
    req = urllib.request.Request(CS + "/cgi-bin/access_ddns.asp", data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with op.open(req, timeout=10) as r:
        r.read()
    kiem(doc_kho("access_ddns.sysDNSHost") == "myhome.dyndns.org",
         "K2 access_ddns POST da luu sysDNSHost vao kho")

    # access_auth
    ma, than, _ = goi("/cgi-bin/access_auth.asp")
    t = than.decode("utf-8", "ignore")
    kiem(ma == 200, "K3 access_auth.asp GET -> 200")
    kiem("FPTH22800025" in t, "K3 access_auth chua dung Serial Number goc")

    # access_parentalControl
    ma, _, _ = goi("/cgi-bin/access_parentalControl.asp")
    kiem(ma == 200, "K4 access_parentalControl.asp GET -> 200")


def nhom_L_advanced(goi, op):
    print("\n=== L. Nhom Advanced — Firewall, ALG, NAT, QoS, Routing (muc 4) ===")
    ma, than, _ = goi("/cgi-bin/adv_firewall.asp")
    kiem(ma == 200, "L1 adv_firewall.asp GET -> 200")

    body = urllib.parse.urlencode({"firewallEnable": "1", "spiEnable": "1"}).encode()
    req = urllib.request.Request(CS + "/cgi-bin/adv_firewall.asp", data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with op.open(req, timeout=10) as r:
        r.read()
    kiem(doc_kho("adv_firewall.firewallEnable") == "1", "L1 adv_firewall POST da luu firewallEnable = 1")

    # adv_nat_alg_switch
    ma, than, _ = goi("/cgi-bin/adv_nat_alg_switch.asp")
    kiem(ma == 200, "L2 adv_nat_alg_switch.asp GET -> 200")
    body = urllib.parse.urlencode({"sip_active": "off", "ftp_active": "off"}).encode()
    req = urllib.request.Request(CS + "/cgi-bin/adv_nat_alg_switch.asp", data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with op.open(req, timeout=10) as r:
        r.read()
    kiem(doc_kho("adv_nat_alg_switch.sip_active") == "off", "L2 adv_nat_alg_switch POST da luu sip_active = off")

    # adv_nat_top & adv_qos & adv_routing_table
    ma, _, _ = goi("/cgi-bin/adv_nat_top.asp")
    kiem(ma == 200, "L3 adv_nat_top.asp GET -> 200")
    # LUU Y (2026-08-22): ten truong THAT la "dmzHostIP" (chu thuong), KHONG
    # phai "DMZ_Host_IP" — bai kiem cu dung sai ten field nen "dat" gia tao
    # (tu no dinh nghia dung cai sai cua no), che mat 1 loi that: kho chua
    # bao gio luu duoc DMZ Host IP. Da sua kho + bai kiem theo dung ten that.
    body = urllib.parse.urlencode({"dmz_active": "Yes", "dmzHostIP": "192.168.1.55"}).encode()
    req = urllib.request.Request(CS + "/cgi-bin/adv_nat_top.asp", data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with op.open(req, timeout=10) as r:
        r.read()
    kiem(doc_kho("adv_nat_top.dmzHostIP") == "192.168.1.55", "L3 adv_nat_top POST da luu dmzHostIP (ten truong dung)")

    ma, _, _ = goi("/cgi-bin/adv_qos.asp")
    kiem(ma == 200, "L4 adv_qos.asp GET -> 200")
    ma, _, _ = goi("/cgi-bin/adv_routing_table.asp")
    kiem(ma == 200, "L5 adv_routing_table.asp GET -> 200")


def nhom_M_network(goi, op):
    print("\n=== M. Nhom Network — Wireless 2.4G, Wireless 5G, WAN (muc 4) ===")
    ma, than, _ = goi("/cgi-bin/home_wireless.asp")
    kiem(ma == 200, "M1 home_wireless.asp GET -> 200")

    body = urllib.parse.urlencode({"ESSID": "MyWiFi_24G", "PreSharedKey1": "testpass123"}).encode()
    req = urllib.request.Request(CS + "/cgi-bin/home_wireless.asp", data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with op.open(req, timeout=10) as r:
        r.read()
    kiem(doc_kho("home_wireless.ESSID") == "MyWiFi_24G", "M1 home_wireless POST da luu ESSID moi")
    kiem(doc_kho("home_wireless.PreSharedKey1") == "testpass123", "M1 home_wireless POST da luu PreSharedKey1")

    # home_wireless_5g
    ma, than, _ = goi("/cgi-bin/home_wireless_5g.asp")
    kiem(ma == 200, "M2 home_wireless_5g.asp GET -> 200")
    body = urllib.parse.urlencode({"ESSID": "MyWiFi_5G", "PreSharedKey1": "testpass5g"}).encode()
    req = urllib.request.Request(CS + "/cgi-bin/home_wireless_5g.asp", data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with op.open(req, timeout=10) as r:
        r.read()
    kiem(doc_kho("home_wireless_5g.ESSID") == "MyWiFi_5G", "M2 home_wireless_5g POST da luu ESSID moi")

    # home_wan
    ma, than, _ = goi("/cgi-bin/home_wan.asp")
    kiem(ma == 200, "M3 home_wan.asp GET -> 200")
    body = urllib.parse.urlencode({"wan_PPPUsername": "hoclaptrinh_user", "wan_PPPPassword": "mypassword"}).encode()
    req = urllib.request.Request(CS + "/cgi-bin/home_wan.asp", data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with op.open(req, timeout=10) as r:
        r.read()
    kiem(doc_kho("home_wan.wan_PPPUsername") == "hoclaptrinh_user", "M3 home_wan POST da luu wan_PPPUsername")

    # home_wizard
    ma, _, _ = goi("/cgi-bin/home_wizard.asp")
    kiem(ma == 200, "M4 home_wizard.asp GET -> 200")


def nhom_N_log_va_nhat_quan(goi, op):
    print("\n=== N. Status Log, Dat lai Factory va Nhat quan xuyen trang ===")
    ma, than, _ = goi("/cgi-bin/status_log.cgi")
    t = than.decode("utf-8", "ignore")
    kiem(ma == 200, "N1 status_log.cgi GET -> 200")
    kiem('NAME="AlphaLogDisplay"' in t, "N1 status_log.cgi co textarea nhat ky")

    # Test dat lai factory
    _kho.dat_lai_factory()
    kiem(doc_kho("lan.uiViewIPAddr") == "192.168.1.1", "N2 Factory reset: IP LAN ve 192.168.1.1")
    kiem(doc_kho("tools_time.uiViewdateToolsTZ") == "GMT+07:00", "N2 Factory reset: TimeZone ve GMT+07:00")
    kiem(doc_kho("home_wireless.ESSID") == "FPT", "N2 Factory reset: Wi-Fi 2.4G ve FPT")
    kiem(doc_kho("home_wan.wan_PPPUsername") == "fpt", "N2 Factory reset: WAN PPPoE username ve fpt")
    kiem(doc_kho("adv_firewall.firewallEnable") == "0", "N2 Factory reset: Firewall ve 0")
    kiem(doc_kho("access_upnp.UPnP_active") == "Yes", "N2 Factory reset: UPnP ve Yes")


def nhom_O_co_hanh_dong_va_bang(goi, op):
    print("\n=== O. Doi chieu CO hanh dong that + an toan cho trang co BANG ===")

    # O1: 9 co hanh dong doc duoc tan mat tu reference/html/*.asp.html phai
    # ton tai dung ten khoa trong kho (khop voi BANG_GHI["co"] trong render_dong.py)
    import render_dong as _rd
    co_da_xac_nhan = {
        "/cgi-bin/tools_time.asp": "SaveTime",
        "/cgi-bin/tools_admin.asp": "adminFlag",
        "/cgi-bin/tools_wifitimer.asp": "saveFlag",
        "/cgi-bin/tools_reboottimer.asp": "saveFlag",
        "/cgi-bin/access_upnp.asp": "SaveFlag",
        "/cgi-bin/access_ddns.asp": "SaveFlag",
        "/cgi-bin/access_auth.asp": "AuthFlag",
        "/cgi-bin/adv_firewall.asp": "fwFlag",
        "/cgi-bin/adv_nat_alg_switch.asp": "algFlag",
        "/cgi-bin/home_wan.asp": "wanSaveFlag",
        "/cgi-bin/adv_nat_top.asp": "dmzFlag",
        "/cgi-bin/adv_nat_top_VirtualServer.asp": "virsevFlag",
        "/cgi-bin/adv_nat_top_PortTriggering.asp": "TrigFlag",
        "/cgi-bin/adv_qos.asp": "QOS_Flag",
        "/cgi-bin/access_parentalControl.asp": "URLAddFlag",
        "/cgi-bin/adv_routing_table.asp": "EditFlag",
    }
    for duong_dan, ten_co in co_da_xac_nhan.items():
        cfg = _rd.BANG_GHI.get(duong_dan)
        kiem(cfg is not None and cfg.get("co") == ten_co,
             f"O1 BANG_GHI[{duong_dan}]['co'] == {ten_co!r} (doc tan mat tu reference/html/)")
        # Luu y: co hanh dong la truong HIDDEN tam thoi (JS dat=1 truoc submit),
        # KHONG bat buoc phai co san trong SEED cua config_store — nhieu trang
        # (adv_firewall.fwFlag, home_wan.wanSaveFlag) khong luu no nhu trang
        # thai thiet bi, nen KHONG kiem tra su ton tai trong kho o day.

    # O2: 4 trang co BANG (virtual_servers/qos_rules/static_routes/url_filters).
    # Ca 4 nay DA doc duoc co "them 1 dong" tu JS goc / HAR that (khong con la
    # None) — access_parentalControl van xac nhan co URLAddFlag=1 dung trong
    # JS nhung nut Add tren thiet bi that KHONG BAO GIO goi toi (dead code do
    # urlenable="0" hardcoded — xem ISSUES.md), nen KHONG the viet phep kiem
    # "them dong that" cho trang nay (khong co HAR POST nao de doi chieu).
    trang_co_bang = {
        "/cgi-bin/adv_nat_top.asp": "adv_nat_top.virtual_servers",
        "/cgi-bin/adv_qos.asp": "adv_qos.qos_rules",
        "/cgi-bin/adv_routing_table.asp": "adv_routing_table.static_routes",
        "/cgi-bin/access_parentalControl.asp": "access_parentalControl.url_filters",
    }
    trang_co_da_xac_dinh = {
        "/cgi-bin/adv_nat_top.asp", "/cgi-bin/adv_qos.asp",
        "/cgi-bin/access_parentalControl.asp", "/cgi-bin/adv_routing_table.asp",
    }
    for duong_dan, khoa_bang in trang_co_bang.items():
        cfg = _rd.BANG_GHI.get(duong_dan)
        if duong_dan in trang_co_da_xac_dinh:
            kiem(cfg is not None and cfg.get("co") is not None,
                 f"O2 {duong_dan}: da xac dinh co 'them 1 dong' ({cfg.get('co') if cfg else None})")
        else:
            kiem(cfg is not None and cfg.get("co") is None,
                 f"O2 {duong_dan}: 'co' dung la None (thuc su chua xac dinh, khong bia)")
        truoc = doc_kho(khoa_bang)
        body = urllib.parse.urlencode({"truong_gia_khong_ton_tai_XYZ": "1"}).encode()
        req = urllib.request.Request(CS + duong_dan, data=body, method="POST")
        req.add_header("Content-Type", "application/x-www-form-urlencoded")
        with op.open(req, timeout=10) as r:
            r.read()
        sau = doc_kho(khoa_bang)
        kiem(truoc == sau, f"O2 {khoa_bang}: POST truong la KHONG lam hong bang co san")

    # O3: THEM DONG THAT — dung dung body POST doc tan mat tu
    # reference/har/adv_table_actions.har (2026-08-22), doi chieu ca kho
    # LAN ket qua render HTML, khong chi so luong.
    def _post(dp, body_dict):
        body = urllib.parse.urlencode(body_dict).encode()
        req = urllib.request.Request(CS + dp, data=body, method="POST")
        req.add_header("Content-Type", "application/x-www-form-urlencoded")
        with op.open(req, timeout=10) as r:
            return r.read().decode("utf-8", "replace")

    # O3a — NAT: them Virtual Server qua URL THAT ma thiet bi dung
    # (adv_nat_top_VirtualServer.asp — xac nhan bang HAR ca 2 dot, KHONG
    # phai adv_nat_top.asp). Mang co dinh 32 o: kiem tra dung O 0 duoc dien,
    # KHONG kiem tra do dai danh sach (do dai luon la 32).
    html = _post("/cgi-bin/adv_nat_top_VirtualServer.asp", {
        "natFlag": "1", "service_num_flag": "0", "dmzFlag": "0", "saveFlag": "0",
        "dmzdeactive": "No", "dmz_remove": "0", "NATtyleChange": "1", "dmz_active": "No",
        "IPAddFlag": "0", "DMZ_IP_select": "0", "dmzHostIP": "",
        "start_port1": "8080", "end_port1": "8080",
        "VirsvrIPAddFlag": "1", "Virsvr_IP_select": "0", "Addr1": "192.168.1.99",
        "local_sport": "8080", "local_eport": "8080",
        "PortTriggering_Applications": "", "Trig_start_port": "", "Trig_end_port": "",
        "Trig_PtclChoose": "TCP/UDP", "Open_start_port": "", "Open_end_port": "",
        "Open_PtclChange": "TCP/UDP", "editTrigNum": "0", "TrigFlag": "0",
        "PortTriggering_CanUseNumFlag": "8", "editnum": "0", "virsevFlag": "2",
    })
    vs = doc_kho("adv_nat_top.virtual_servers") or []
    kiem(len(vs) == 32 and vs[0] and vs[0].get("ip") == "192.168.1.99" and vs[0].get("start_port") == "8080",
         "O3a adv_nat_top_VirtualServer.asp: POST virsevFlag=2 da dien dung o 0 (192.168.1.99:8080)")
    kiem('["1", "8080","8080","192.168.1.99","8080","8080","0"]' in html,
         "O3a adv_nat_top_VirtualServer.asp: HTML tra ve co dong tableData1 dung dinh dang HAR")

    # O3b — them dong thu 2: phai DIEN VAO O 1 (khong ghi de o 0) — dung
    # kho CHUNG voi adv_nat_top.asp
    html2 = _post("/cgi-bin/adv_nat_top_VirtualServer.asp", {
        "start_port1": "9090", "end_port1": "9090", "Addr1": "192.168.1.100",
        "local_sport": "9090", "local_eport": "9090", "virsevFlag": "2",
    })
    vs2 = doc_kho("adv_nat_top.virtual_servers") or []
    kiem(vs2[0].get("ip") == "192.168.1.99" and vs2[1].get("ip") == "192.168.1.100",
         "O3b adv_nat_top_VirtualServer.asp: them lan 2 dien dung o 1, o 0 KHONG bi ghi de")
    kiem('Virtual Server' in html2,
         "O3b adv_nat_top_VirtualServer.asp: POST tra ve 200 + trang render lai")

    # O3c — QoS: them Bandwidth Control rule (mang co dinh 10 o)
    htmlq = _post("/cgi-bin/adv_qos.asp", {
        "Qos_active": "No", "qoSOptType": "N/A", "QOS_Flag": "5",
        "QosMBSSIDNumberFlag": "4", "Qos11acMBSSIDNumberFlag": "4",
        "QoS1PortFlag": "N/A", "QoS2PortsFlag": "N/A",
        "wlanISExist": "On", "wlan11acISExist": "On", "UserMode": "0",
        "WlanPort_1": "No", "WlanPort_2": "No", "WlanPort_3": "No",
        "QoS_Bandwidth_Control_Mac_WithOut_Colon": "112233445566",
        "QoS_Bandwidth_Control_Description": "test1", "MacAddFlag": "1",
        "QoS_Bandwidth_Control_mac_select": "0", "QoS_Bandwidth_Control_Mac": "11:22:33:44:55:66",
        "QoS_Bandwidth_Control_Up": "10", "QoS_Bandwidth_Control_Down": "10",
        "delnum": "", "addNum": "0",
    })
    qr = doc_kho("adv_qos.qos_rules") or []
    kiem(len(qr) == 10 and qr[0] and qr[0].get("mac") == "112233445566" and qr[0].get("desc") == "test1",
         "O3c adv_qos: POST QOS_Flag=5+MacAddFlag=1 da dien dung o 0 Bandwidth Control")
    kiem('["1", "test1",getMacWithColon("112233445566"),"10","10","0"]' in htmlq,
         "O3c adv_qos: HTML tra ve co dong tableData dung dinh dang HAR")

    # O3d — Routing: them Static Route (PVC0 -> interface "ppp0") — day la
    # LIST NOI DUOI (khac han NAT/QoS o tren), chen o dau, so dong TANG len.
    truoc_rt = doc_kho("adv_routing_table.static_routes") or []
    n_truoc = len(truoc_rt)
    htmlr = _post("/cgi-bin/adv_routing_table.asp", {
        "Route_num": "3", "delnum": "", "user_def_num": "0", "add_num": "0",
        "User_def": "1", "RouteActive": "Yes", "pvc_index_num": "0", "pvc_index": "0",
        "staticDestIP": "10.10.10.0", "staticSubnetMask": "255.255.255.0",
        "Route_PVCGateway": "No", "Route_PVC_Index": "PVC0", "staticMetric": "0",
        "EditFlag": "1",
    })
    rt = doc_kho("adv_routing_table.static_routes") or []
    kiem(len(rt) == n_truoc + 1 and rt[0].get("dest") == "10.10.10.0" and rt[0].get("interface") == "ppp0",
         "O3d adv_routing_table: POST EditFlag=1 da CHEN dong moi o dau danh sach (dest=10.10.10.0, PVC0->ppp0)")
    kiem("10.10.10.0" in htmlr and "doDelete(0);" in htmlr,
         "O3d adv_routing_table: HTML tra ve co dong moi + nut Remove doDelete(0)")

    # O4: cac thao tac phu doc tu HAR dot 2 (adv_table_actions_2.har,
    # 2026-08-22) — DMZ save/xoa, Port Trigger them/xoa, Virtual Server
    # xoa, QoS Bandwidth Control xoa, Routing xoa.
    print("\n--- O4: thao tac phu (HAR dot 2: adv_table_actions_2.har) ---")

    # O4a — DMZ: Luu (dmzFlag=1) roi Xoa (dmzFlag=2), qua chinh adv_nat_top.asp
    html_dmz1 = _post("/cgi-bin/adv_nat_top.asp", {
        "natFlag": "1", "service_num_flag": "0", "dmzFlag": "1", "saveFlag": "1",
        "dmzdeactive": "No", "dmz_remove": "1", "NATtyleChange": "1", "dmz_active": "Yes",
        "IPAddFlag": "1", "DMZ_IP_select": "0", "dmzHostIP": "192.168.1.60",
        "start_port1": "", "end_port1": "", "VirsvrIPAddFlag": "0", "Virsvr_IP_select": "0", "Addr1": "",
        "local_sport": "", "local_eport": "", "PortTriggering_Applications": "",
        "Trig_start_port": "", "Trig_end_port": "", "Trig_PtclChoose": "TCP/UDP",
        "Open_start_port": "", "Open_end_port": "", "Open_PtclChange": "TCP/UDP",
        "editTrigNum": "0", "TrigFlag": "0", "PortTriggering_CanUseNumFlag": "8",
        "editnum": "0", "virsevFlag": "0",
    })
    kiem(doc_kho("adv_nat_top.dmz_active") == "Yes" and doc_kho("adv_nat_top.dmzHostIP") == "192.168.1.60",
         "O4a adv_nat_top: POST dmzFlag=1 da luu DMZ (dmz_active=Yes, dmzHostIP=192.168.1.60)")
    kiem('["Enable","192.168.1.60","0"]' in html_dmz1,
         "O4a adv_nat_top: HTML tra ve co dong tableData DMZ dung IP")

    html_dmz2 = _post("/cgi-bin/adv_nat_top.asp", {
        "natFlag": "1", "service_num_flag": "0", "dmzFlag": "2", "saveFlag": "1",
        "dmzdeactive": "No", "dmz_remove": "0", "NATtyleChange": "1", "dmz_active": "Yes",
        "IPAddFlag": "0", "DMZ_IP_select": "0", "dmzHostIP": "",
        "start_port1": "", "end_port1": "", "VirsvrIPAddFlag": "0", "Virsvr_IP_select": "0", "Addr1": "",
        "local_sport": "", "local_eport": "", "PortTriggering_Applications": "",
        "Trig_start_port": "", "Trig_end_port": "", "Trig_PtclChoose": "TCP/UDP",
        "Open_start_port": "", "Open_end_port": "", "Open_PtclChange": "TCP/UDP",
        "editTrigNum": "0", "TrigFlag": "0", "PortTriggering_CanUseNumFlag": "8",
        "editnum": "0", "virsevFlag": "0",
    })
    kiem(doc_kho("adv_nat_top.dmz_active") == "No" and doc_kho("adv_nat_top.dmzHostIP") == "",
         "O4a adv_nat_top: POST dmzFlag=2 da xoa DMZ (ep dmz_active=No du body gui Yes — dung HAR)")
    kiem('["Enable","N/A","0"]' in html_dmz2,
         "O4a adv_nat_top: HTML tra ve dong tableData DMZ ve N/A sau khi xoa")

    # O4b — Port Trigger: them (TrigFlag=1) roi xoa (TrigFlag=2), qua URL rieng
    html_pt1 = _post("/cgi-bin/adv_nat_top_PortTriggering.asp", {
        "PortTriggering_Applications": "test1", "Trig_start_port": "1000", "Trig_end_port": "1000",
        "Trig_PtclChoose": "TCP/UDP", "Open_start_port": "2000", "Open_end_port": "2000",
        "Open_PtclChange": "TCP/UDP", "editTrigNum": "0", "TrigFlag": "1",
    })
    pt = doc_kho("adv_nat_top.port_triggers") or []
    kiem(len(pt) == 8 and pt[0] and pt[0].get("app") == "test1" and pt[0].get("trig_start") == "1000",
         "O4b adv_nat_top_PortTriggering.asp: POST TrigFlag=1 da dien dung o 0")
    kiem('["1", "test1","1000","1000","TCP/UDP","2000","2000","TCP/UDP","0"]' in html_pt1,
         "O4b adv_nat_top_PortTriggering.asp: HTML tra ve co dong tableData2 dung dinh dang HAR")

    html_pt2 = _post("/cgi-bin/adv_nat_top_PortTriggering.asp", {
        "PortTriggering_Applications": "", "Trig_start_port": "", "Trig_end_port": "",
        "Trig_PtclChoose": "TCP/UDP", "Open_start_port": "", "Open_end_port": "",
        "Open_PtclChange": "TCP/UDP", "editTrigNum": "0", "TrigFlag": "2",
    })
    pt2 = doc_kho("adv_nat_top.port_triggers") or []
    kiem(pt2[0] is None,
         "O4b adv_nat_top_PortTriggering.asp: POST TrigFlag=2 da xoa dung o 0 (tra ve trong)")
    kiem('["1", "N/A","N/A","N/A","N/A","N/A","N/A","N/A","0"]' in html_pt2,
         "O4b adv_nat_top_PortTriggering.asp: HTML tra ve dong tableData2 ve N/A sau khi xoa")

    # O4c — Virtual Server: xoa o 0 (virsevFlag=1, editnum=0) — o 1 (them
    # o O3b) phai con nguyen, KHONG bi don len
    html_vsdel = _post("/cgi-bin/adv_nat_top_VirtualServer.asp", {
        "start_port1": "0", "end_port1": "0", "Addr1": "0.0.0.0",
        "local_sport": "0", "local_eport": "0", "editnum": "0", "virsevFlag": "1",
    })
    vs3 = doc_kho("adv_nat_top.virtual_servers") or []
    kiem(vs3[0] is None and vs3[1] is not None and vs3[1].get("ip") == "192.168.1.100",
         "O4c adv_nat_top_VirtualServer.asp: POST virsevFlag=1 xoa dung o 0, o 1 KHONG bi don")
    kiem('["1", "N/A","N/A","N/A","N/A","N/A","0"]' in html_vsdel,
         "O4c adv_nat_top_VirtualServer.asp: HTML tra ve dong o 0 ve N/A sau khi xoa")

    # O4d — QoS Bandwidth Control: xoa o 0 (chi delnum=0, KHONG dat QOS_Flag)
    # — SUY LUAN tu JS + cung co che da xac nhan HAR o Routing (O4e), CHUA
    # co HAR truc tiep cho QoS — xem docstring _xoa_dong_qos_bw() va ISSUES.md
    html_qosdel = _post("/cgi-bin/adv_qos.asp", {
        "Qos_active": "No", "qoSOptType": "N/A", "QOS_Flag": "0",
        "delnum": "0", "addNum": "1",
    })
    qr2 = doc_kho("adv_qos.qos_rules") or []
    kiem(qr2[0] is None,
         "O4d adv_qos: POST delnum=0 (khong co) xoa dung o 0 Bandwidth Control")
    kiem('["1", "N/A",getMacWithColon("N/A"),"N/A","N/A","0"]' in html_qosdel,
         "O4d adv_qos: HTML tra ve dong o 0 ve N/A sau khi xoa")

    # O4e — Routing: xoa dong vua them (O3d) — chi delnum, KHONG EditFlag.
    # HAR THAT xac nhan: sau khi xoa dong duy nhat da them, bang tro ve
    # DUNG byte-count cua 3 dong seed goc (25640 byte) — kiem tra ca so
    # dong LAN kich thuoc HTML de chac chan khong con sot du lieu.
    truoc_xoa = doc_kho("adv_routing_table.static_routes") or []
    n_truoc_xoa = len(truoc_xoa)
    html_rtdel = _post("/cgi-bin/adv_routing_table.asp", {
        "Route_num": str(n_truoc_xoa), "delnum": "0", "user_def_num": "1", "add_num": "1",
        "User_def": "1", "RouteActive": "Yes", "pvc_index_num": "0", "pvc_index": "0",
        "staticDestIP": "0.0.0.0", "staticSubnetMask": "0.0.0.0",
        "Route_PVCGateway": "No", "Route_PVC_Index": "PVC0", "staticMetric": "0",
        "EditFlag": "0",
    })
    rt2 = doc_kho("adv_routing_table.static_routes") or []
    kiem(len(rt2) == n_truoc_xoa - 1 and rt2[0].get("dest") == "192.168.1.0",
         "O4e adv_routing_table: POST delnum=0 (khong EditFlag) da xoa dung dong vua them")
    # Kiem NOI DUNG (khong doi byte tuyet doi — khoang trang trang tri giua
    # cac <tr> khong anh huong hien thi, khong phai hop dong that can khop
    # tung byte). Sau khi xoa dong duy nhat da them, bang phai tro ve DUNG
    # 3 dong seed goc, khong con "10.10.10.0" nao sot lai.
    kiem("10.10.10.0" not in html_rtdel and "192.168.1.0" in html_rtdel
         and "127.0.0.0" in html_rtdel and "239.0.0.0" in html_rtdel,
         "O4e adv_routing_table: HTML tra ve dung 3 dong seed goc, khong con dong da xoa")

    # O5: QoS Rule / Mapping Rule (adv_qos_rule.har, 2026-08-22, anh Huynn
    # chup rieng theo huong dan). Dung DUNG body POST doc tan mat tu HAR
    # (entry 56 -> 69 -> 80 -> 143). 16 o LUU RIENG THEO QosRuleIndex —
    # phep kiem then chot la O5c: doi dropdown sang o KHAC roi quay lai o
    # cu phai TRA DUNG lai du lieu da luu, khong duoc mat.
    print("\n--- O5: QOS Rule / Mapping Rule (adv_qos_rule.har) ---")
    qos_base = {
        "Qos_active": "Yes", "Qosdiscipline": "WRR", "QosWRRweight1": "9",
        "QosWRRweight2": "4", "QosWRRweight3": "2", "QosWRRweight4": "1",
        "QosMBSSIDNumberFlag": "4", "Qos11acMBSSIDNumberFlag": "4",
    }
    qos_rule_full = dict(qos_base)
    qos_rule_full.update({
        "QosRuleIndex": "0", "QOS_Flag": "0", "QosRuleActive": "Yes", "QosApp": "IGMP",
        "QosDestIpValue": "192.168.1.100", "QosDestMaskValue": "255.255.255.255",
        "QosDestPortValue1": "80", "QosDestPortValue2": "80",
        "QosSrcIpValue": "192.168.1.50", "QosSrcMaskValue": "255.255.255.255",
        "QosProtocol": "TCP", "Qos_IPP_DSCP1": "DSCP", "Qos_IPP_DSCP2": "DSCP",
        "QosConfigPriority": "High",
    })

    # O5a — luu o index 0 (QOS_Flag=0, entry 56)
    html_q1 = _post("/cgi-bin/adv_qos.asp", qos_rule_full)
    mr = doc_kho("adv_qos.qos_mapping_rules") or []
    kiem(mr[0] is not None and mr[0].get("active") == "Yes" and mr[0].get("app") == "IGMP"
         and mr[0].get("dest_ip") == "192.168.1.100" and mr[0].get("protocol") == "TCP"
         and mr[0].get("priority") == "High",
         "O5a adv_qos: POST QOS_Flag=0 + QosRuleIndex=0 da luu dung o 0")
    kiem('<OPTION selected>0' in html_q1 and 'value="TCP" selected' in html_q1
         and 'value="IGMP" selected' in html_q1,
         "O5a adv_qos: HTML tra ve dropdown o 0, App=IGMP, Protocol=TCP dung nhu HAR")

    # O5b — doi dropdown sang index 1 (QOS_Flag=1, entry 69 — body con mang
    # theo du lieu CU cua o 0 vi JS khong xoa form truoc khi submit, nhung
    # KHONG duoc ghi de vao o 0 vi day la "doi xem", khong phai "luu")
    qos_switch1 = dict(qos_rule_full); qos_switch1["QosRuleIndex"] = "1"; qos_switch1["QOS_Flag"] = "1"
    html_q2 = _post("/cgi-bin/adv_qos.asp", qos_switch1)
    mr2 = doc_kho("adv_qos.qos_mapping_rules") or []
    kiem(mr2[0] is not None and mr2[1] is None,
         "O5b adv_qos: doi dropdown sang 1 KHONG ghi de o 0, o 1 van rong")
    kiem('<OPTION selected>1' in html_q2 and 'style="display:none;"' in html_q2.split('<div id="qosRule"', 1)[1][:40],
         "O5b adv_qos: HTML tra ve o 1 rong (Active=No, div an) dung nhu HAR")

    # O5c — quay lai index 0 (QOS_Flag=1, entry 80) — PHAI tra dung lai du
    # lieu da luu o O5a, day la bang chung then chot cua co che "16 o luu
    # rieng". Body luc nay KHONG con Qos* du lieu (browser gui dung nhung
    # gi form dang hien — o 1 dang rong nen KHONG co App/IP...).
    qos_switch0 = dict(qos_base); qos_switch0.update({"QosRuleIndex": "0", "QOS_Flag": "1", "QosRuleActive": "No"})
    html_q3 = _post("/cgi-bin/adv_qos.asp", qos_switch0)
    kiem('<OPTION selected>0' in html_q3 and 'value="TCP" selected' in html_q3
         and 'value="IGMP" selected' in html_q3 and '192.168.1.100' in html_q3,
         "O5c adv_qos: quay lai o 0 TRA DUNG lai du lieu da luu (khong mat)")

    # O5d — xoa o 0 (QOS_Flag=2, entry 143 — body van con du lieu cu)
    qos_del0 = dict(qos_rule_full); qos_del0["QOS_Flag"] = "2"
    html_q4 = _post("/cgi-bin/adv_qos.asp", qos_del0)
    mr4 = doc_kho("adv_qos.qos_mapping_rules") or []
    kiem(mr4[0] is None, "O5d adv_qos: POST QOS_Flag=2 da xoa o 0 ve mac dinh")
    kiem('style="display:none;"' in html_q4.split('<div id="qosRule"', 1)[1][:40],
         "O5d adv_qos: HTML tra ve div qosRule an lai sau khi xoa")

    # O5e — QoS Bandwidth Control (trang KHAC trong cung URL) khong bi
    # "cuop" boi luat QOS_Flag=0/2 moi them cho QOS Rule — xac nhan sua loi
    # phat hien qua chinh phien lam viec nay (dispatch "co_va_truong").
    html_bw1 = _post("/cgi-bin/adv_qos.asp", dict(qos_base, **{
        "QOS_Flag": "5", "MacAddFlag": "1",
        "QoS_Bandwidth_Control_Description": "kiemO5", "QoS_Bandwidth_Control_Mac_WithOut_Colon": "112233445566",
        "QoS_Bandwidth_Control_Up": "10", "QoS_Bandwidth_Control_Down": "20",
    }))
    kiem('"kiemO5"' in html_bw1, "O5e adv_qos: Bandwidth Control Add (QOS_Flag=5) van hoat dong binh thuong")
    html_bw2 = _post("/cgi-bin/adv_qos.asp", dict(qos_base, **{"QOS_Flag": "0", "delnum": "0", "addNum": "1"}))
    kiem('"kiemO5"' not in html_bw2,
         "O5e adv_qos: Bandwidth Control Delete (QOS_Flag=0 mac dinh + delnum) KHONG bi luat QOS Rule cuop mat")


def main():
    print("=" * 68)
    print("KIEM DOI CHIEU ONT AC1000HI — gia lap vs thiet bi that")
    print("=" * 68)

    srv = subprocess.Popen([sys.executable, os.path.join(_HERE, "server.py"),
                            str(PORT)],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(30):
            try:
                urllib.request.urlopen(CS + "/cgi-bin/login.asp", timeout=1)
                break
            except Exception:                                # noqa: BLE001
                time.sleep(0.2)

        nhom_A_tung_byte()
        bk = nhom_B_du_file()
        nhom_C_hop_dong(bk)
        nhom_D_tai_nguyen()
        nhom_E_font()

        cj = http.cookiejar.CookieJar()
        op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
        dat_ck(cj, "uid", "admin")
        dat_ck(cj, "psw", "admin")

        def goi_auth(dp):
            try:
                with op.open(CS + dp, timeout=10) as r:
                    return r.status, r.read(), dict(r.headers)
            except urllib.error.HTTPError as e:
                return e.code, e.read(), dict(e.headers)

        goi_auth("/cgi-bin/reqLogin")
        nhom_F_nhom_status(goi_auth)
        nhom_G_nhom_help(goi_auth)
        nhom_H_network_lan(goi_auth)
        nhom_I_chieu_ghi(op)
        nhom_J_maintenance(goi_auth, op)
        nhom_K_access(goi_auth, op)
        nhom_L_advanced(goi_auth, op)
        nhom_M_network(goi_auth, op)
        nhom_O_co_hanh_dong_va_bang(goi_auth, op)
        # N chay SAU CUNG: dat_lai_factory() lam mat phien dang nhap hien tai
        # (session.id_hien_tai ve None), moi phep kiem can dang nhap phai
        # chay TRUOC no.
        nhom_N_log_va_nhat_quan(goi_auth, op)
    finally:
        srv.terminate()
        try:
            srv.wait(timeout=5)
        except subprocess.TimeoutExpired:
            srv.kill()

    print("\n" + "=" * 68)
    if loi:
        print(f"KET LUAN: {so_kiem - len(loi)}/{so_kiem} DAT — CON {len(loi)} CHO LECH:")
        for x in loi:
            print("   -", x)
        return 1
    print(f"KET LUAN: {so_kiem}/{so_kiem} phep kiem DAT — "
          "ban gia lap khop bang chung goc.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
