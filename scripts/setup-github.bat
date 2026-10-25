@echo off
REM RAMCO - guarda credenciales de GitHub para poder hacer push
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-github.ps1"
echo.
pause
