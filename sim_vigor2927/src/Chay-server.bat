@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Dang khoi dong gia lap DrayTek Vigor2927...
echo Mo trinh duyet: http://localhost:8080/
start "" http://localhost:8080/
python server.py 8080
pause
