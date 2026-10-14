@echo off
title LifeLink Angular Frontend (Port 4200)
echo ========================================================
echo   Starting LifeLink Angular 17 Unified Frontend...
echo ========================================================
cd /d "%~dp0frontend"
call npm start
pause
