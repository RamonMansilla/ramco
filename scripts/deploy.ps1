# RAMNCO - Publica el sitio en Vercel
#
# Sirve para dos casos:
#   1) Doble clic en `publicar.bat`  -> sube cambios y publica.
#   2) Cron / tarea programada       -> `powershell -File scripts\deploy.ps1 -Latest`
#
# El token de Vercel se lee de la variable de entorno RAMNCO_VERCEL_TOKEN
# o del archivo %USERPROFILE%\.ramnco-vercel-token (fuera del repositorio).

param(
    [switch]$Latest,
    [string]$Token,
    [string]$RepoSlug = 'RamonMansilla/ramco'
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
$env:VERCEL_TELEMETRY_DISABLED = '1'

function Get-VercelToken {
    param([string]$Explicit)
    if ($Explicit) { return $Explicit.Trim() }
    if ($env:RAMNCO_VERCEL_TOKEN) { return $env:RAMNCO_VERCEL_TOKEN.Trim() }
    $file = Join-Path $env:USERPROFILE '.ramnco-vercel-token'
    if (Test-Path $file) { return (Get-Content $file -Raw).Trim() }
    return $null
}

$Token = Get-VercelToken -Explicit $Token
if (-not $Token) {
    Write-Host 'Falta el token de Vercel.' -ForegroundColor Red
    Write-Host 'Crealo en https://vercel.com/account/tokens y ejecuta setup-vercel.bat' -ForegroundColor Yellow
    exit 1
}

# 1. Verificar acceso a Vercel
try {
    $vercel = Invoke-RestMethod -Uri 'https://api.vercel.com/v2/user' -Headers @{ Authorization = "Bearer $Token" }
    Write-Host ("Vercel: " + $vercel.user.username) -ForegroundColor Green
}
catch {
    Write-Host 'El token de Vercel no es valido o fue revocado.' -ForegroundColor Red
    exit 1
}

# 2. Modo -Latest: solo publicar si `main` avanzo
if ($Latest) {
    Push-Location $Root
    try {
        git fetch origin main --quiet
        $local = (git rev-parse HEAD).Trim()
        $remote = (git rev-parse 'origin/main').Trim()
        $stateFile = Join-Path $env:LOCALAPPDATA 'ramnco\last-deployed.txt'
        New-Item -ItemType Directory -Force -Path (Split-Path $stateFile -Parent) | Out-Null
        $last = if (Test-Path $stateFile) { (Get-Content $stateFile -Raw).Trim() } else { '' }

        if ($local -eq $remote -and $last -eq $remote) {
            Write-Host "Sin cambios en main ($remote). Nada que publicar." -ForegroundColor DarkGray
            exit 0
        }
        if ($last -eq $remote) {
            Write-Host "main ya fue publicado ($remote)." -ForegroundColor DarkGray
            exit 0
        }
        Write-Host "main avanzó: $last -> $remote. Publicando..." -ForegroundColor Cyan
    }
    finally { Pop-Location }
}

# 3. Publicar
Push-Location $Root
try {
    # cmd.exe trata la salida de la CLI como texto normal (PowerShell la
    # interpretaria como errores por escribir en stderr).
    cmd /c "npx --yes vercel@latest deploy --prod --yes --token $Token 2>&1"
    $code = $LASTEXITCODE

    if ($code -ne 0) {
        Write-Host 'El despliegue fallo.' -ForegroundColor Red
        exit 1
    }

    if ($Latest) {
        $remote = (git rev-parse 'origin/main').Trim()
        $stateFile = Join-Path $env:LOCALAPPDATA 'ramnco\last-deployed.txt'
        New-Item -ItemType Directory -Force -Path (Split-Path $stateFile -Parent) | Out-Null
        Set-Content -LiteralPath $stateFile -Value $remote -NoNewline
        Write-Host "Publicado $remote" -ForegroundColor Green
    } else {
        Write-Host 'Listo: https://ramnco.vercel.app' -ForegroundColor Green
    }
}
finally { Pop-Location }
