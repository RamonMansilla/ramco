# RAMCO - Ejecuta la version LOCAL (rama main-local) con tus cambios
# No hace pull: usa exactamente lo que tienes en disco.
# Uso: doble clic en run-local.bat

$ErrorActionPreference = 'Stop'

$LocalBranch = 'main-local'
$Root        = Split-Path $PSScriptRoot -Parent

Write-Host ''
Write-Host '=== RAMCO - app local (rama main-local) ===' -ForegroundColor Cyan

git -C $Root rev-parse --is-inside-work-tree 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  La carpeta no es un repositorio git: $Root" -ForegroundColor Red
    exit 1
}

$current = git -C $Root rev-parse --abbrev-ref HEAD
if ($current -ne $LocalBranch) {
    $dirty = git -C $Root status --porcelain
    if ($dirty) {
        Write-Host "  Tienes cambios sin guardar en '$current'." -ForegroundColor Yellow
        Write-Host '  Haz commit o guarda los cambios antes de cambiar de rama.' -ForegroundColor Yellow
        exit 1
    }
    $exists = git -C $Root branch --list $LocalBranch
    if ($exists) {
        git -C $Root switch $LocalBranch
        if ($LASTEXITCODE -ne 0) { Write-Host '  No se pudo cambiar de rama.' -ForegroundColor Red; exit 1 }
    }
    else {
        git -C $Root switch -c $LocalBranch
        if ($LASTEXITCODE -ne 0) { Write-Host '  No se pudo crear la rama.' -ForegroundColor Red; exit 1 }
    }
}

$version = git -C $Root log -1 --format='%h %s'
Write-Host "  Rama: $LocalBranch | $version" -ForegroundColor DarkGray
Write-Host "  Carpeta: $Root" -ForegroundColor DarkGray

& (Join-Path $PSScriptRoot 'Start-RamcoApp.ps1') -Root $Root
