@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   AX3000CV2 - Gia lap giao dien web
echo   Dia chi: http://localhost:8090/
echo   Nhan Ctrl+C de dung server
echo ============================================
echo.

where py >nul 2>nul
if %errorlevel%==0 (
    py server.py
    goto end
)
where python >nul 2>nul
if %errorlevel%==0 (
    python server.py
    goto end
)
echo [LOI] Khong tim thay Python. Hay cai Python tu https://www.python.org/
pause

:end
echo.
echo Server da dung.
pause
