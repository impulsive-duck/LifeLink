@echo off
title LifeLink Project Launcher
echo ========================================================
echo   Launching LifeLink Full Stack System...
echo ========================================================
echo 1. Launching Spring Boot Backend on Port 8080 in separate window...
start "LifeLink Backend" cmd /k "%~dp0start-backend.bat"

echo 2. Launching Angular Frontend on Port 4200 in separate window...
start "LifeLink Frontend" cmd /k "%~dp0start-frontend.bat"

echo ========================================================
echo   Both services are starting up!
echo   Frontend: http://localhost:4200
echo   Backend:  http://localhost:8080
echo ========================================================
