#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
BO THU BANG CHUNG GOC — MikroTik hEX S (RouterOS/WebFig 7.14.3)
================================================================

VI SAO CAN FILE NAY?
  Moi trung gian cua Claude (sandbox Linux) BI CHAN allowlist, khong the
  goi thang toi 192.168.1.1 (da do: HTTP 403 X-Proxy-Error blocked-by-allowlist).
  Chi trinh duyet cua anh Huynn moi vao duoc thiet bi.

  Neu chuyen file qua context cua Claude thi rat ton (rieng master-min.js
  da 375 KB). Nen lam nguoc lai: chay file nay tren may anh Huynn, no mo
  mot cong nhan file o localhost; Claude dieu khien Chrome tai tai nguyen
  tu thiet bi that roi POST thang sang day. Byte di TRUC TIEP tu thiet bi
  vao dia, KHONG qua context.

CACH DUNG:
  1. Mo PowerShell / CMD
  2. python thu_bang_chung.py
  3. De nguyen cua so do, bao Claude lam tiep

Ghi file vao: <thu muc cha>/reference/...  (thu muc BANG CHUNG GOC, chi doc
ve sau — xem CLAUDE.md muc 2.3)
"""
import hashlib
import json
import os
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlparse

CONG = 9099
_HERE = os.path.dirname(os.path.abspath(__file__))
GOC_REF = os.path.abspath(os.path.join(_HERE, "..", "reference"))

# Chi cho ghi vao dung 5 thu muc con nay — tranh ghi lung tung
THU_MUC_CHO_PHEP = {"root", "webfig", "jg", "har", "screenshots", "khung_menu"}

da_nhan = []


class H(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_GET(self):
        p = urlparse(self.path).path
        if p == "/danh_sach":
            b = json.dumps(da_nhan, ensure_ascii=False, indent=1).encode()
            self.send_response(200)
            self._cors()
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(b)))
            self.end_headers()
            return self.wfile.write(b)
        b = b"bo thu bang chung dang chay"
        self.send_response(200)
        self._cors()
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def do_POST(self):
        # /nhan?thu_muc=webfig&ten=master-min-....js
        q = urlparse(self.path)
        tham_so = dict(
            kv.split("=", 1) for kv in q.query.split("&") if "=" in kv
        )
        thu_muc = unquote(tham_so.get("thu_muc", ""))
        ten = unquote(tham_so.get("ten", ""))

        # chan duong dan doc hai
        if thu_muc not in THU_MUC_CHO_PHEP or not ten or "/" in ten or "\\" in ten or ".." in ten:
            self.send_response(400)
            self._cors()
            self.end_headers()
            print(f"  [TU CHOI] thu_muc={thu_muc!r} ten={ten!r}")
            return

        n = int(self.headers.get("Content-Length", 0))
        du_lieu = self.rfile.read(n)

        dich_thu_muc = os.path.join(GOC_REF, thu_muc)
        os.makedirs(dich_thu_muc, exist_ok=True)
        dich = os.path.join(dich_thu_muc, ten)
        with open(dich, "wb") as f:
            f.write(du_lieu)

        sha = hashlib.sha256(du_lieu).hexdigest()
        ban_ghi = {"thu_muc": thu_muc, "ten": ten, "byte": len(du_lieu), "sha256": sha}
        da_nhan.append(ban_ghi)
        print(f"  [{len(da_nhan):3d}] {thu_muc}/{ten}  {len(du_lieu):,} byte  sha256={sha[:16]}...")

        b = json.dumps(ban_ghi).encode()
        self.send_response(200)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def log_message(self, *a):
        pass  # tat log mac dinh cho do roi


def main():
    os.makedirs(GOC_REF, exist_ok=True)
    print("=" * 62)
    print("  BO THU BANG CHUNG — MikroTik hEX S")
    print("=" * 62)
    print(f"  Nghe tai      : http://localhost:{CONG}/")
    print(f"  Ghi file vao  : {GOC_REF}")
    print("  De nguyen cua so nay, bao Claude lam tiep.")
    print("  (Ctrl+C de dung khi da thu xong)")
    print("=" * 62)
    try:
        with ThreadingHTTPServer(("127.0.0.1", CONG), H) as srv:
            srv.serve_forever()
    except KeyboardInterrupt:
        print(f"\n  Da thu {len(da_nhan)} tep. Dung.")


if __name__ == "__main__":
    main()
