@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   BE15000 (ZTE H6701Q V3)
echo   Gia lap giao dien web
echo   Mo trinh duyet: http://localhost:8096
echo   Ctrl+C de dung
echo ============================================
echo.
where py >nul 2>nul
if %errorlevel%==0 ( py server.py & goto end )
where python >nul 2>nul
if %errorlevel%==0 ( python server.py & goto end )
echo [LOI] Khong tim thay Python.
pause
:end
echo.
pause
