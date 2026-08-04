#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gia lap AX3000Hv2 (FPT Internet Hub) - dung TRANG THAT crawl tu thiet bi.
Kien truc frameset ASP: index.asp gom header/nav/main frame, moi trang la URL
/cgi-bin/*.asp that. Server nay phuc vu dung cac URL do, tra .asp/.cgi ve dang
text/html de trinh duyet render (khong tai xuong).

Chay: python server2.py [port]   (mac dinh 8092)
"""
import os, sys, socket
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, unquote

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8092
BASE = os.path.dirname(os.path.abspath(__file__))
WWW = os.path.join(BASE, "www2")

CT = {
    ".asp": "text/html; charset=utf-8", ".cgi": "text/html; charset=utf-8",
    ".html": "text/html; charset=utf-8", ".htm": "text/html; charset=utf-8",
    ".css": "text/css", ".js": "application/javascript",
    ".png": "image/png", ".gif": "image/gif", ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg", ".ico": "image/x-icon", ".svg": "image/svg+xml",
    ".ttf": "font/ttf", ".woff": "font/woff", ".woff2": "font/woff2",
    ".otf": "font/otf", ".eot": "application/vnd.ms-fontobject",
}


class H(BaseHTTPRequestHandler):
    def _send(self, data, ctype, code=200):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def _redirect(self, to):
        self.send_response(302)
        self.send_header("Location", to)
        self.end_headers()

    def do_GET(self):
        p = unquote(urlparse(self.path).path)
        if p in ("/", "/index.html", "/cgi-bin/login.html"):
            return self._redirect("/cgi-bin/login.asp")

        # Dang nhap: login.asp goi submitform() -> top.location "/cgi-bin/
        # requestFromLoginPage". submitform da kiem user+pass khong rong roi.
        # Ban gia lap chi can chuyen vao trang chinh (frameset).
        if p in ("/cgi-bin/requestFromLoginPage", "/cgi-bin/reqLogin", "/cgi-bin/logincheck.cgi"):
            return self._redirect("/cgi-bin/index.asp")

        # Dang xuat -> ve trang login
        if "logout" in p.lower() or p.endswith("/doLogout"):
            return self._redirect("/cgi-bin/login.asp")

        # Nếu chưa có tham số login mà truy cập login.asp thì phục vụ form login
        # (mặc định rơi xuống phần phục vụ file bên dưới).

        # duong dan file trong www2
        f = os.path.join(WWW, p.lstrip("/"))
        if os.path.isfile(f):
            ext = os.path.splitext(f)[1].lower()
            with open(f, "rb") as fh:
                return self._send(fh.read(), CT.get(ext, "application/octet-stream"))

        return self._send(b"Not found: " + p.encode(), "text/plain", 404)

    def do_POST(self):
        # cac form Apply cua thiet bi POST ve CGI; ban gia lap chi bao thanh cong
        # (khong ghi cau hinh). Tra ve trang chinh de khong loi.
        self._redirect(self.headers.get("Referer") or "/cgi-bin/index.asp")

    def log_message(self, *a):
        pass


class DualStack(ThreadingHTTPServer):
    address_family = socket.AF_INET6
    daemon_threads = True

    def server_bind(self):
        try:
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        except (AttributeError, OSError):
            pass
        super().server_bind()


def make(port):
    s = ThreadingHTTPServer(("0.0.0.0", port), H)
    s.daemon_threads = True
    return s


if __name__ == "__main__":
    srv = make(PORT)
    print("=" * 56)
    print("  Gia lap AX3000Hv2 (FPT Internet Hub) - tu thiet bi that")
    print(f"  Mo trinh duyet: http://localhost:{PORT}/")
    print(f"  So trang: {len(os.listdir(os.path.join(WWW,'cgi-bin')))}")
    print("  Ctrl+C de dung")
    print("=" * 56)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\nDa dung.")
