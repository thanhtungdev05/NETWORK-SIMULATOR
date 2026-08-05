@echo off
chcp 65001 >nul
title HE THONG GIA LAP MANG FPT

set "ROOT=%~dp0"
cd /d "%ROOT%"

echo ====================================================================
echo    HỆ THỐNG GIẢ LẬP MẠNG FPT — ĐANG BẬT TOÀN BỘ SERVER
echo ====================================================================
echo.

set PY_CMD=python
where python >nul 2>nul
if %errorlevel% neq 0 (
    where py >nul 2>nul
    if %errorlevel%==0 (
        set PY_CMD=py
    ) else (
        echo [LOI] Khong tim thay Python tren máy tính!
        echo Vui long cai dat Python tu https://www.python.org/
        pause
        exit /b
    )
)

echo [1/7] Dang mo cua so: Portal Trung Tam (Cổng 8000)...
start "Portal 8000" cmd /k "cd /d "%ROOT%" && %PY_CMD% -m http.server 8000"

echo [2/7] Dang mo cua so: Server AC1000F (Cổng 8081)...
start "Server AC1000F 8081" cmd /k "cd /d "%ROOT%sim_ac1000f" && %PY_CMD% server2.py 8081"

echo [3/7] Dang mo cua so: Server AX3000C (Cổng 8090)...
start "Server AX3000C 8090" cmd /k "cd /d "%ROOT%sim_ax3000c" && %PY_CMD% server.py"

echo [4/7] Dang mo cua so: Server AX3000Hv2 (Cổng 8092)...
start "Server AX3000Hv2 8092" cmd /k "cd /d "%ROOT%sim_ax3000hv2" && %PY_CMD% server2.py 8092"

echo [5/7] Dang mo cua so: Server AX3000GZ (Cổng 8094)...
start "Server AX3000GZ 8094" cmd /k "cd /d "%ROOT%sim_ax3000gz" && %PY_CMD% server.py"

echo [6/7] Dang mo cua so: Server BE15000 (Cổng 8096)...
start "Server BE15000 8096" cmd /k "cd /d "%ROOT%sim_be15000" && %PY_CMD% server.py"

echo [7/7] Dang mo cua so: Server AX3000S (Cổng 8098)...
start "Server AX3000S 8098" cmd /k "cd /d "%ROOT%sim_ax3000s" && %PY_CMD% server.py 8098"

echo.
echo ====================================================================
echo    ĐÃ MỞ DỦ 7 CỬA SỔ SERVER NỔI TRÊN MÀN HÌNH!
echo    Vui lòng GIỮ NGUYÊN các cửa sổ CMD đó khi thực hành.
echo    Đang mở trình duyệt: http://127.0.0.1:8000
echo ====================================================================
echo.
timeout /t 2 >nul
start http://127.0.0.1:8000

