@echo off
REM RAMCO - sincroniza cambios locales con GitHub
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0sync.ps1"
echo.
pause
