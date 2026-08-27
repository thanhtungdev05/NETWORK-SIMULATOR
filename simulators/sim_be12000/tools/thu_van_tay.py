#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""thu_van_tay — bo thu "dau van tay DOM" tu trinh duyet ve dia.

Vi sao can: de nghiem thu 77 route x 2 kho man hinh = 154 lan doi chieu,
khong the chep tay tung ket qua. Script nay mo mot cong nho, nhan du lieu
truc tiep tu trinh duyet (ca tu thiet bi that lan ban gia lap) va ghi ra file.

KHONG dung chung tien trinh voi ban gia lap — de src/server.py giu dung
hop dong cua thiet bi that, khong co endpoint la.

Chay:
    python tools\\thu_van_tay.py            (mac dinh cong 8199)

Sau do trong Console cua trinh duyet:
    guiVanTay('sntp', 'that')      // khi dang o http://192.168.1.1
    guiVanTay('sntp', 'gia_lap')   // khi dang o http://localhost:8098

File sinh ra: reference/vantay/<ten>.<ben>.<kho>.json
"""
import json
import os
import re
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

CONG = int(sys.argv[1]) if len(sys.argv) > 1 else 8199
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DICH = os.path.join(BASE, "reference", "vantay")

AN_TOAN = re.compile(r"^[A-Za-z0-9_.-]+$")


class H(BaseHTTPRequestHandler):

    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_POST(self):
        dai = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(dai).decode("utf-8", "replace")
        try:
            goi = json.loads(raw)
        except Exception as e:
            return self._tra(400, {"loi": "JSON hong: %s" % e})

        ten = str(goi.get("ten") or "khong-ten")
        ben = str(goi.get("ben") or "khong-ro")
        kho = str(goi.get("khoMan") or "0x0").replace("x", "-")
        for x in (ten, ben):
            if not AN_TOAN.match(x):
                return self._tra(400, {"loi": "ten khong hop le: %s" % x})

        os.makedirs(DICH, exist_ok=True)
        ten_file = "%s.%s.%s.json" % (ten, ben, kho)
        with open(os.path.join(DICH, ten_file), "w", encoding="utf-8") as f:
            json.dump(goi, f, ensure_ascii=False, indent=1)

        so_dong = len(goi.get("dong") or [])
        print("  nhan %-34s %3d phan tu  (%s)" % (ten_file, so_dong, goi.get("url")))
        return self._tra(200, {"ok": 1, "file": ten_file, "soDong": so_dong})

    def _tra(self, ma, obj):
        du_lieu = json.dumps(obj).encode()
        self.send_response(ma)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(du_lieu)))
        self.end_headers()
        self.wfile.write(du_lieu)

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    os.makedirs(DICH, exist_ok=True)
    srv = ThreadingHTTPServer(("127.0.0.1", CONG), H)
    srv.daemon_threads = True
    print("=" * 66)
    print("  Bo thu dau van tay DOM — cong %d" % CONG)
    print("  Ghi vao: %s" % DICH)
    print("  Ctrl+C de dung")
    print("=" * 66)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\nDa dung.")
