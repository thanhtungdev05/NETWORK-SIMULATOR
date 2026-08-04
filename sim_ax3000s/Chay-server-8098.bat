@echo off
REM ============================================================
REM  Chay bo gia lap AX3000S bang Python (Port 8098)
REM  Yeu cau: da cai Python 3 (python.org)
REM ============================================================
cd /d "%~dp0"
echo.
echo   Dang chay may chu gia lap AX3000S (Port 8098)...
echo   Mo trinh duyet va vao dia chi:  http://localhost:8098
echo   (Nhan Ctrl+C de dung)
echo.
python server.py 8098
pause
