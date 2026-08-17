@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   Vigor2927
echo   Bo thu thap giao dien
echo   Nghe tai: http://127.0.0.1:8092
echo   Giu cua so nay mo trong luc thu thap
echo ============================================
echo.

where py >nul 2>nul
if %errorlevel%==0 ( py collector.py & goto end )
where python >nul 2>nul
if %errorlevel%==0 ( python collector.py & goto end )
echo [LOI] Khong tim thay Python.
pause

:end
echo.
pause
