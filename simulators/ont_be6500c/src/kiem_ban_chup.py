#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Kiem ban chup co DUNG TRANG khong -- khong phai chi co ton tai khong.

TAI SAO CO FILE NAY (2026-08-12): bo kiem cua GD2 goi HTTP 293 duong dan,
tat ca tra 200 nen bao "sach". Nhung no chi kiem FILE CO TON TAI KHONG.
Thuc te `security__firewall.html` chua noi dung trang Speed Test -- ban chup
bi lay truoc khi SPA kip chuyen route. Loi lot qua toan bo GD2.

Script nay so BREADCRUMB ("Actiontec <Nhom> / <Trang>") trong tung ban chup
voi route mong doi. Chay tren ca reference/ (bang chung goc) va src/www/
(san pham).

Chay:  python kiem_ban_chup.py
"""
import glob
import html
import os
import re
import sys

GOC = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(GOC, "..", "reference", "source")
WWW = os.path.join(GOC, "www")

# Breadcrumb mong doi cua tung route -- doc tu ban chup THAT, khong bia.
BREADCRUMB = {
    "home__overview": "Home / Overview",
    "home__topology": "Home / Topology",
    "wifi__general": "Wi-Fi / General",
    "wifi__advanced": "Wi-Fi / Advanced",
    "advanced__wan": "Advanced / WAN",
    "advanced__lan": "Advanced / LAN",
    "advanced__ddns": "Advanced / Dynamic DNS",
    "advanced__routing": "Advanced / Static Routing",
    "advanced__dmz": "Advanced / DMZ",
    "advanced__upnp": "Advanced / UPnP",
    "advanced__tcpdump": "Advanced / TCPDump",
    "network__portforward": "Network / Port Forwarding",
    "network__diagnostics": "Network / Diagnostics",
    "network__speedtest": "Network / Speed Test",
    "security__firewall": "Security / Firewall",
    "system__general": "System / System Settings",
    "system__upgrade": "System / Update & Restore",
    "system__user": "System / User",
    "help": "Help",
}

# Route nay KHONG co trong cay menu nen bo gac route tra 404 -- day la hanh
# vi DUNG cua thiet bi that, khong phai loi. Xem DAC_TA_DOC_TAY.md muc 20.
PHAI_LA_404 = {"status__devices"}


def chu(duong_dan):
    with open(duong_dan, encoding="utf-8", errors="ignore") as f:
        d = f.read()
    t = re.sub(r"<script.*?</script>", "", d, flags=re.S)
    t = re.sub(r"<style.*?</style>", "", t, flags=re.S)
    t = re.sub(r"<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html.unescape(t)).strip()


def kiem(thu_muc, ten_hien_thi):
    loi = []
    da_kiem = 0
    for tien_to in sorted(set(BREADCRUMB) | PHAI_LA_404):
        mau = []
        for m in (f"{tien_to}.html", f"{tien_to}__t*.html",
                  f"m_{tien_to}.html", f"m_{tien_to}__t*.html"):
            mau += sorted(glob.glob(os.path.join(thu_muc, m)))
        for p in mau:
            da_kiem += 1
            t = chu(p)
            ten = os.path.basename(p)
            if tien_to in PHAI_LA_404:
                if "404 Page not found" not in t:
                    loi.append((ten, "phai la trang 404", t[:80]))
            else:
                if BREADCRUMB[tien_to] not in t:
                    loi.append((ten, BREADCRUMB[tien_to], t[:80]))
    print(f"--- {ten_hien_thi}: kiem {da_kiem} file ---")
    if not loi:
        print("    SACH -- moi ban chup dung route cua no\n")
        return 0
    for ten, mong, thuc in loi:
        print(f"    SAI  {ten}")
        print(f"         mong doi : {mong}")
        print(f"         thuc te  : {thuc}")
    print(f"    Tong sai: {len(loi)}\n")
    return len(loi)


def main():
    tong = 0
    tong += kiem(REF, "reference/source (bang chung goc)")
    tong += kiem(WWW, "src/www (san pham gia lap)")
    if tong:
        print(f"KET LUAN: con {tong} file sai trang. Xem ISSUES.md.")
        sys.exit(1)
    print("KET LUAN: moi ban chup va moi trang gia lap deu dung route.")


if __name__ == "__main__":
    main()
