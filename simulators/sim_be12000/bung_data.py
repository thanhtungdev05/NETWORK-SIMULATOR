#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ghi de 48 file trong reference/source/data/ bang ban chup dung cach.

Dot chup dau tien goi menuData truc tiep, khong nap menuView truoc,
nen thiet bi tra ve SessionTimeout -> bang chung hong.
Ban nay chup theo cap: menuView(trang) roi ngay sau do menuData(nguon).

Chay:
    python bung_data.py <duong-dan-be12000-data-*.json>
"""
import json
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(BASE, "reference", "source", "data")
MANI = os.path.join(BASE, "reference", "source", "MANIFEST.json")


def main():
    if len(sys.argv) < 2:
        print("Thieu tham so. Vi du:")
        print(r"  python bung_data.py C:\Users\Admin\Downloads\be12000-data-2026-08-03.json")
        return 1
    p = sys.argv[1]
    if not os.path.exists(p):
        print("Khong thay file:", p)
        return 1

    with open(p, "r", encoding="utf-8") as f:
        goi = json.load(f)

    os.makedirs(DATA, exist_ok=True)
    ok, hong = [], []
    cap = {}
    for tag, m in sorted(goi.get("data", {}).items()):
        body = m.get("body", "")
        if m.get("status") != 200 or "SessionTimeout" in body or "404 Not Found" in body:
            hong.append("%s (view=%s)" % (tag, m.get("view")))
            continue
        with open(os.path.join(DATA, tag), "w", encoding="utf-8", newline="") as f:
            f.write(body)
        ok.append(tag)
        cap[tag] = m.get("view")

    # cap nhat MANIFEST: ghi lai cap view->data va danh sach hong
    if os.path.exists(MANI):
        with open(MANI, "r", encoding="utf-8") as f:
            mani = json.load(f)
        mani["dataCapturedAt"] = goi.get("capturedAt")
        mani["dataNote"] = goi.get("note")
        mani["dataViewPairs"] = cap
        mani["dataHong"] = hong
        with open(MANI, "w", encoding="utf-8") as f:
            json.dump(mani, f, ensure_ascii=False, indent=2)

    print("Ghi de thanh cong:", len(ok), "file data")
    if hong:
        print("Van hong (%d) - phai ghi vao missing-evidence.md:" % len(hong))
        for h in hong:
            print("  -", h)
    else:
        print("Khong con file hong.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
