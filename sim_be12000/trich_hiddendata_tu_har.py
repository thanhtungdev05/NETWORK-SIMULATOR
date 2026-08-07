#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Trich response cua _type=hiddenData tu HAR ra reference/source/data/.

Ly do phai co: trang chu goi hiddenData&_tag=sntp_data lien tuc de cap nhat dong ho.
Neu server tra <IF_ERRORSTR>SessionTimeout</IF_ERRORSTR> thi client se
top.location.href = top.location.href (xem index.html vi tri 118020) -> reload vo han.

Chay:
    python trich_hiddendata_tu_har.py
"""
import glob
import json
import os
import re

BASE = os.path.dirname(os.path.abspath(__file__))
HAR = os.path.join(BASE, "reference", "har")
DICH = os.path.join(BASE, "reference", "source", "data")


def main():
    da_ghi = {}
    for har in sorted(glob.glob(os.path.join(HAR, "*.har"))):
        with open(har, "r", encoding="utf-8") as f:
            log = json.load(f)["log"]
        for e in log["entries"]:
            url = e["request"]["url"]
            if "_type=hiddenData" not in url:
                continue
            m = re.search(r"_tag=([A-Za-z0-9_.]+)", url)
            if not m:
                continue
            tag = m.group(1)
            if tag in da_ghi:
                continue
            body = e["response"].get("content", {}).get("text") or ""
            if not body or "SessionTimeout" in body:
                continue
            os.makedirs(DICH, exist_ok=True)
            with open(os.path.join(DICH, tag), "w", encoding="utf-8", newline="") as f:
                f.write(body)
            da_ghi[tag] = (len(body), os.path.basename(har))

    print("Da trich %d hiddenData:" % len(da_ghi))
    for t, (n, nguon) in sorted(da_ghi.items()):
        print("  %-24s %6d bytes  (tu %s)" % (t, n, nguon))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
