@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   BE6500C - Gia lap giao dien web
echo   Dia chi: http://localhost:8092/
echo   Nhan Ctrl+C de dung
echo ============================================
echo.

where py >nul 2>nul
if %errorlevel%==0 ( py src\server.py & goto end )
where python >nul 2>nul
if %errorlevel%==0 ( python src\server.py & goto end )
echo [LOI] Khong tim thay Python.
pause

:end
echo.
pause
