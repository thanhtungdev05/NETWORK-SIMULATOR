#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bung goi trang dang nhap BE12000 vao reference/source/.

Chay:
    python bung_loginpage.py <duong-dan-be12000-loginpage-*.json>
"""
import json
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(BASE, "reference", "source")


def main():
    if len(sys.argv) < 2:
        print(r"Vi du: python bung_loginpage.py be12000-loginpage-2026-08-03.json")
        return 1
    p = sys.argv[1]
    if not os.path.exists(p):
        print("Khong thay file:", p)
        return 1
    with open(p, "r", encoding="utf-8") as f:
        goi = json.load(f)

    for ten, noi_dung in goi.get("files", {}).items():
        dich = os.path.join(SRC, ten)
        os.makedirs(os.path.dirname(dich), exist_ok=True)
        with open(dich, "w", encoding="utf-8", newline="") as f:
            f.write(noi_dung)
        print("  %-28s %7d bytes" % (ten, len(noi_dung.encode("utf-8"))))
    print("Da bung", len(goi.get("files", {})), "file vao", SRC)
    return 0


if __name__ == "__main__":
    sys.exit(main())
