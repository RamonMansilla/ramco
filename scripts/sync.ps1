# RAMCO - Sincroniza tu trabajo local con GitHub
# Hace commit de los cambios, rebase sobre la rama remota y push.
# Uso: doble clic en sync.bat

$ErrorActionPreference = 'Stop'

$Root = Split-Path $PSScriptRoot -Parent

Write-Host ''
Write-Host '=== RAMCO - sync con GitHub ===' -ForegroundColor Cyan

git -C $Root add -A
$pending = git -C $Root status --porcelain
if ($pending) {
    $msg = 'sync: ' + (Get-Date -Format 'yyyy-MM-dd HH:mm')
    git -C $Root commit -m $msg | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host '  No se pudo crear el commit.' -ForegroundColor Red
        exit 1
    }
    Write-Host "  Commit creado: $msg" -ForegroundColor Green
}
else {
    Write-Host '  Sin cambios nuevos para commitear.' -ForegroundColor DarkGray
}

$current = git -C $Root rev-parse --abbrev-ref HEAD
Write-Host "  Rama actual: $current" -ForegroundColor DarkGray

git -C $Root fetch origin
$remoteHead = git -C $Root ls-remote --heads origin $current
if ($remoteHead) {
    Write-Host "  Rebase sobre origin/$current ..." -ForegroundColor Cyan
    git -C $Root rebase "origin/$current"
    if ($LASTEXITCODE -ne 0) {
        git -C $Root rebase --abort
        Write-Host '  Hay conflictos: rebase cancelado. Resuelvelos manualmente.' -ForegroundColor Red
        exit 1
    }
}

Write-Host "  Push a origin/$current ..." -ForegroundColor Cyan
git -C $Root push -u origin $current
if ($LASTEXITCODE -ne 0) {
    Write-Host '  No se pudo hacer push (revisa credenciales de GitHub).' -ForegroundColor Red
    exit 1
}

Write-Host '  Sincronizado.' -ForegroundColor Green
