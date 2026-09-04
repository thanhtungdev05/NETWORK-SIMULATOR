#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Trich tai nguyen nhi phan (anh, font, ico) tu cac file HAR ra reference/source/img/.

Cac file .har trong reference/har/ da luu kem noi dung response duoi dang base64.
Script nay giai ma va ghi ra dung duong dan goc tren thiet bi.

Chay:
    python trich_anh_tu_har.py
"""
import base64
import glob
import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))
HAR = os.path.join(BASE, "reference", "har")
DICH = os.path.join(BASE, "reference", "source")

LOAI_NHI_PHAN = (".png", ".gif", ".jpg", ".jpeg", ".ico", ".svg", ".ttf", ".woff", ".woff2")


def main():
    da_ghi = {}
    bo_qua = []

    for har in sorted(glob.glob(os.path.join(HAR, "*.har"))):
        with open(har, "r", encoding="utf-8") as f:
            log = json.load(f)["log"]

        for e in log["entries"]:
            url = e["request"]["url"]
            if "192.168.1.1" not in url:
                continue
            duong_dan = url.split("192.168.1.1", 1)[1].split("?")[0]
            if not duong_dan.lower().endswith(LOAI_NHI_PHAN):
                continue
            if duong_dan in da_ghi:
                continue

            c = e["response"].get("content", {})
            noi_dung = c.get("text")
            if not noi_dung:
                bo_qua.append(duong_dan + " (khong co body trong HAR)")
                continue

            try:
                if c.get("encoding") == "base64":
                    raw = base64.b64decode(noi_dung)
                else:
                    raw = noi_dung.encode("utf-8")
            except Exception as ex:
                bo_qua.append("%s (loi giai ma: %s)" % (duong_dan, ex))
                continue

            dich = os.path.join(DICH, duong_dan.lstrip("/").replace("/", os.sep))
            os.makedirs(os.path.dirname(dich), exist_ok=True)
            with open(dich, "wb") as f:
                f.write(raw)
            da_ghi[duong_dan] = len(raw)

    print("Da trich %d tai nguyen:" % len(da_ghi))
    for d in sorted(da_ghi):
        print("  %-40s %7d bytes" % (d, da_ghi[d]))
    if bo_qua:
        print("\nBo qua (%d):" % len(bo_qua))
        for b in bo_qua:
            print("  -", b)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
