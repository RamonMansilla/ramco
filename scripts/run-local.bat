@echo off
REM RAMCO - ejecuta la version local (rama main-local)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-local.ps1"
echo.
pause
