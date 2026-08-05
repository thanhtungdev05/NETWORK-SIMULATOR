#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script khởi chạy tất cả Server Giả lập Mạng FPT (Mở từng cửa sổ riêng)
"""

import os
import sys
import time
import subprocess
import webbrowser

# Reconfigure stdout for UTF-8 on Windows console
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PYTHON_EXE = sys.executable

# Creation flag to open separate console window on Windows
CREATE_NEW_CONSOLE = getattr(subprocess, 'CREATE_NEW_CONSOLE', 0)

def start_servers():
    print("=" * 65)
    print("   HE THONG GIA LAP MANG FPT - TRINH KHOI CHAY TONG HOP")
    print("=" * 65)
    print()

    # 1. Main Portal / Login (Port 8080)
    print("[1/7] Dang mo cua so Portal Trung Tam (Port 8080)...")
    subprocess.Popen(
        [PYTHON_EXE, "-m", "http.server", "8080"],
        cwd=BASE_DIR,
        creationflags=CREATE_NEW_CONSOLE
    )

    # 2. AC1000F (Port 8081)
    ac1000f_dir = os.path.join(BASE_DIR, "sim_ac1000f")
    if os.path.exists(ac1000f_dir):
        print("[2/7] Dang mo cua so Server AC1000F (Port 8081)...")
        subprocess.Popen(
            [PYTHON_EXE, "server2.py", "8081"],
            cwd=ac1000f_dir,
            creationflags=CREATE_NEW_CONSOLE
        )

    # 3. AX3000C (Port 8090)
    ax3000c_dir = os.path.join(BASE_DIR, "sim_ax3000c")
    if os.path.exists(ax3000c_dir):
        print("[3/7] Dang mo cua so Server AX3000C (Port 8090)...")
        subprocess.Popen(
            [PYTHON_EXE, "server.py"],
            cwd=ax3000c_dir,
            creationflags=CREATE_NEW_CONSOLE
        )

    # 4. AX3000Hv2 (Port 8092)
    ax3000hv2_dir = os.path.join(BASE_DIR, "sim_ax3000hv2")
    if os.path.exists(ax3000hv2_dir):
        print("[4/7] Dang mo cua so Server AX3000Hv2 (Port 8092)...")
        subprocess.Popen(
            [PYTHON_EXE, "server2.py", "8092"],
            cwd=ax3000hv2_dir,
            creationflags=CREATE_NEW_CONSOLE
        )

    # 5. AX3000GZ (Port 8094)
    ax3000gz_dir = os.path.join(BASE_DIR, "sim_ax3000gz")
    if os.path.exists(ax3000gz_dir):
        print("[5/7] Dang mo cua so Server AX3000GZ (Port 8094)...")
        subprocess.Popen(
            [PYTHON_EXE, "server.py"],
            cwd=ax3000gz_dir,
            creationflags=CREATE_NEW_CONSOLE
        )

    # 6. BE15000 (Port 8096)
    be15000_dir = os.path.join(BASE_DIR, "sim_be15000")
    if os.path.exists(be15000_dir):
        print("[6/7] Dang mo cua so Server BE15000 (Port 8096)...")
        subprocess.Popen(
            [PYTHON_EXE, "server.py"],
            cwd=be15000_dir,
            creationflags=CREATE_NEW_CONSOLE
        )

    # 7. AX3000S (Port 8098)
    ax3000s_dir = os.path.join(BASE_DIR, "sim_ax3000s")
    if os.path.exists(ax3000s_dir):
        print("[7/7] Dang mo cua so Server AX3000S (Port 8098)...")
        subprocess.Popen(
            [PYTHON_EXE, "server.py", "8098"],
            cwd=ax3000s_dir,
            creationflags=CREATE_NEW_CONSOLE
        )

    print()
    print("=" * 65)
    print("   TAT CA SERVER DA DUOC KHOI CHAY THANH CONG TRONG CAC CUA SO RIENG!")
    print("   Dang mo trinh duyet: http://localhost:8080")
    print("=" * 65)

    time.sleep(2)
    webbrowser.open("http://localhost:8080")

if __name__ == "__main__":
    start_servers()
