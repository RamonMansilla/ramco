# RAMCO - Lanzador de la app
# Detecta el tipo de proyecto y lo levanta.
# Uso: .\Start-RamcoApp.ps1 -Root "C:\ruta\al\repo"

param(
    [Parameter(Mandatory = $true)][string]$Root
)

$ErrorActionPreference = 'Stop'

function Info($msg) { Write-Host "  $msg" -ForegroundColor Cyan }
function Warn($msg) { Write-Host "  $msg" -ForegroundColor Yellow }
function Fail($msg) { Write-Host "  $msg" -ForegroundColor Red; exit 1 }

if (-not (Test-Path $Root)) { Fail "No existe la carpeta: $Root" }

# --- 1. Proyecto Node (package.json) ---
$pkgPath = Join-Path $Root 'package.json'
if (Test-Path $pkgPath) {
    $pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json

    $pm = 'npm'
    if (Test-Path (Join-Path $Root 'pnpm-lock.yaml')) { $pm = 'pnpm' }
    elseif (Test-Path (Join-Path $Root 'yarn.lock')) { $pm = 'yarn' }

    if (-not (Test-Path (Join-Path $Root 'node_modules'))) {
        Info "Instalando dependencias con $pm (puede tardar)..."
        Push-Location $Root
        & $pm install
        $code = $LASTEXITCODE
        Pop-Location
        if ($code -ne 0) { Fail 'Fallo la instalacion de dependencias.' }
    }

    $scriptName = $null
    if ($pkg.scripts) {
        $names = $pkg.scripts.PSObject.Properties.Name
        foreach ($cand in @('dev', 'start', 'serve', 'preview')) {
            if ($names -contains $cand) { $scriptName = $cand; break }
        }
    }
    if ($scriptName) {
        Info "Ejecutando: $pm run $scriptName"
        Push-Location $Root
        & $pm run $scriptName
        $code = $LASTEXITCODE
        Pop-Location
        exit $code
    }
    Warn 'El package.json no tiene script dev/start/serve/preview.'
}

# --- 2. Sitio estatico (HTML) ---
$candidates = @(
    'index.html',
    'devting\landing\index.html',
    'landing\index.html',
    'public\index.html',
    'site\index.html'
)
foreach ($c in $candidates) {
    $p = Join-Path $Root $c
    if (Test-Path $p) {
        Info "Abriendo en el navegador: $c"
        Start-Process $p
        exit 0
    }
}

# --- 3. Proyecto Python ---
foreach ($py in @('app.py', 'main.py', 'manage.py')) {
    $p = Join-Path $Root $py
    if (Test-Path $p) {
        Info "Ejecutando Python: $py"
        Push-Location $Root
        & python $py
        $code = $LASTEXITCODE
        Pop-Location
        exit $code
    }
}

Fail 'No encontre una app, landing ni script para levantar. Revisa el contenido del repo.'
