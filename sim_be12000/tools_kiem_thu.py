#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Kiem thu ban gia lap BE12000 — doi chieu voi hop dong da xac minh tu thiet bi that.

Moi phep thu deu bam vao mot bang chung cu the trong reference/.

Chay (server phai dang chay):
    python tools_kiem_thu.py [--port 8098]
"""
import argparse
import hashlib
import json
import re
import urllib.parse
import urllib.request

DAT = []
HONG = []

# CANH BAO: khong duoc kiem bang `"SessionTimeout" in html`.
# Chuoi do nam san trong index.html (ham hasError, vi tri 118020) nen se
# duong tinh gia. Chi kiem trong the IF_ERRORSTR cua response XML.
RE_HET_PHIEN = re.compile(r"<IF_ERRORSTR>SessionTimeout</IF_ERRORSTR>")


def het_phien(noi_dung):
    return bool(RE_HET_PHIEN.search(noi_dung))


def kiem(ten, dieu_kien, chi_tiet=""):
    (DAT if dieu_kien else HONG).append(ten + (" — " + chi_tiet if chi_tiet else ""))
    print("  %s %s%s" % ("[dat ]" if dieu_kien else "[HONG]", ten,
                         ("  " + chi_tiet) if chi_tiet else ""))


def get(goc, duong_dan):
    with urllib.request.urlopen(goc + duong_dan) as r:
        return r.status, r.headers.get("Content-Type", ""), r.read().decode("utf-8", "replace")


def post(goc, duong_dan, tham_so):
    du_lieu = urllib.parse.urlencode(tham_so).encode()
    yc = urllib.request.Request(goc + duong_dan, data=du_lieu, headers={
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
    })
    with urllib.request.urlopen(yc) as r:
        return r.status, r.headers.get("Content-Type", ""), r.read().decode("utf-8", "replace")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--port", type=int, default=8098)
    p.add_argument("--password", default="admin")
    a = p.parse_args()
    goc = "http://localhost:%d" % a.port

    print("\n=== A. Trang khung khi CHUA dang nhap ===")
    ma, kieu, html = get(goc, "/")
    kiem("GET / tra ve trang dang nhap", "login_entry" in html and "Frm_Password" in html)
    kiem("Dung so byte voi thiet bi that (172253)", len(html.encode()) == 172253,
         "thuc te %d" % len(html.encode()))

    print("\n=== B. Chan truy cap khi chua dang nhap ===")
    ma, kieu, xml = get(goc, "/?_type=menuData&_tag=sntp_lua.lua")
    kiem("menuData khi chua dang nhap -> SessionTimeout", het_phien(xml))
    kiem("  ... nhung HTTP van 200 (giong that)", ma == 200, "HTTP %d" % ma)

    print("\n=== C. Luong dang nhap 3 buoc ===")
    ma, kieu, js = get(goc, "/?_type=loginData&_tag=login_entry")
    kiem("login_entry tra JSON", "application/json" in kieu)
    d = json.loads(js)
    kiem("JSON co du 4 truong that",
         set(d) == {"lockingTime", "loginErrMsg", "promptMsg", "sess_token"})
    kiem("sess_token dai 24 ky tu", len(d["sess_token"]) == 24, "thuc te %d" % len(d["sess_token"]))
    sess = d["sess_token"]

    ma, kieu, xml = get(goc, "/?_type=loginData&_tag=login_token")
    kiem("login_token tra text/xml", "text/xml" in kieu)
    muoi = re.search(r"<ajax_response_xml_root>(.*?)</ajax_response_xml_root>", xml).group(1)
    kiem("token nam trong ajax_response_xml_root", bool(muoi))

    print("\n=== D. Dang nhap SAI mat khau ===")
    ma, kieu, js = post(goc, "/?_type=loginData&_tag=login_entry", {
        "action": "login", "Username": "admin",
        "Password": hashlib.sha256(("sai" + muoi).encode()).hexdigest(),
        "_sessionTOKEN": sess})
    d = json.loads(js)
    kiem("Tu choi dang nhap sai", d.get("loginErrMsg") == "failed")
    ma, kieu, xml = get(goc, "/?_type=menuData&_tag=sntp_lua.lua")
    kiem("Van bi chan sau khi dang nhap sai", het_phien(xml))

    print("\n=== E. Dang nhap DUNG: sha256(mat_khau + token) ===")
    _, _, js = get(goc, "/?_type=loginData&_tag=login_entry")
    sess = json.loads(js)["sess_token"]
    _, _, xml = get(goc, "/?_type=loginData&_tag=login_token")
    muoi = re.search(r"<ajax_response_xml_root>(.*?)</ajax_response_xml_root>", xml).group(1)
    bam = hashlib.sha256((a.password + muoi).encode()).hexdigest()
    kiem("Chuoi bam dai 64 ky tu hex", len(bam) == 64 and re.fullmatch(r"[0-9a-f]{64}", bam))
    ma, kieu, js = post(goc, "/?_type=loginData&_tag=login_entry", {
        "action": "login", "Username": "admin", "Password": bam, "_sessionTOKEN": sess})
    d = json.loads(js)
    kiem("Dang nhap thanh cong", d.get("login_need_refresh") == 1)
    kiem("Token DOI MOI sau POST", d.get("sess_token") != sess)
    sess = d["sess_token"]

    print("\n=== F. Ngu canh trang: menuData doi menuView truoc ===")
    _, _, xml = get(goc, "/?_type=menuData&_tag=sntp_lua.lua")
    kiem("Chua mo trang -> SessionTimeout", het_phien(xml))
    ma, kieu, html = get(goc, "/?_type=menuView&_tag=sntp&Menu3Location=0")
    kiem("menuView tra HTML", ma == 200 and "text/html" in kieu)
    ma, kieu, xml = get(goc, "/?_type=menuData&_tag=sntp_lua.lua")
    kiem("Sau khi mo trang -> tra du lieu", not het_phien(xml) and "SUCC" in xml)
    kiem("Response la text/xml", "text/xml" in kieu)
    kiem("Co OBJ_SNTP_ID", "OBJ_SNTP_ID" in xml)

    def lay(x, ten):
        m = re.search(r"<ParaName>%s</ParaName><ParaValue>(.*?)</ParaValue>" % ten, x)
        return m.group(1) if m else None

    kiem("PollTimeInterval = 86400 (dung bang chung)", lay(xml, "PollTimeInterval") == "86400",
         "thuc te %s" % lay(xml, "PollTimeInterval"))
    kiem("Chi tra truong cua dataTag nay, khong thua",
         "AntiAttack" not in xml)

    print("\n=== G. GHI: POST cung endpoint voi DOC ===")
    ma, kieu, xml = post(goc, "/?_type=menuData&_tag=sntp_lua.lua", {
        "IF_ACTION": "Apply", "_InstID": "IGD",
        "ZoneIndex": "24", "AutoSetTzname": "1", "LocalTimeZoneandName": "24",
        "NtpServer1": "vn.pool.ntp.org", "NtpServer2": "asia.pool.ntp.org",
        "NtpServer3": "", "NtpServer4": "", "NtpServer5": "",
        "PollTimeInterval": "43200", "Dscp": "-1",
        "Btn_apply": "", "Btn_cancel": "", "_sessionTOKEN": sess})
    kiem("POST tra text/xml", "text/xml" in kieu)
    kiem("Bao thanh cong SUCC / ID 0", "<IF_ERRORSTR>SUCC</IF_ERRORSTR>" in xml and
         "<IF_ERRORID>0</IF_ERRORID>" in xml)
    kiem("Response tra ve luon trang thai MOI", lay(xml, "PollTimeInterval") == "43200",
         "thuc te %s" % lay(xml, "PollTimeInterval"))

    print("\n=== H. Trang thai luu that (muc 4) ===")
    _, _, xml2 = get(goc, "/?_type=menuData&_tag=sntp_lua.lua")
    kiem("Doc lai van thay gia tri moi", lay(xml2, "PollTimeInterval") == "43200")

    # Phep thu LIEN TRANG that: OBJ_FWLEVEL_ID.Level xuat hien o CA HAI dataTag
    #   firewall_config_lua.lua   (trang Internet > Security)
    #   firewall_homepage_lua.lua (trang Home)
    # Sua o trang A thi trang B phai doi theo — day moi la dinh nghia muc 4.
    get(goc, "/?_type=menuView&_tag=firewall&Menu3Location=0")
    _, _, xa = get(goc, "/?_type=menuData&_tag=firewall_config_lua.lua")
    cu = lay(xa, "Level")
    kiem("Trang A doc duoc Level", cu is not None, "Level = %s" % cu)

    moi = "High" if cu != "High" else "Low"
    _, _, js = get(goc, "/?_type=loginData&_tag=login_entry")
    sess2 = json.loads(js)["sess_token"]
    _, _, xg = post(goc, "/?_type=menuData&_tag=firewall_config_lua.lua", {
        "IF_ACTION": "Apply", "_InstID": "IGD", "Enable": "1", "Level": moi,
        "Btn_apply": "", "Btn_cancel": "", "_sessionTOKEN": sess2})
    kiem("Ghi Level o trang A thanh cong", lay(xg, "Level") == moi,
         "%s -> %s" % (cu, lay(xg, "Level")))

    get(goc, "/?_type=menuView&_tag=homePage&Menu3Location=0")
    _, _, xb = get(goc, "/?_type=menuData&_tag=firewall_homepage_lua.lua")
    kiem("TRANG B thay doi theo (muc 4 that su)", lay(xb, "Level") == moi,
         "trang B doc duoc %s" % lay(xb, "Level"))
    kiem("Trang B van khong bi tra thua truong cua trang A",
         "<ParaName>Enable</ParaName>" not in xb)

    # tra lai
    _, _, js = get(goc, "/?_type=loginData&_tag=login_entry")
    get(goc, "/?_type=menuView&_tag=firewall&Menu3Location=0")
    post(goc, "/?_type=menuData&_tag=firewall_config_lua.lua", {
        "IF_ACTION": "Apply", "_InstID": "IGD", "Level": cu,
        "_sessionTOKEN": json.loads(js)["sess_token"]})

    print("\n=== I-0. Lap lai DUNG thu tu request that sau dang nhap ===")
    # Bang chung reference/har/login-day-du.har:
    #   POST login_entry -> GET / -> menuData firewall_homepage -> menuData wlan_homepage
    #                    -> hiddenData sntp_data
    # KHONG co menuView nao truoc hai menuData do, vi '/' chinh la trang chu.
    # Neu server doi phai co menuView truoc, no se tra SessionTimeout
    # -> client reload -> vong lap vo han.
    _, _, js = get(goc, "/?_type=loginData&_tag=login_entry")
    sess0 = json.loads(js)["sess_token"]
    _, _, xml = get(goc, "/?_type=loginData&_tag=login_token")
    muoi0 = re.search(r"<ajax_response_xml_root>(.*?)</ajax_response_xml_root>", xml).group(1)
    post(goc, "/?_type=loginData&_tag=login_entry", {
        "action": "login", "Username": "admin",
        "Password": hashlib.sha256((a.password + muoi0).encode()).hexdigest(),
        "_sessionTOKEN": sess0})
    get(goc, "/")
    for tag in ("firewall_homepage_lua.lua", "wlan_homepage_lua.lua"):
        _, _, x = get(goc, "/?_type=menuData&_tag=" + tag)
        kiem("Sau khi tai '/', %s KHONG bi SessionTimeout" % tag,
             not het_phien(x))
    _, _, x = get(goc, "/?_type=hiddenData&_tag=sntp_data")
    kiem("sntp_data ngay sau do cung khong loi", not het_phien(x))

    print("\n=== I. Chong vong lap reload (loi da mac 2026-08-03) ===")
    # index.html vi tri 118020: ErrorString == "SessionTimeout" -> top.location.href reload.
    # Trang chu poll sntp_data lien tuc, neu tra SessionTimeout se reload vo han.
    ma, kieu, xs = get(goc, "/?_type=hiddenData&_tag=sntp_data")
    kiem("sntp_data tra du lieu, KHONG phai SessionTimeout", not het_phien(xs))
    kiem("sntp_data la text/xml", "text/xml" in kieu)
    kiem("sntp_data co CurrentLocalTime", lay(xs, "CurrentLocalTime") is not None,
         "gio = %s" % lay(xs, "CurrentLocalTime"))
    t1 = lay(xs, "CurrentLocalTime")
    import time as _t
    _t.sleep(1.2)
    _, _, xs2 = get(goc, "/?_type=hiddenData&_tag=sntp_data")
    kiem("Dong ho CHAY (gia tri dong, khong dung yen)", lay(xs2, "CurrentLocalTime") != t1,
         "%s -> %s" % (t1, lay(xs2, "CurrentLocalTime")))
    try:
        get(goc, "/?_type=hiddenData&_tag=tag_khong_ton_tai")
        kiem("Tag la tra 404, khong tra SessionTimeout", False, "tra ve 200")
    except urllib.error.HTTPError as e:
        than = e.read().decode("utf-8", "replace")
        kiem("Tag la tra 404, khong tra SessionTimeout",
             e.code == 404 and not het_phien(than), "HTTP %d" % e.code)

    print("\n=== J. Tra lai gia tri cu ===")
    _, _, x = get(goc, "/?_type=menuData&_tag=sntp_lua.lua")
    _, _, js = get(goc, "/?_type=loginData&_tag=login_entry")
    post(goc, "/?_type=menuData&_tag=sntp_lua.lua", {
        "IF_ACTION": "Apply", "_InstID": "IGD", "PollTimeInterval": "86400",
        "_sessionTOKEN": json.loads(js)["sess_token"]})

    print("\n" + "=" * 62)
    print("  DAT : %d" % len(DAT))
    print("  HONG: %d" % len(HONG))
    for h in HONG:
        print("    - " + h)
    print("=" * 62)
    return 1 if HONG else 0


if __name__ == "__main__":
    raise SystemExit(main())
