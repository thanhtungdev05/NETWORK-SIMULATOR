#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bo thu thap giao dien AC1000F tu thiet bi that.
Trinh duyet dang mo 192.168.1.1 se POST noi dung tung trang sang day
-> ghi thang ra o dia, khong di qua ngu canh cua Claude.

Cong 8090 (rieng cho thiet bi nay, khong dung chung voi may khac).
Chay: python collector.py
"""
import os, sys, json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8090
BASE = os.path.dirname(os.path.abspath(__file__))
CAP = os.path.join(BASE, "captures")
os.makedirs(CAP, exist_ok=True)


def safe(name):
    keep = "-_."
    n = "".join(c if (c.isalnum() or c in keep) else "_" for c in name)
    return n.strip("_") or "unnamed"


class H(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self):
        p = urlparse(self.path).path.rstrip("/")
        if p in ("", "/status"):
            files = sorted(os.listdir(CAP))
            body = json.dumps({"ok": True, "count": len(files), "files": files}, indent=1).encode()
            self.send_response(200)
            self._cors()
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        self.send_error(404)

    def do_POST(self):
        u = urlparse(self.path)
        if u.path.rstrip("/") != "/save":
            return self.send_error(404)
        q = parse_qs(u.query)
        name = safe(q.get("name", ["page"])[0])
        ext = safe(q.get("ext", ["html"])[0])
        ln = int(self.headers.get("Content-Length", 0))
        data = self.rfile.read(ln) if ln else b""
        with open(os.path.join(CAP, f"{name}.{ext}"), "wb") as f:
            f.write(data)
        print(f"  luu {name}.{ext}  ({len(data)} bytes)")
        body = json.dumps({"ok": True, "saved": f"{name}.{ext}", "bytes": len(data)}).encode()
        self.send_response(200)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), H)
    srv.daemon_threads = True
    print("=" * 56)
    print("  AX3000GZV3 (ZTE F6201B) - Bo thu thap giao dien")
    print(f"  Dang nghe: http://127.0.0.1:{PORT}")
    print(f"  Luu vao:   {CAP}")
    print("  Ctrl+C de dung")
    print("=" * 56)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\nDa dung.")
