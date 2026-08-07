#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bung goi bang chung BE12000 ra thanh cay file trong reference/source/.

Dung sau khi tai be12000-source-<ngay>.json tu thiet bi that.

Chay:
    python bung_source.py <duong-dan-file-json>

Sinh ra:
    reference/source/index.html              <- trang khung goc
    reference/source/jquery/*.js             <- 4 thu vien goc
    reference/source/views/<viewTag>.html    <- mang HTML cua tung route
    reference/source/data/<dataTag>          <- response cua tung nguon du lieu
    reference/source/MANIFEST.json           <- kich thuoc + status tung file

Sau do cap nhat spec/route-inventory.json: route nao co file view thi len muc 1.
"""
import json
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(BASE, "reference", "source")
INV = os.path.join(BASE, "spec", "route-inventory.json")


def ghi(duong_dan, noi_dung):
    os.makedirs(os.path.dirname(duong_dan), exist_ok=True)
    with open(duong_dan, "w", encoding="utf-8", newline="") as f:
        f.write(noi_dung)
    return len(noi_dung.encode("utf-8"))


def main():
    if len(sys.argv) < 2:
        print("Thieu tham so. Vi du:")
        print(r"  python bung_source.py C:\Users\Admin\Downloads\be12000-source-2026-08-03.json")
        return 1

    goi_path = sys.argv[1]
    if not os.path.exists(goi_path):
        print("Khong thay file:", goi_path)
        return 1

    with open(goi_path, "r", encoding="utf-8") as f:
        goi = json.load(f)

    manifest = {
        "device": goi.get("device"),
        "hardwareModel": goi.get("hardwareModel"),
        "baseUrl": goi.get("baseUrl"),
        "capturedAt": goi.get("capturedAt"),
        "note": goi.get("note"),
        "files": [],
    }
    loi = []

    # --- 1. assets: trang khung + thu vien js ---
    anh_xa = {
        "/": "index.html",
        "/jquery/jquery.min.js": "jquery/jquery.min.js",
        "/jquery/crypto-js.min.js": "jquery/crypto-js.min.js",
        "/jquery/jsencrypt.min.js": "jquery/jsencrypt.min.js",
        "/jquery/common_lib.js": "jquery/common_lib.js",
    }
    for url, ten in anh_xa.items():
        m = goi.get("assets", {}).get(url)
        if not m:
            loi.append("thieu asset: " + url)
            continue
        if m.get("status") != 200:
            loi.append("asset %s status %s" % (url, m.get("status")))
            continue
        n = ghi(os.path.join(SRC, ten), m["body"])
        manifest["files"].append({"loai": "asset", "url": url, "file": ten, "bytes": n})

    # --- 2. views ---
    for tag, m in sorted(goi.get("views", {}).items()):
        if m.get("status") != 200:
            loi.append("view %s status %s" % (tag, m.get("status")))
            continue
        ten = "views/%s.html" % tag
        n = ghi(os.path.join(SRC, ten), m["body"])
        manifest["files"].append({
            "loai": "view", "viewTag": tag, "file": ten, "bytes": n,
            "url": "/?_type=menuView&_tag=%s" % tag,
        })

    # --- 3. data ---
    for tag, m in sorted(goi.get("data", {}).items()):
        if m.get("status") != 200:
            loi.append("data %s status %s" % (tag, m.get("status")))
            continue
        ten = "data/%s" % tag
        n = ghi(os.path.join(SRC, ten), m["body"])
        manifest["files"].append({
            "loai": "data", "dataTag": tag, "file": ten, "bytes": n,
            "url": "/?_type=menuData&_tag=%s" % tag,
        })

    manifest["loi"] = loi
    manifest["tongSoFile"] = len(manifest["files"])
    with open(os.path.join(SRC, "MANIFEST.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    # --- 4. cap nhat route-inventory: route co file view -> muc 1 ---
    co_view = {x["viewTag"] for x in manifest["files"] if x["loai"] == "view"}
    with open(INV, "r", encoding="utf-8") as f:
        inv = json.load(f)

    len_muc1 = 0
    for r in inv["routes"]:
        if r["viewTag"] in co_view:
            r["evidence"]["source"] = ["views/%s.html" % r["viewTag"]]
            if r["level"] < 1:
                r["level"] = 1
                len_muc1 += 1
            r["missingEvidence"] = False

    dem = {"0": 0, "1": 0, "2": 0, "3": 0, "4": 0}
    for r in inv["routes"]:
        dem[str(r["level"])] += 1
    inv["summary"]["byLevel"] = dem
    inv["summary"]["missingEvidence"] = sum(1 for r in inv["routes"] if r["missingEvidence"])
    inv["updatedAt"] = (goi.get("capturedAt") or "")[:10] or inv.get("updatedAt")

    with open(INV, "w", encoding="utf-8") as f:
        json.dump(inv, f, ensure_ascii=False, indent=2)

    # --- bao cao ---
    print("Da bung:", manifest["tongSoFile"], "file vao", SRC)
    print("  asset:", sum(1 for x in manifest["files"] if x["loai"] == "asset"))
    print("  view :", sum(1 for x in manifest["files"] if x["loai"] == "view"))
    print("  data :", sum(1 for x in manifest["files"] if x["loai"] == "data"))
    print("Route len muc 1 lan nay:", len_muc1)
    print("Phan bo muc:", dem)
    if loi:
        print("CO LOI (%d):" % len(loi))
        for e in loi:
            print("  -", e)
    else:
        print("Khong co loi.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
