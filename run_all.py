#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Master Server (Port 8080) cho Hệ thống giả lập mạng FPT.
Đóng vai trò điều hướng (Dispatcher) các request tới đúng server con
mà không cần mở thêm các cổng khác (8081-8098).
"""
import os
import sys
import threading
import time
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

# Reconfigure stdout cho UTF-8 trên Windows
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

PORT = 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(BASE_DIR)

# Import các Handler của từng thiết bị
import sim_ac1000f.server2 as ac1000f
import sim_ax3000c.server as ax3000c
import sim_ax3000gz.server as ax3000gz
import sim_ax3000hv2.server2 as ax3000hv2
import sim_ax3000s.server as ax3000s
import sim_be15000.server as be15000

# Mapping từ device id sang module
SIM_MODULES = {
    'sim_ac1000f': ac1000f,
    'sim_ax3000c': ax3000c,
    'sim_ax3000gz': ax3000gz,
    'sim_ax3000hv2': ax3000hv2,
    'sim_ax3000s': ax3000s,
    'sim_be15000': be15000
}

# Các class Handler của từng thiết bị
SIM_HANDLERS = {
    'sim_ac1000f': ac1000f.H,
    'sim_ax3000c': ax3000c.Handler,
    'sim_ax3000gz': ax3000gz.H,
    'sim_ax3000hv2': ax3000hv2.H,
    'sim_ax3000s': ax3000s.H,
    'sim_be15000': be15000.H
}

class MasterDispatcher(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def detect_simulator(self):
        # 1. Kiểm tra prefix trong URL path
        path = self.path.split('?')[0]
        
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
        print(f"[DEBUG] detect_simulator for {self.path} - Referer: {referer}")
        
        if referer:
            ref_path = urlparse(referer).path
            for sim_id in SIM_MODULES.keys():
                prefix = '/' + sim_id
                if ref_path == prefix or ref_path.startswith(prefix + '/'):
                    return sim_id

        # 3. Kiểm tra Cookie (Fallback an toàn nhất)
        cookie = self.headers.get('Cookie', '')
        # print(f"[DEBUG] detect_simulator for {self.path} - Cookie: {cookie}")
        if cookie:
            import re
            m = re.search(r'current_sim=(sim_[a-zA-Z0-9_]+)', cookie)
            if m:
                sim_id = m.group(1)
                if sim_id in SIM_MODULES:
                    # Chống cướp quyền (hijacking) Portal:
                    # Nếu request đang yêu cầu rõ ràng các file của Portal, ta bỏ qua Cookie
                    portal_paths = ['/', '/index.html', '/styles.css', '/app.js', '/favicon.ico', '/guide-overlay.js']
                    portal_prefixes = ['/step_by_step/', '/devices/', '/assets/']
                    
                    is_portal = False
                    if path in portal_paths:
                        is_portal = True
                    for pp in portal_prefixes:
                        if path.startswith(pp):
                            is_portal = True
                            
                    if not is_portal:
                        return sim_id

        return None

    def dispatch(self, method):
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
                    self.directory = os.path.join(BASE_DIR, sim_id, "www")
                
                # -------------------------------------------------------------
                # MONKEY PATCH ĐỂ FIX LỖI MẤT PREFIX KHI REDIRECT VÀ GIỮ COOKIE
                # -------------------------------------------------------------
                original_send_header = self.send_header
                def custom_send_header(keyword, value):
                    if keyword.lower() == 'location' and value.startswith('/'):
                        value = '/' + sim_id + value
                    original_send_header(keyword, value)
                self.send_header = custom_send_header
                
                original_end_headers = self.end_headers
                def custom_end_headers():
                    # Đảm bảo Cookie lưu ở thư mục gốc / để toàn bộ trang đều gửi
                    original_send_header('Set-Cookie', f'current_sim={sim_id}; Path=/')
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
        if self.path.split('?')[0] == '/guide-overlay.js':
            original_directory = getattr(self, 'directory', None)
            self.directory = BASE_DIR
            try:
                return super().do_GET()
            finally:
                if original_directory is not None:
                    self.directory = original_directory
        self.dispatch('GET')

    def do_POST(self):
        self.dispatch('POST')
        
    def do_DELETE(self):
        self.dispatch('DELETE')


def start_server():
    os.chdir(BASE_DIR)
    srv = ThreadingHTTPServer(('0.0.0.0', PORT), MasterDispatcher)
    srv.daemon_threads = True
    print("=" * 65)
    print("   HE THONG GIA LAP MANG FPT - MASTER DISPATCHER")
    print("   Da gop tat ca thiet bi chay tren 1 cong duy nhat!")
    print(f"   Dang chay tai: http://localhost:{PORT}")
    print("=" * 65)
    
    def open_browser():
        time.sleep(1)
        webbrowser.open(f"http://localhost:{PORT}")
    
    threading.Thread(target=open_browser, daemon=True).start()
    
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\nDa tat may chu.")

if __name__ == "__main__":
    start_server()
