@echo off
title LifeLink Spring Boot Backend (Port 8080)
echo ========================================================
echo   Starting LifeLink Spring Boot Backend Service...
echo ========================================================
cd /d "%~dp0backend"
call mvnw.cmd spring-boot:run
pause
