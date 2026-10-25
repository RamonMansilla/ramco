# RAMCO - Ejecuta SIEMPRE la ultima version del remoto (rama main)
# Clona/actualiza una copia limpia en %LOCALAPPDATA%\ramco\remote y la levanta.
# Uso: doble clic en run-remote.bat

$ErrorActionPreference = 'Stop'

$RemoteUrl    = 'https://github.com/RamonMansilla/ramco.git'
$RemoteBranch = 'main'
$Dir          = Join-Path $env:LOCALAPPDATA 'ramco\remote'

Write-Host ''
Write-Host '=== RAMCO - app desde el remoto (main) ===' -ForegroundColor Cyan

if (-not (Test-Path (Join-Path $Dir '.git'))) {
    if (Test-Path $Dir) { Remove-Item $Dir -Recurse -Force }
    New-Item -ItemType Directory -Force -Path (Split-Path $Dir -Parent) | Out-Null
    Write-Host "  Clonando $RemoteUrl ..." -ForegroundColor Cyan
    git clone --branch $RemoteBranch $RemoteUrl $Dir
    if ($LASTEXITCODE -ne 0) {
        Write-Host '  No se pudo clonar el repositorio.' -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "  Actualizando desde origin/$RemoteBranch ..." -ForegroundColor Cyan
    git -C $Dir fetch --prune origin
    git -C $Dir reset --hard "origin/$RemoteBranch"
    if ($LASTEXITCODE -ne 0) {
        Write-Host '  No se pudo actualizar la copia remota.' -ForegroundColor Red
        exit 1
    }
}

$version = git -C $Dir log -1 --format='%h %s'
Write-Host "  Version: $version" -ForegroundColor DarkGray
Write-Host "  Carpeta: $Dir" -ForegroundColor DarkGray

& (Join-Path $PSScriptRoot 'Start-RamcoApp.ps1') -Root $Dir
