#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Master Server (Port 8080) cho Hệ thống giả lập mạng FPT.
Đóng vai trò điều hướng (Dispatcher) các request tới đúng server con
và proxy /api/* sang PHP nội bộ — toàn bộ chạy trên 1 cổng duy nhất (8080).
"""
import os
import re
import sys
import threading
import time
import webbrowser
import socket
import shutil
import subprocess
import http.client
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

# Reconfigure stdout cho UTF-8 trên Windows
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

PORT = int(os.environ.get('PORT', '8080'))
API_PORT = int(os.environ.get('API_PORT', '8082'))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DASHBOARD_DIR = os.path.join(BASE_DIR, 'dashboard-authen')
os.chdir(BASE_DIR)

# Import các Handler của từng thiết bị
import simulators.sim_ac1000f.server2 as ac1000f
import simulators.sim_ax3000c.server as ax3000c
import simulators.sim_ax3000gz.server as ax3000gz
import simulators.sim_ax3000hv2.server2 as ax3000hv2
import simulators.sim_ax3000s.server as ax3000s
import simulators.sim_be12000.src.server as be12000
import simulators.sim_be15000.server as be15000
import simulators.sim_ac1000HI.src.server as ac1000HI
import simulators.sim_vigor2927.src.server as vigor2927
import simulators.sim_ONT_be6500c.src.server as be6500c
import simulators.ont_be6500c.src.server as ONT_be6500c
import simulators.mikrotik_hexs.src.server as mikrotik_hexs

# Mapping từ device id sang module
SIM_MODULES = {
    'sim_ac1000f': ac1000f,
    'sim_ax3000c': ax3000c,
    'sim_ax3000gz': ax3000gz,
    'sim_ax3000hv2': ax3000hv2,
    'sim_ax3000s': ax3000s,
    'sim_be12000': be12000,
    'sim_be15000': be15000,
    'sim_ac1000HI': ac1000HI,
    'sim_vigor2927': vigor2927,
    'sim_be6500c': be6500c,
    'sim_ONT_be6500c': ONT_be6500c,
    'sim_mikrotik_hexs': mikrotik_hexs
}

# Các class Handler của từng thiết bị
SIM_HANDLERS = {
    'sim_ac1000f': ac1000f.H,
    'sim_ax3000c': ax3000c.Handler,
    'sim_ax3000gz': ax3000gz.H,
    'sim_ax3000hv2': ax3000hv2.H,
    'sim_ax3000s': ax3000s.H,
    'sim_be12000': be12000.Handler,
    'sim_be15000': be15000.H,
    'sim_ac1000HI': ac1000HI.H,
    'sim_vigor2927': vigor2927.H,
    'sim_be6500c': be6500c.H,
    'sim_ONT_be6500c': ONT_be6500c.H,
    'sim_mikrotik_hexs': mikrotik_hexs.H
}

# File/thư mục Portal luôn do Portal phục vụ (chống bị 'cướp' bởi Referer/Cookie)
PORTAL_PATHS = {'/', '/index.html', '/styles.css', '/app.js', '/data.js', '/portal.html',
                '/favicon.ico', '/login', '/login/index.html', '/api',
                '/dashboard', '/dashboard/', '/dashboard-authen', '/dashboard-authen/'}
PORTAL_PREFIXES = ('/devices/', '/assets/', '/login/', '/api/', '/vendor/', '/dashboard/', '/dashboard-authen/')


def is_portal_path(path):
    """True neu path thuoc Portal (dung chung cho cac buoc detect_simulator)."""
    if path in PORTAL_PATHS:
        return True
    for prefix in PORTAL_PREFIXES:
        if path.startswith(prefix):
            if prefix == '/assets/':
                file_path = os.path.join(BASE_DIR, path.lstrip('/'))
                if not os.path.exists(file_path):
                    return False
            return True
    return False

class MasterDispatcher(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def detect_simulator(self):
        # 0. Các file/thư mục Portal luôn do Portal phục vụ (chống bị 'cướp' bởi Referer/Cookie)
        path = self.path.split('?')[0]
        
        # Ngoại lệ cho BE12000: thiết bị này dùng /?_type=... cho mọi AJAX request.
        # Nếu path là / nhưng có tham số _type=, ta bỏ qua check Portal để nó được
        # route xuống simulator dựa vào Referer/Cookie.
        if path == '/' and ('?_type=' in self.path or '&_type=' in self.path):
            pass
        elif is_portal_path(path):
            return None

        # 1. Kiểm tra prefix trong URL path
        for sim_id in SIM_MODULES.keys():
            prefix = '/' + sim_id
            if path == prefix or path.startswith(prefix + '/'):
                parts = self.path.split('?', 1)
                new_path = parts[0][len(prefix):]
                if not new_path.startswith('/'):
                    new_path = '/' + new_path
                if len(parts) > 1:
                    new_path += '?' + parts[1]
                self.path = new_path
                return sim_id

        # 2. Kiểm tra header Referer
        referer = self.headers.get('Referer', '')
        if referer:
            ref_path = urlparse(referer).path
            for sim_id in SIM_MODULES.keys():
                prefix = '/' + sim_id
                if ref_path == prefix or ref_path.startswith(prefix + '/'):
                    return sim_id

        # 3. Kiểm tra Cookie (Fallback an toàn nhất)
        cookie = self.headers.get('Cookie', '')
        if cookie:
            m = re.search(r'current_sim=(sim_[a-zA-Z0-9_]+)', cookie)
            if m:
                sim_id = m.group(1)
                # Chống cướp quyền (hijacking) Portal: request rõ ràng thuộc Portal thì bỏ qua Cookie
                if sim_id in SIM_MODULES and not is_portal_path(path):
                    return sim_id

        return None

    def _proxy_api(self, method):
        """Reverse proxy /api/* sang PHP noi bo de giu SINGLE-PORT (chi can 8080).
        Giữ nguyên Host header tu trinh duyet de PHP build dung absolute URL + cookie."""
        headers = {}
        for k, v in self.headers.items():
            if k.lower() in ('connection', 'keep-alive', 'proxy-connection',
                             'transfer-encoding', 'upgrade', 'content-length'):
                continue
            headers[k] = v

        body = b''
        if method in ('POST', 'PUT', 'PATCH', 'DELETE'):
            try:
                length = int(self.headers.get('Content-Length', '0') or 0)
            except ValueError:
                length = 0
            if length > 0:
                body = self.rfile.read(length)

        conn = None
        try:
            conn = http.client.HTTPConnection('127.0.0.1', API_PORT, timeout=30)
            conn.request(method, self.path, body=body, headers=headers)
            resp = conn.getresponse()
            data = resp.read()
        except Exception as e:
            print('[API-PROXY] Loi chuyen tiep /api/* -> PHP: %s' % e)
            self.send_error(502, 'Bad Gateway')
            return
        finally:
            if conn is not None:
                conn.close()

        self.send_response(resp.status)
        hop_by_hop = {'connection', 'keep-alive', 'proxy-connection', 'transfer-encoding', 'upgrade'}
        for k, v in resp.getheaders():
            if k.lower() in hop_by_hop or k.lower() == 'content-length':
                continue
            self.send_header(k, v)
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        if method != 'HEAD':
            try:
                self.wfile.write(data)
            except (BrokenPipeError, ConnectionResetError):
                pass

    def dispatch(self, method):
        # Chuyen tiep /api/* -> PHP noi bo (browser chi can 1 cong 8080)
        path_only = self.path.split('?')[0]
        if path_only == '/api' or path_only.startswith('/api/'):
            return self._proxy_api(method)

        # Mount dashboard (thu muc dashboard-authen) thanh /dashboard/*.
        # Xu ly TRUOC detect_simulator de tranh bi cookie current_sim cua sim 'cuop' request.
        if method == 'GET' and (path_only == '/dashboard' or path_only.startswith('/dashboard/') or path_only == '/dashboard-authen' or path_only.startswith('/dashboard-authen/')):
            parts = self.path.split('?', 1)
            prefix = '/dashboard-authen' if path_only.startswith('/dashboard-authen') else '/dashboard'
            sub = parts[0][len(prefix):]
            if sub == '':
                sub = '/'
            if not sub.startswith('/'):
                sub = '/' + sub
            self.path = sub + (('?' + parts[1]) if len(parts) > 1 else '')
            self.directory = DASHBOARD_DIR
            return super().do_GET()

        sim_id = self.detect_simulator()
        if sim_id:
            # Gán thư mục gốc cho SimpleHTTPRequestHandler (được dùng bởi một số handler con)
            mod = SIM_MODULES[sim_id]
            if hasattr(mod, 'ROOT'):
                self.directory = mod.ROOT
            
            # Đổi current working directory (CWD) vì một số handler dùng cwd
            old_cwd = os.getcwd()
            if hasattr(mod, 'ROOT'):
                os.chdir(mod.ROOT)
            elif hasattr(mod, 'BASE'):
                os.chdir(mod.BASE)

            original_class = self.__class__
            original_directory = getattr(self, 'directory', None)
            try:
                handler_class = SIM_HANDLERS[sim_id]
                self.__class__ = handler_class
                
                sim_module = SIM_MODULES[sim_id]
                if hasattr(sim_module, 'ROOT'):
                    self.directory = getattr(sim_module, 'ROOT')
                elif hasattr(sim_module, 'WWW'):
                    self.directory = getattr(sim_module, 'WWW')
                else:
                    self.directory = os.path.join(BASE_DIR, "simulators", sim_id, "www")
                
                # -------------------------------------------------------------
                # MONKEY PATCH ĐỂ FIX LỖI MẤT PREFIX KHI REDIRECT VÀ GIỮ COOKIE
                # -------------------------------------------------------------
                original_send_header = self.send_header
                original_end_headers = self.end_headers

                def custom_send_header(keyword, value):
                    if keyword.lower() == 'location' and value.startswith('/'):
                        value = '/' + sim_id + value
                    original_send_header(keyword, value)
                self.send_header = custom_send_header
                
                def custom_end_headers():
                    # Đảm bảo Cookie lưu ở thư mục gốc / để toàn bộ trang đều gửi
                    original_send_header('Set-Cookie', f'current_sim={sim_id}; Path=/')
                    original_send_header('Cache-Control', 'no-cache, must-revalidate')
                    original_end_headers()
                self.end_headers = custom_end_headers
                # -------------------------------------------------------------

                print(f"[DISPATCH] {method} {self.path} -> {sim_id}")

                if method == 'GET':
                    return self.do_GET()
                elif method == 'POST':
                    return self.do_POST()
                elif method == 'DELETE':
                    if hasattr(self, 'do_DELETE'):
                        return self.do_DELETE()
                else:
                    self.send_error(501, "Unsupported method")
                    return
            except Exception as e:
                import traceback
                print(f"Error in {sim_id} {method}: {e}")
                traceback.print_exc()
                self.__class__ = original_class
                self.send_error(500, "Internal Server Error")
                return
            finally:
                self.send_header = original_send_header
                self.end_headers = original_end_headers
                self.__class__ = original_class
                if original_directory is not None:
                    self.directory = original_directory
                os.chdir(old_cwd)
        
        # Nếu không trúng simulator nào -> phục vụ file tĩnh của Portal
        if method == 'GET':
            # Set default index.html if pointing to a directory
            path = self.path.split('?')[0]
            if path == '/':
                self.path = '/index.html'
            return super().do_GET()
        else:
            self.send_error(404, "Not Found")

    def do_GET(self):
        self.dispatch('GET')

    def do_POST(self):
        self.dispatch('POST')
        
    def do_DELETE(self):
        self.dispatch('DELETE')


class DualStackServer(ThreadingHTTPServer):
    address_family = socket.AF_INET6
    daemon_threads = True
    # Windows SO_REUSEADDR cho phep bind trung cong -> tat de chi 1 instance chay duoc
    allow_reuse_address = False

    def server_bind(self):
        try:
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        except (AttributeError, OSError):
            pass
        super().server_bind()


def listening_pids(local_target):
    """Tra ve tap PID cac tien trinh dang LISTENING co dia chi cuc bo la local_target.
    local_target vi du: '127.0.0.1:8082' hoac '8080' (moi dia chi)."""
    pids = set()
    try:
        out = subprocess.run(['netstat', '-ano'], capture_output=True, text=True, timeout=10).stdout
    except Exception:
        return pids
    for line in out.splitlines():
        if 'LISTENING' not in line.upper():
            continue
        parts = line.split()
        if len(parts) < 5 or not parts[-1].isdigit():
            continue
        local = parts[1]
        if local_target.isdigit():
            match = local.endswith(':' + local_target)
        else:
            match = local == local_target
        if match:
            pids.add(int(parts[-1]))
    return pids


def process_name(pid):
    """Ten tien trinh (chu thuong) theo PID; tra ve '' neu khong lay duoc."""
    try:
        return subprocess.run(
            ['tasklist', '/fi', 'PID eq %d' % pid, '/fo', 'csv', '/nh'],
            capture_output=True, text=True, timeout=10
        ).stdout.lower()
    except Exception:
        return ''


def wait_port_free(port, timeout=3.0, step=0.3):
    """Doi den khi cong port khong con LISTENING nao (sau taskkill bat dong bo).
    Tra ve True neu da free trong thoi gian cho, False neu van con."""
    waited = 0.0
    while waited < timeout:
        if not listening_pids(str(port)):
            return True
        time.sleep(step)
        waited += step
    return not listening_pids(str(port))


def kill_orphan_php():
    """Dong PHP mo coi (php -S) dang lang nghe 127.0.0.1:API_PORT tu lan chay truoc.
    Chi dong process php.exe tren dung cong API noi bo, khong dong server khac."""
    for pid in listening_pids('127.0.0.1:%d' % API_PORT):
        if 'php' not in process_name(pid):
            continue
        subprocess.run(['taskkill', '/pid', str(pid), '/f'],
                       capture_output=True, text=True, timeout=10)
        print('[API] Da dong PHP mo coi (pid %d) tren 127.0.0.1:%d.' % (pid, API_PORT))


def start_php_api():
    """Tu dong chay PHP API server neu co the (tam dung khi START_PHP=0)."""
    if os.environ.get('START_PHP', '1') == '0':
        print("[API] START_PHP=0 -> khong tu dong chay PHP.")
        return None

    php = shutil.which('php')
    if not php:
        print("[API] KHONG tim thay php trong PATH -> bo qua. Chay thu cong: php -S 0.0.0.0:%d -t ." % API_PORT)
        return None

    # Tu dong dong PHP mo coi cua lan chay truoc (neu co)
    kill_orphan_php()

    # Doi cho cong that su gia phong sau taskkill (bat dong bo)
    if not wait_port_free(API_PORT):
        print("[API] CANH BAO: cong %d van co server la (khong phai PHP) -> dung chung, /api/* co the loi." % API_PORT)
        return None

    try:
        log_path = os.path.join(BASE_DIR, 'php_api.log')
        log_file = open(log_path, 'a', encoding='utf-8', errors='replace')
        proc = subprocess.Popen(
            [php, '-S', '127.0.0.1:%d' % API_PORT, '-t', BASE_DIR],
            cwd=BASE_DIR,
            stdout=log_file,
            stderr=subprocess.STDOUT,
        )
        print("[API] PHP noi bo chi lang nghe 127.0.0.1:%d (pid %d, log: %s)" % (API_PORT, proc.pid, log_path))
        print("[API] /api/* duoc dispatcher proxy tu http://127.0.0.1:%d" % PORT)
        return proc
    except Exception as exc:
        print("[API] Khong chay duoc PHP: %s" % exc)
        return None


def start_server():
    os.chdir(BASE_DIR)

    # Chong chay 2 instance: neu cong PORT da co trinh lang nghe -> tu dong tat instance cu cua minh
    owners = listening_pids(str(PORT))
    foreign = []
    for pid in sorted(owners):
        name = process_name(pid)
        if 'python' in name or name.strip().startswith('"py'):
            print("[API] Phat hien instance cu (pid %d) dang giu cong %d -> tu dong tat." % (pid, PORT))
            subprocess.run(['taskkill', '/pid', str(pid), '/f', '/t'],
                           capture_output=True, text=True, timeout=10)
        else:
            foreign.append(pid)

    if foreign:
        print("=" * 65)
        print("   [LOI] Cong %d bi tien trinh khac (khong phai run_all.py) chiem giu!" % PORT)
        print("   PID: %s" % ", ".join(str(p) for p in foreign))
        print("   Hay tu tat no roi chay lai, vi du:")
        print("     Get-NetTCPConnection -LocalPort %d -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }" % PORT)
        print("=" * 65)
        return

    if owners and not wait_port_free(PORT, timeout=4.5):
        print("[LOI] Cong %d chua duoc giai phong, tu bo." % PORT)
        return

    php_proc = start_php_api()

    try:
        srv = DualStackServer(('::', PORT), MasterDispatcher)
    except (OSError, ValueError):
        fallback_srv = type('IPv4Server', (ThreadingHTTPServer,), {'allow_reuse_address': False})
        srv = fallback_srv(('0.0.0.0', PORT), MasterDispatcher)
    srv.daemon_threads = True
    print("=" * 65)
    print("   HE THONG GIA LAP MANG FPT - MASTER DISPATCHER")
    print("   Tat ca chay tren 1 cong duy nhat (single-port)!")
    print(f"   Portal + Devices + API: http://127.0.0.1:{PORT}")
    print(f"   API (/api/*) duoc proxy sang PHP noi bo 127.0.0.1:{API_PORT}")
    print("=" * 65)
    

    
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\nDa tat may chu.")
    finally:
        if php_proc is not None:
            php_proc.terminate()

if __name__ == "__main__":
    start_server()
