@echo off
title LifeLink Dependencies Installer
echo ========================================================
echo   LifeLink Blood Management System - Setup Installer
echo ========================================================
echo.

echo [1/2] Installing Frontend Node.js Dependencies...
cd /d "%~dp0frontend"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm install failed. Please verify Node.js and npm are installed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/2] Resolving Backend Maven Dependencies...
cd /d "%~dp0backend"
call mvnw.cmd clean compile
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Maven build failed. Please verify JDK 17+ is installed and JAVA_HOME is set.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ========================================================
echo   SUCCESS! All dependencies installed cleanly.
echo   You can now launch the project using start-all.bat
echo ========================================================
pause
