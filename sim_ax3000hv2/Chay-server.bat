@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   Gia lap AX3000HV2
echo   Ban tu thiet bi that
echo   Mo trinh duyet: http://localhost:8092/
echo   Ctrl+C de dung
echo ============================================
echo.
where py >nul 2>nul
if %errorlevel%==0 ( py server2.py 8092 & goto end )
where python >nul 2>nul
if %errorlevel%==0 ( python server2.py 8092 & goto end )
echo [LOI] Khong tim thay Python.
pause
:end
pause
