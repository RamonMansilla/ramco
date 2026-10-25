@echo off
REM RAMCO - ejecuta la ultima version del remoto (rama main)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-remote.ps1"
echo.
pause
