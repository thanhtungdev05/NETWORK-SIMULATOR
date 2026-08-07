@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo   Gia lap BE12000 - ZTE F8728D V3.0.12P2N2
echo ============================================================
echo.
echo   Mo trinh duyet:  http://localhost:8098/
echo   Tai khoan     :  admin
echo   Mat khau      :  admin   (chua co bang chung mat khau that)
echo.
echo   Dung: dong cua so nay hoac bam Ctrl+C
echo.
python src\server.py --port 8098
pause
