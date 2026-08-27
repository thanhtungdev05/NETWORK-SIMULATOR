@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   ONT-BE6500C - Gia lap giao dien web
echo   (KHONG phai AP-BE6500C - cong khac nhau)
echo   Dia chi: http://localhost:8094/
echo   Nhan Ctrl+C de dung
echo ============================================
echo.

if not exist "src\server.py" (
  echo [CHUA CO] src\server.py chua duoc dung - dang o Giai doan 1
  echo           ^(thu thap bang chung^). Hay chay chay_collector.bat truoc.
  echo.
  pause
  goto :eof
)

where py >nul 2>nul
if %errorlevel%==0 ( py src\server.py & goto end )
where python >nul 2>nul
if %errorlevel%==0 ( python src\server.py & goto end )
echo [LOI] Khong tim thay Python.
pause

:end
echo.
pause
