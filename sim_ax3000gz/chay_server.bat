@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   AX3000GZV3 (ZTE F6201B) - Gia lap web
echo   Dia chi: http://localhost:8094/
echo   Nhan Ctrl+C de dung
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
