@echo off
chcp 65001 >nul
title HE THONG GIA LAP MANG FPT

set "ROOT=%~dp0"
cd /d "%ROOT%"

echo ====================================================================
echo    HE THONG GIA LAP MANG FPT - KHOI DONG SERVER
echo ====================================================================
echo.

set PY_CMD=python
where python >nul 2>nul
if %errorlevel% neq 0 (
    where py >nul 2>nul
    if %errorlevel%==0 (
        set PY_CMD=py
    ) else (
        echo [LOI] Khong tim thay Python tren may tinh!
        echo Vui long cai dat Python tu https://www.python.org/
        pause
        exit /b 1
    )
)

echo Dang khoi dong Master Dispatcher tren cong 8080...
echo Tat ca thiet bi duoc gop chung vao 1 tien trinh nay de toi uu RAM.
%PY_CMD% run_all.py

pause
