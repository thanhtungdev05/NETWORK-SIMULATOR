@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   Gia lap AC1000F (FPT Internet Hub)
echo   Ban tu thiet bi that
echo   Mo trinh duyet: http://localhost:8081/
echo   (Chay song song voi Portal tren cong 8080)
echo   Ctrl+C de dung
echo ============================================
echo.
where py >nul 2>nul
if %errorlevel%==0 ( py server2.py 8081 & goto end )
where python >nul 2>nul
if %errorlevel%==0 ( python server2.py 8081 & goto end )
echo [LOI] Khong tim thay Python.
pause
:end
pause
