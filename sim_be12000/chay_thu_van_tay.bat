@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo   Bo thu dau van tay DOM  -  phuc vu doi chieu that / gia lap
echo ============================================================
echo.
echo   Cong          :  8199
echo   Ghi ket qua   :  reference\vantay\
echo.
echo   De cua so nay chay trong luc doi chieu.
echo   Dung: dong cua so hoac Ctrl+C
echo.
python tools\thu_van_tay.py 8199
pause
