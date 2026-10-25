@echo off
setlocal
title RAMNCO - publicar en Vercel
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\deploy.ps1" %*
echo.
pause
