#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gia lap giao dien web BE15000 (ZTE H6701Q V3).
App that la jQuery + nap trang qua AJAX. Ban gia lap phuc vu 16 trang da chup
(noi dung da render san), dieu huong bang nav.js theo thuoc tinh `menupage`.

Chay: python server.py [port]   (mac dinh 8096)
"""
import os, sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, unquote

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8096
BASE = os.path.dirname(os.path.abspath(__file__))
WWW = os.path.join(BASE, "www")
PAGES = os.path.join(WWW, "pages")

TRANG_CHU = "/page/localNetStatus"   # trang mac dinh sau khi dang nhap

CT = {
    ".html": "text/html; charset=utf-8", ".css": "text/css",
    ".js": "application/javascript", ".png": "image/png", ".gif": "image/gif",
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
}


class H(BaseHTTPRequestHandler):
    def _gui(self, data, ctype, code=200):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def _file(self, path, ctype):
        if os.path.exists(path):
            with open(path, "rb") as fh:
                data = fh.read()
                if "html" in ctype:
                    hide_css = b'<style>#claude-agent-glow-border,#claude-static-indicator-container,.glasp-extension,.glasp-extension-toaster,yd-sidebar,plasmo-csui{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}</style>'
                    if b'</head>' in data:
                        data = data.replace(b'</head>', hide_css + b'</head>', 1)
                    else:
                        data = hide_css + data
                return self._gui(data, ctype)
        return self._gui(b"Not found", "text/plain", 404)

    def _chuyen(self, to):
        self.send_response(302)
        self.send_header("Location", to)
        self.end_headers()

    def do_GET(self):
        p = unquote(urlparse(self.path).path)

        # goc -> trang dang nhap (giong thiet bi that)
        if p in ("/", "/index.html"):
            return self._chuyen("/login")

        if p in ("/login", "/login.html"):
            return self._file(os.path.join(WWW, "login.html"), CT[".html"])

        # trang cau hinh
        if p.startswith("/page/"):
            pid = p[len("/page/"):].strip("/")
            f = os.path.join(PAGES, pid + ".html")
            if os.path.exists(f):
                return self._file(f, CT[".html"])
            return self._chuyen(TRANG_CHU)

        # tai nguyen
        if p in ("/nav.js", "/collapse.js", "/actions.js", "/mobile.js", "/menu-tree.js"):
            return self._file(os.path.join(WWW, p.lstrip("/")), CT[".js"])
        if p.startswith("/img/"):
            f = os.path.join(WWW, "img", os.path.basename(p))
            ext = os.path.splitext(f)[1].lower()
            return self._file(f, CT.get(ext, "application/octet-stream"))
        if p.startswith("/css/"):
            f = os.path.join(WWW, "css", os.path.basename(p))
            return self._file(f, CT[".css"])
        # common_lib.js da bi strip nhung phong khi con tham chieu -> tra rong
        if p.endswith("common_lib.js"):
            return self._gui(b"", CT[".js"])

        return self._gui(b"Not found", "text/plain", 404)

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    srv = ThreadingHTTPServer(("0.0.0.0", PORT), H)
    srv.daemon_threads = True
    print("=" * 56)
    print("  Gia lap BE15000 (ZTE H6701Q V3)")
    print(f"  Mo trinh duyet: http://localhost:{PORT}/")
    print(f"  So trang: {len(os.listdir(PAGES))}")
    print("  Ctrl+C de dung")
    print("=" * 56)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\nDa dung.")
